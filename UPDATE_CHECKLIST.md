# Update Checklist

1. Review `/data/watchlist.json`.
2. Run `npm run update:auto`.
3. Inspect `tmp/source-fetch-report.json` and `reports/latest-update.md`.
4. Check whether any claims are marked `needs_review`.
5. Confirm current status language is still accurate.
6. Confirm dead proposals are not shown as active.
7. Confirm county estimates identify source type and proposal version.
8. Run `npm run check`.
9. Commit with a clear message.
