# Methodology

Florida Property Tax Tracker is built around source-backed claims. Facts live in `/data`, and the interface renders those records rather than hardcoding legislative status in Astro components.

## Source Priority

The tracker prefers official legislative, election, fiscal, and executive sources. Stakeholder sources can be used for positions or estimates when clearly labeled. News sources are reserved for public statements, political context, and events not yet reflected in official records.

## Claim Rules

Every displayed factual claim must map to at least one source ID in `/data/sources.json`. Claims can be confirmed, likely, disputed, outdated, retired, or needs review. Historical claims are preserved when proposal status changes.

## Page Roles

The homepage is a high-level overview for quick readers, led by a monthly ballot runway that shows where the 2026 path stands as of the last source check. The details page expands the legislative record, claims, proposals, and timeline. The county page is an advanced data view and does not compare county impacts until the tracker has version-labeled sources.

## Display Preferences

The interface supports light, dark, and system theme modes. System mode follows the visitor's operating-system preference. The language picker supports English and Spanish; official source titles may remain in their original language so readers can verify the source record.

## Procedural Colors

Green means a completed procedural step. Yellow means watching or uncertain. Red means blocked, dead, or not currently moving. Gray means a later checkpoint has not been reached. These colors describe process only and do not indicate support or opposition. Future months on the runway are watch checkpoints, not predictions.

## Automation

The automated update workflow fetches watched sources, detects changed pages or PDFs, validates claim/source relationships, runs proofreading checks, builds the static site, and prepares an update report. Ambiguous changes are marked `needs_review` rather than published as confirmed.

## Corrections

Correction requests should identify the challenged claim, provide a source, explain the requested correction, and label the source type. Official sources are preferred for bill status, ballot status, fiscal analysis, and special-session calls.
