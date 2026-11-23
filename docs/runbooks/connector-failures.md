# Runbook: advisory connector failures

## Upstream format change

Signs: every new advisory is rejected by the contract check; no release of ours since the last good record.

1. Confirm no release of ours since the last good record (GitHub releases). If nothing of ours changed, a rollback will not help.
2. Mitigate: turn on the `advisory-data-delayed` flag. The map shows "Advisory data delayed since <time>" and dependent drafts are held. No code change.
3. Fix: add a sample of the new format as a failing contract test, then map the new fields. Keep the old format working.
4. Recover: backfill the window since the last good record and re-check dependent scores.
