# Update Checklist

1. Review `/data/watchlist.json`.
2. Run `npm run update:auto`.
3. Inspect `tmp/source-fetch-report.json` and `reports/latest-update.md`.
4. Inspect `reports/source-cache-manifest.json`; this is the persisted baseline used by the scheduled GitHub Actions update.
5. Check whether any watched source changes need a manual review issue or claim update.
6. Check whether any claims are marked `needs_review`.
7. Confirm current status language is still accurate.
8. Confirm `/data/overview.json` uses the right procedural colors: green completed, yellow watching or uncertain, red blocked or dead, gray not reached.
9. Confirm `monthly_runway.as_of` matches the latest successful source check and future months are labeled as watch checkpoints, not predictions.
10. Confirm dead proposals are not shown as active.
11. Confirm county estimates identify source type and proposal version.
12. Confirm the homepage remains high-level and deeper details remain on `/details/`, `/timeline/`, `/counties/`, or `/sources/`.
13. Confirm lower homepage sections share the same centered shell as the runway.
14. Confirm theme controls work in system, light, and dark mode.
15. Confirm Spanish language mode translates new user-facing copy.
16. Run `npm run check`.
17. Commit with a clear message.
