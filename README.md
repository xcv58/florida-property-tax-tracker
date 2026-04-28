# Florida Property Tax Tracker

A neutral static civic tracker for Florida's 2026 property tax elimination proposals and materially related reforms.

The site tracks:

- Current legislative status.
- HJR/SJR proposals.
- Special-session activity.
- Ballot path.
- Fiscal-impact documents.
- County-level impact data.
- Source documents.
- Update history.

## Core Rule

No claim appears on the site without a source.

## Tech Stack

- Astro
- TypeScript
- Static output
- Vercel primary deployment
- GitHub Pages backup deployment

## Commands

```sh
npm install
npm run dev
npm run update:auto
npm run check
npm run build
```

## GitHub CLI Setup

```sh
gh auth login
gh repo create florida-property-tax-tracker --public --clone
cd florida-property-tax-tracker
```

This local scaffold does not create a remote repository automatically. After creating one, set:

```sh
gh variable set SITE_NAME --body "Florida Property Tax Tracker"
gh variable set PRIMARY_DEPLOY_TARGET --body "vercel"
gh variable set BACKUP_DEPLOY_TARGET --body "github-pages"
gh variable set TRACKER_TIMEZONE --body "America/New_York"
```

## Deployment

Use Vercel's GitHub integration as the primary deployment:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

GitHub Pages backup deployment is available through `.github/workflows/deploy-github-pages.yml`.

## Contributing

Corrections and source suggestions are welcome through GitHub issues. Every factual correction must include a source. Official legislative, fiscal, and election sources are preferred.
