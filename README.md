# oncall-sandbox

A small "client" service used to rehearse on-call with Protean. It polls an upstream advisory
feed, checks every record against `contracts/advisories.v2.json`, and **fails closed**: a record
that doesn't match is rejected, reported to Sentry, and never reaches `/map`.

| Route | What it does |
|---|---|
| `/tick` | Poll the feed once (called every minute by an external cron) |
| `/map` | What users see; shows a "data delayed" banner when the `advisory-data-delayed` flag is on |
| `/version` | The running version |

Environment: `SENTRY_DSN`, `FEED_URL`, `GB_CLIENT_KEY`, `PORT`. Never commit secrets.

`npm start` · `npm test` · releases via the `release` workflow (manual, with a version).

Sample data only. Nothing here is real.
