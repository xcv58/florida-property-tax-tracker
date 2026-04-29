# Publishing Workflow

## Primary Deployment

Vercel deploys the Astro static site from the main branch after the GitHub repository is connected.

Canonical production URL:

```text
https://fl-tax.jenny.media/
```

Recommended Vercel settings:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

## Backup Deployment

GitHub Pages deploys the static build from `dist` using `.github/workflows/deploy-github-pages.yml`.

Backup URL:

```text
https://xcv58.github.io/florida-property-tax-tracker/
```

The backup build uses:

- `PUBLIC_SITE_URL=https://xcv58.github.io`
- `PUBLIC_BASE_PATH=/florida-property-tax-tracker`
- `PUBLIC_CANONICAL_URL=https://fl-tax.jenny.media`
- `PUBLIC_INDEXING=false`

That keeps backup links working under the GitHub Pages project path while telling search engines that `fl-tax.jenny.media` is the canonical publication.

## SEO Artifacts

The production build generates:

- `/sitemap.xml`
- `/robots.txt`
- `/feed.xml`
- `/site.webmanifest`
- Open Graph and Twitter card metadata
- JSON-LD `WebSite`, `WebPage`, and homepage `Dataset` records
- `/404.html` marked `noindex`

The social preview image is `/og-image.png`, generated from `/og-image.svg`. Keep it neutral and avoid hardcoding time-sensitive status claims unless the image is updated with the same release.

## Automated Publishing

The scheduled update workflow in `.github/workflows/update.yml` runs once per day at 10:15 UTC. It fetches watched sources, compares them with the persisted hash manifest in `reports/source-cache-manifest.json`, validates data, rebuilds the search index, generates the latest update report, and builds the site.

If validation passes:

- Data changes are committed.
- The source hash manifest is committed when changed.
- Source-fetch reports are committed when watched source content changes.
- Vercel deploys through the GitHub integration.
- GitHub Pages can publish the backup build.
- A GitHub issue is opened when watched source content changes and needs review.

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

`npm run build` also runs the SEO validation script after Astro writes `dist`.

Before publishing, confirm:

- The homepage is still an overview and detailed source-heavy material remains on `/details/`, `/timeline/`, `/counties/`, or `/sources/`.
- Procedural colors still mean green completed, yellow watching or uncertain, red blocked or dead, and gray not reached.
- The monthly runway uses source-backed dates and does not present future checkpoints as expected outcomes.
- `/robots.txt` allows indexing on the Vercel build and points to `https://fl-tax.jenny.media/sitemap.xml`.
- `/sitemap.xml` contains only canonical `fl-tax.jenny.media` URLs.
- GitHub Pages backup remains noindexed.
- System, light, and dark themes still work.
- English and Spanish language modes still work.
- Correction links open the GitHub issue template chooser.

After deployment, verify:

```sh
curl -I https://fl-tax.jenny.media/
curl https://fl-tax.jenny.media/robots.txt
curl https://fl-tax.jenny.media/sitemap.xml
curl https://fl-tax.jenny.media/feed.xml
```
