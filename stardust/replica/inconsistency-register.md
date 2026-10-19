# Inconsistency register — Gaggenau

Pure replica: no entry is applied in this run. Deferred entries ride along as a handover list.

## R-01 — Content cap differs between the marketing home and the store templates

- **Evidence:** cap-probe (DESIGN.json extensions.breakpoints): /de/de contentMaxWidth 1400 px with a fluid shell; /, /general/legal shell 1200 px (`body.site-structure-level-1 > div.g-container`).
- **Finding:** two front-end builds (marketing app vs store) cap content at different widths; each template is internally consistent.
- **Minimal change:** none in this run — each template keeps its own cap.
- **Status:** deferred
- **Where:** landing vs region-selector / static

## R-02 — Single-section module cap on the region accordion

- **Evidence:** cap-probe register line: module cap 1167 px on `#region-toggle-6 > div.region` (https://www.gaggenau.com/).
- **Finding:** one accordion panel carries its own cap; the others follow the 1200 px shell.
- **Minimal change:** none — replicated as captured.
- **Status:** deferred
- **Where:** region-selector
