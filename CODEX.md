# CODEX.md

## Goal

Maintain and improve Florida Property Tax Tracker.

This is an Astro static site. Facts live in `/data`. UI lives in `/src`.

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
- Dead bills are not shown as active.
- County estimates identify source and proposal version.
- Build passes.
