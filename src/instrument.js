// Loaded before anything else (`node --import`), as Sentry requires.
// Sentry v11 sends Sentry.logger.* calls as Logs by default; no option is needed.
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.RELEASE ?? process.env.npm_package_version,
  environment: process.env.SENTRY_ENVIRONMENT ?? "production",
});
