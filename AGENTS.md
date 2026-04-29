# AGENTS.md

You are working on Florida Property Tax Tracker, a neutral static civic tracker for Florida's 2026 property tax elimination proposals and materially related reforms.

## Core Rules

1. Do not add unsourced factual claims.
2. Every displayed claim must map to at least one source ID in `/data/sources.json`.
3. Prefer official sources for bill status, fiscal analysis, ballot status, and special-session calls.
4. Use stakeholder and news sources only when clearly labeled.
5. Do not present dead bills as active.
6. Do not overwrite historical facts. Add new entries or mark old claims as outdated.
7. Keep the tone neutral and taxpayer-friendly.
8. Do not use advocacy language.
9. Do not bury facts inside Astro components.
10. Update data files first, then components only if display changes are needed.

## Information Architecture

- Keep `/` simple and high-level: current status, the monthly ballot runway, known unknowns, and links to deeper views.
- Use `/details/` for the secondary legislative dossier: claims, proposal history, and expanded timeline context.
- Use `/counties/` for advanced county data and keep estimates blank until version-labeled sources exist.
- Use `/sources/` for the full source library rather than crowding the homepage with every source chip.

## Procedural Color Rules

Colors are procedural, not advocacy language:

- Green means a step is completed.
- Yellow means watching or uncertain.
- Red means blocked, dead, or not currently moving.
- Gray means a later checkpoint has not been reached.

Do not use green to imply support or red to imply opposition.

The homepage runway lives in `/data/overview.json` under `monthly_runway`. Treat future months as watch checkpoints, not predictions. Keep the numbered dependency path for detailed pages.

## Theme And Language

- Keep light, dark, and system theme modes working. System mode should honor `prefers-color-scheme`.
- Keep English and Spanish available from the header language picker.
- Official source titles may remain in their original language. Translate tracker UI, summaries, labels, and explanatory copy.
- Add new translated UI strings to `/src/utils/translations.ts` when adding user-facing copy.

## Standard Update Process

1. Read `/data/watchlist.json`.
2. Run `npm run fetch:sources`.
3. Run `npm run parse:sources`.
4. Run `npm run update:claims`.
5. Inspect changed files.
6. Run `npm run validate:data`.
7. Run `npm run proofread`.
8. Run `npm run build`.
9. Update `/data/update-log.json`.
10. Commit changes with a clear message.

## When New Information Appears

If an official source changes:

- Add or update the source record.
- Add a new claim or update an existing claim status.
- Add a timeline entry if the change is material.
- Update proposal status if applicable.
- Update homepage status only if the change affects current status.

If the source is ambiguous:

- Mark the claim as `needs_review`.
- Do not present it as confirmed.
- Add a GitHub issue explaining what needs human review.

## Do Not Do These Things

- Do not infer that a proposal is active because a politician mentioned it.
- Do not infer that HJR 203 is revived unless an official source says so.
- Do not combine county-impact estimates from different proposal versions without labeling them.
- Do not use old fiscal analyses as if they describe newer bill text.
- Do not summarize a PDF unless it is listed in `/data/sources.json`.
- Do not remove source links.
- Do not use phrases such as "guaranteed," "certain," "tax grab," "fake," or "scam."
