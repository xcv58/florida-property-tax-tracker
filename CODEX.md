# CODEX.md

## Goal

Maintain and improve Florida Property Tax Tracker.

This is an Astro static site. Facts live in `/data`. UI lives in `/src`.

## Page Roles

- `/` is the public overview dashboard. Keep it concise and visually scannable, with the monthly ballot runway as the main global view.
- `/details/` is the secondary dossier for readers who want claims, proposal history, and timeline context.
- `/counties/` is the advanced data page for county impacts.
- `/sources/` is the source library.

## Status Colors

Use procedural colors consistently:

- Green: completed procedural step.
- Yellow: watching or uncertain.
- Red: blocked, dead, or not currently moving.
- Gray: later checkpoint not reached.

These colors must not imply support or opposition to a proposal.

The monthly runway should show time and current posture. The detailed procedural path should preserve dependencies and source-heavy context.

## Before Editing

```sh
npm install
npm run check
```

## To Update Tracker Content

```sh
npm run update:auto
```

Then inspect:

```sh
git diff
```

Check:

- Did sources change?
- Were claims updated?
- Are any claims marked `needs_review`?
- Did the homepage summary change?
- Did the monthly runway or overview path in `/data/overview.json` change?
- Did timeline entries get added?
- Did county data change?

## To Add a Manual Source

1. Add source to `/data/sources.json`.
2. Add or update claim in `/data/claims.json`.
3. Add timeline, proposal, or county entry if needed.
4. Run:

```sh
npm run validate:data
npm run proofread
npm run build
```

## To Publish

Vercel publishes automatically from the main branch after the repository is connected.

GitHub Pages backup publishes from the GitHub Pages workflow.

## Final Checklist

- No unsourced claims.
- All source IDs resolve.
- Homepage last verified date is correct.
- Current status is not overstated.
- Homepage remains a high-level overview, not a full source dossier.
- Homepage runway uses month-scale checkpoints and does not imply future action is certain.
- Dead bills are not shown as active.
- County estimates identify source and proposal version.
- Build passes.
