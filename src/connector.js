// Polls the upstream advisory feed. Valid records reach the map; invalid ones are
// rejected, reported to Sentry and never shown (fail closed).
import * as Sentry from "@sentry/node";
import { ContractError, validateAdvisory } from "./contract.js";

const MAX_KEPT = 200;

export const state = { accepted: [], seenIds: new Set(), lastGoodAt: null, rejected: 0, lastPollAt: null };

export async function pollFeed(feedUrl) {
  // GitHub Pages caches for minutes; a query string gets a fresh copy.
  const res = await fetch(`${feedUrl}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`feed fetch failed: ${res.status}`);
  const body = await res.json();
  state.lastPollAt = new Date().toISOString();
  for (const advisory of body.advisories ?? []) {
    if (state.seenIds.has(advisory?.id)) continue;
    try {
      state.accepted.push(validateAdvisory(advisory));
      state.seenIds.add(advisory.id);
      state.lastGoodAt = new Date().toISOString();
    } catch (err) {
      if (!(err instanceof ContractError)) throw err;
      state.rejected++;
      Sentry.logger.error("advisory rejected by contract", {
        advisoryId: advisory?.id ?? null,
        feedVersion: body.version ?? null,
        reason: err.message,
      });
      Sentry.captureException(err, {
        tags: { component: "advisory-watcher", feed_version: String(body.version ?? "unknown") },
      });
    }
  }
  if (state.accepted.length > MAX_KEPT) state.accepted.splice(0, state.accepted.length - MAX_KEPT);
  return { accepted: state.accepted.length, rejected: state.rejected };
}
