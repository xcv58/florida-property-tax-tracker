# Update Checklist

1. Review `/data/watchlist.json`.
2. Run `npm run update:auto`.
3. Inspect `tmp/source-fetch-report.json` and `reports/latest-update.md`.
4. Check whether any claims are marked `needs_review`.
5. Confirm current status language is still accurate.
6. Confirm `/data/overview.json` uses the right procedural colors: green completed, yellow watching or uncertain, red blocked or dead, gray not reached.
7. Confirm `monthly_runway.as_of` matches the latest successful source check and future months are labeled as watch checkpoints, not predictions.
8. Confirm dead proposals are not shown as active.
9. Confirm county estimates identify source type and proposal version.
10. Confirm the homepage remains high-level and deeper details remain on `/details/`, `/timeline/`, `/counties/`, or `/sources/`.
11. Run `npm run check`.
12. Commit with a clear message.
