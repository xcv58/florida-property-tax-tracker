# Publishing Workflow

## Primary Deployment

Vercel deploys the Astro static site from the main branch after the GitHub repository is connected.

Recommended Vercel settings:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

## Backup Deployment

GitHub Pages deploys the static build from `dist` using `.github/workflows/deploy-github-pages.yml`.

## Automated Publishing

The scheduled update workflow runs source checks and builds the site.

If validation passes:

- Data changes are committed.
- Vercel deploys through the GitHub integration.
- GitHub Pages can publish the backup build.

If validation fails:

- No confirmed claims are published.
- A GitHub issue is opened.
- Ambiguous claims are marked `needs_review`.

## Manual Publishing

```sh
npm run update:auto
npm run build
git add .
git commit -m "Update tracker"
git push
```

Before publishing, confirm the homepage is still an overview and that detailed source-heavy material remains on `/details/`, `/timeline/`, `/counties/`, or `/sources/`. Check that procedural colors still mean green completed, yellow watching or uncertain, red blocked or dead, and gray not reached. Confirm the monthly runway uses source-backed dates and does not present future checkpoints as expected outcomes. Check system, light, and dark themes, and spot-check Spanish language mode before pushing.
