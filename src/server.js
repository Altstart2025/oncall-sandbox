import { createServer } from "node:http";
import * as Sentry from "@sentry/node";
import { pollFeed, state } from "./connector.js";
import { isDataDelayed } from "./flags.js";

const FEED_URL = process.env.FEED_URL ?? "https://altstart2025.github.io/oncall-feed/feed/advisories.json";
const PORT = Number(process.env.PORT ?? 3000);

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    if (path === "/tick") return json(res, 200, await pollFeed(FEED_URL));
    if (path === "/map") {
      const delayed = await isDataDelayed();
      return json(res, 200, {
        banner: delayed ? `Advisory data delayed since ${state.lastGoodAt ?? "unknown"}` : null,
        draftsHeld: delayed,
        lastGoodAt: state.lastGoodAt,
        lastPollAt: state.lastPollAt,
        rejected: state.rejected,
        advisories: state.accepted.slice(-20),
      });
    }
    if (path === "/version") return json(res, 200, { version: process.env.npm_package_version ?? null });
    return json(res, 200, { ok: true });
  } catch (err) {
    Sentry.captureException(err);
    return json(res, 500, { error: "internal error" });
  }
});

server.listen(PORT, () => console.log(`advisory-watcher listening on ${PORT}`));
