# Journal — Gaggenau replica migration

## Extract — 7 planned pages captured live, three page types (2026-10-16)

- Crawled exactly the 7 site-plan pages with `crawl.mjs --pages … --dynamics`: 7/7 live (HTTP 200, Playwright provenance).
- The consentmanager banner (`.cmpboxbtnyes`) appears ~2.3 s after load, after the crawler's dismissal pass, and baked into the crawl screenshots. Clean ground-truth recaptures with `stitch-shot --consent .cmpboxbtnyes` live in `current/assets/screenshots/clean/`; every later instrument passes the same selector.
- /de/de stitched capture stalls: document reports 4508 px at the top and 4456 px after scrolling (52 px scroll-state shrink). To handle at the gate.
- Page types: landing (de-de), region-selector (index, energylabel), static (general-imprint, general-legal, general, confirmation).
- Fonts: brand-proprietary Gaggenau Display/Text, self-hosted by the brand on its own origin (two builds: marketing-app and store). Harvested to `current/assets/fonts/`.
- Cap model: store shell 1200 px; marketing home content 1400 px (fluid shell) → register candidate.
- Capture gap: /de/de links 10 first-level targets outside the fixed site plan; recorded as scope debt (the plan is fixed for this run).

## Preserve-direction — verbatim promotion, register of 2 deferred items, dynamics detect + triage (2026-10-16)

- Promoted current/PRODUCT.md, DESIGN.md, DESIGN.json verbatim to the root (DESIGN.json added to .hlxignore so EDS never serves it). direction.md records preserve mode.
- Inconsistency register: R-01 (1400 vs 1200 content cap between the two front-end builds) and R-02 (single-section 1167 px cap) — both deferred; pure replica.
- Dynamics detect (3 archetypes, 20 findings) and triage: region accordion and mega-nav rebuild natively; settled-DOM snapshot for client-rendered slots; tags, CMP, GraphQL, locales and account/commerce batched as owner decisions with interim tiers (nothing decided-out).

## Recreate — static archetype (general-legal) passed at 1440 and 360 (2026-10-16)

- Built from the settled DOM with `stardust/scripts/build/store-proto.cjs` (verbatim text nodes, clean markup) + `css/store-canon.css` (shared store chrome) + `css/static.css`.
- Instrument-driven fixes: margin containment on heading/text wrappers (flow-root), the external-link glyph (`.a-link-external:after`, \e02a) the capture missed, inline-block whitespace in the footer lists, hidden mobile-only chrome (Close, Overview).
- Final: 1440 0.01 % / Δh 0, 360 0.05 % / Δh 0, 0 structural 🔴, chrome bands ≥ 99.79 %, cap PASS, clipped 0.
- Motion: link/footer hovers implemented; `.nav-sticky.is-active` on scroll-up is dead (0 px bar).

## Recreate — region-selector archetype (index) passed at 1440 and 360 (2026-10-16)

- Same builder, new modules: text+media table-cell layout, teaser heading, country accordion (`css/region.css`, `js/region.js`), rehosted media3.bosch-home.com renditions (450/600/900/1200, jpg+webp).
- iter1 live capture carried the consent scrim (58 % false diff) — re-took live.png with `stitch-shot --consent .cmpboxbtnyes`; gate.sh reuses it.
- Fixes off the instruments: empty-module margin collapse (flow-root ≥769), list padding on the g-col wrapper, accordion titles as links (role parity), hidden "See more", teaser 50 % content column and `.region` wrapper (cap row).
- Final: 1440 0.12 % / Δh 0, 360 0.38 % / Δh 0, 0 🔴, chrome ≥ 99.79 %, cap PASS. Motion: 400 ms max-height accordion implemented, parity.

## Recreate — landing archetype (de-de) passed at 1440 and 360; all three archetypes gated (2026-10-16)

- New builder `stardust/scripts/build/landing-proto.mjs` (+ `landing-base.css`): the sherpa (React/emotion) page is re-authored as semantic markup from the captured DOM; `css/landing.css` lifts the source's own emotion rules by mapping each source class to the semantic class it styles (vendor prefixes dropped, `min-width: 0px` unwrapped). Media rehosted from media3.bsh-group.com at 400/500/800/1600 webp; logo + social icons harvested.
- Instrument limit: the sticky header compacts on scroll (doc 4508 → 4456 px at 1440), which makes stitch-shot's 900 px chunking stall on BOTH sides; 1440 is stitched at `--vh 1000` on live and build, pixel-compare run directly, `--full` probes run individually with gate.sh's own invocations. 360 runs through gate.sh unchanged.
- Fixes off the instruments: verbatim trailing whitespace in teaser descriptions (content-diff MISSING CTA), whitespace inside the teaser links, compact-logo slot collapsed to 0 width at top (chrome-parity Δx +144), accordion panels filled on open as on the source.
- Final: 1440 2.03 % / Δh 0, 360 3.14 % / Δh 0, 0 structural 🔴, chrome header 100 % / footer ≥ 99.66 %, cap PASS, clipped 0. Prototype tables: 3/3 PASS at 1440 and 360.
- Motion: header compact morph, slider (345 px step, 300 ms), footer accordion (harvested linear() open + chevron −180°) implemented; teaser-link hover dead on live.

## Migrate plan — 3 archetypes and 4 siblings planned over three templates (2026-10-16)

- Path A (archetype, gated): de-de (landing), index (region-selector), general-legal (static). Path A′ (sibling): energylabel → index; general, confirmation, general-imprint → general-legal. No Path B.
- Precondition met: every template's archetype passed at 1440 and 360 (stardust/replica/progress.json). Render clusters run inside C-deliver, each after its template's archetype is live and gated on the preview origin. Units in stardust/migrate/progress.json.

## A-inventory — 3 archetypes rendered and inventoried; siblings join after their render units (2026-10-16)

- Rendered the three gated archetypes into stardust/migrated/ (`migrate.mjs render de-de index general-legal --canon-css stardust/prototypes/css/store-canon.css`); modules recorded per archetype (de-de: stage, teaser-slider, category-tiles, editorial-teaser; index: content-text-media, content-teaser, region-accordion; general-legal: content-text-media).
- Inventory run WITHOUT `--state`: in archetypes-only mode siblings are matched by state `type` against archetype slugs, which never match here (types landing/region-selector/static vs slugs de-de/index/general-legal) and produced 5 templates. Siblings (energylabel → index; general, confirmation, general-imprint → general-legal) enter coverage when their render units run and inventory is re-run.
- rollout.json site: da aemcoder/52a40dc9@main, liveHost main--52a40dc9--aemcoder.aem.live. Broken-link counts at render are out-of-scope targets — E2 link audit repoints them.

## B-block — 7 distinct blocks, 8 instances; plan representative-first (2026-10-16)

- blocks.json: stage, teaser-slider, category-tiles, editorial-teaser (de-de); content-text-media (general-legal, reused by index); content-teaser, region-accordion (index).
- Chrome is not a module here: the foundation (C0) owns header/footer. Two chrome families exist — the landing page's site header/footer (de-de) and the store header/footer (index, general-*) — so C0 ships both as variants of the one header and footer block.

## B2-dynamic — curated triage re-verified against the target origin (2026-10-16)

- `dynamics-plan.mjs --target-origin https://main--52a40dc9--aemcoder.aem.page --migrated stardust/migrated`: 20 raw rows, 3 already delivered by capture (settled js-content / js-moreless text), first-party /graphql host-bound on the EDS host (1/1) — matches the curated rows in stardust/dynamic-features.md; no row changes. Self-reproducible rows (region-accordion, mega-nav) are block work inside C-deliver; owner-decision rows stay at their interim tiers.

## C-deliver unit foundation — chrome for two families live, parity quiet, frozen (2026-10-16)

- Foundation subagent authored styles/fonts (brand faces self-hosted with the licensing banner; publish decision stands), header/footer blocks rendering the landing family (/de/de: drawer menu, account, search, compact-on-scroll) and the store family (logo header, link footer) from authored docs; /nav, /footer, /de/de/nav, /de/de/footer published with `Robots | noindex`; preview-only shells at /general/legal and /de/de.
- Gate: chrome-parity at 1440 and 360 on both shells. Round 1 found the landing nav offset +144px (inline compact logo occupying layout), footer background/position, header backgrounds, store chrome box width — all fixed in one round; round 2 quiet except the recorded div→button residual and media-URL icon signatures.
- Header contract: live recorded with chrome-explore (360: 36 states depth 3; 1440: depth 2 after the 400-state run exceeded 25 min). The live open-state crops carry the consentmanager scrim (explorer has no consent dismissal), so `panel-visual` reds are measurement artifacts; to settle before done-check's header_parity. Metadata rule: /de/de carries Template landing + nav/footer rows; store pages Template store.

## C-deliver unit archetype-static — /general/legal live, gate 0.01% / 0.05% (2026-10-16)

- Block content-text-media (one cell, `split` option, auto `has-media` hook for the index page). Published-origin row on the preview host: 1440 0.01% Δh 0, 360 0.05% Δh 0, clip 0, missing 0, one round.
- presence.json in gates/all-1440 and all-360 scopes content to `.js-content=main` (the source has no `<main>`; the third-party consent button is not page content) — store-family siblings share it.
- An invented meta description was removed (replica: no fabrication); the platform's own fallback description from the first paragraph remains — source text, accepted.

## C-deliver unit archetype-region-selector — / live, gate 0.15% / 0.45% (2026-10-16)

- Blocks content-teaser and region-accordion (400 ms max-height toggle verified on preview); content-text-media reused with its has-media styling finished; /general/legal re-gated unchanged (0.01% / 0.05%).
- Store pages carry a visually hidden `<h1>` from the page title (the source has none; one h1 is a delivery-lint rule) — no visible change. Origin captures for store pages are taken with the consent button clicked (`stitch-shot --consent .cmpboxbtnyes`).
- block-roundtrip's one red is the "See more" link hidden on the source and in the prototype; logged in eds-conversion-log.md.

## C-deliver unit archetype-landing — /de/de live, gate 3.59% / 4.22% (2026-10-16)

- Blocks stage, teaser-slider, category-tiles, editorial-teaser; two fix rounds (picture `<source>` out of the flex flow for tile height; German hyphenation via block `lang` from the `/de/` path).
- The foundation pins `<html lang="en">`; the per-block override is scoped and one foundation request is queued for C-final.
- The 360 origin capture of an interrupted run caught the consent banner (62% false red); re-shot with `--consent .cmpboxbtnyes`, the row reads 4.22% Δh 0, clip 0, missing 0.

## C-deliver unit cluster-landing — no siblings; /de/de coverage recorded deployed (2026-10-16)

- The landing template has one page, its archetype; migrate render unit `landing` recorded with 0 siblings. The archetype's coverage row (left pending by the interrupted session) now reads deployed; /de/de answers 200 on preview and live.

## Migrate unit region-selector — energylabel rendered from the index encoder (2026-10-16)

- Variance probe: one content-count delta (4 text nodes vs 3), no style variants. Structural clone of index with energylabel's content; no content-teaser on this page; the accordion carries Europe only (24 rows) as on the source.
- content-diff 34/34 text nodes, 1 heading, 30 CTAs, 2 images; content/energylabel.html passes delivery-lint; images reuse index's hosted DA media.

## Migrate unit static — general, confirmation, imprint rendered from the legal encoder (2026-10-16)

- Variance probe: content-count deltas only (one content-text-media module each). Structural clones of general-legal; content-count pass on all three; content docs pass delivery-lint.
- confirmation carries a visible "Success" page title outside the content root on the source; the cluster step styles it to match (logged deviation until then). Its only image is a transparent 600×1 spacer, left out of the content doc (logged).
- general and confirmation link "homepage" to /country-selector, outside the inventory — kept as on the source, logged; E2 decides its repoint.

## C-deliver unit cluster-region-selector — /energylabel live, gate 0.07% / 0.19% (2026-10-16)

- Deployed and published from the index encoder unchanged (0 fix rounds, 0 foundation requests). Origins re-shot with consent dismissed; presence.json scopes energylabel to the same `.js-content` root as index (the consent dialog otherwise counts as MISSING).
- gate-evidence still reads the prototype-stage pixel rows as OPEN for siblings; the published rows in gates/all-<w>/ are the source of record.

## C-deliver unit cluster-static — /general, /confirmation, /general/imprint live (2026-10-16)

- New block `page-title` carries confirmation's visible "Success" h1 (values lifted from the source CSS); content-text-media unchanged. Confirmation was first gated against a local server while the block was unpushed, then re-gated on the published preview after the push: 0.01% / 1.82%, Δh 0.
- general 0.01% / 0.07%, imprint 0.01% / 0.05%; clip 0, missing 0. presence.json scopes the static siblings to `.js-content` like general-legal (the consent dialog's "Privacy settings" otherwise counts as MISSING).

## C-deliver unit gate-all — roster 7/7 PASS at 1440 and 360 (2026-10-16)

- The one queued foundation request was applied first: `<html lang>` now comes from the `/<xx>/` path (de on /de/de), pushed and code-synced; de-de re-gated 3.6% / 3.56% (360 improved from 4.22%). Foundation re-frozen.
- Roster run over a scratch state built from the coverage ledger (gate-all selects `status: deployed` pages); captures reused, de-de 1440 needs `--vh 1000` (its stitch otherwise stalls at the bottom scroll stop). Coverage updated from both summaries.

## C-deliver — 7/7 pages live and gated on the published origin (2026-10-16)

- Units: foundation, three archetypes, three clusters, gate-all, final — all done. Pages: /de/de 3.6%/3.56%, / 0.15%/0.45%, /energylabel 0.07%/0.19%, /general/legal 0.01%/0.05%, /general 0.01%/0.07%, /confirmation 0.01%/1.82%, /general/imprint 0.01%/0.05%; Δh 0, clip 0, missing 0 everywhere.
- One foundation request applied at C-final (html lang per path); one new block at cluster time (page-title).

## D-site — sitemap served 7 = assembled 7; / 200; no redirects (2026-10-16)

- `assemble.mjs --verify-origin` on aem.live: 7 served, 0 extra, 0 missing. The root answers 200 on preview and live from the `index` document. nav, footer and the de/de nav and footer carry `Robots | noindex` and are live.
- No redirect rows: every in-scope URL resolved to itself and the source root serves a page. This is recorded in eds-conversion-log.md.

## D2-dynamic — 6/6 parity checks PASS on aem.live; 4 owner decisions remain interim (2026-10-16)

- stardust/dynamics/parity.json: region accordion (6 toggles on /, 24+ country links on /energylabel), header nav, settled-DOM text, consent-gate and martech gate (no CMP or tag host requested while scaffolded off). Report: stardust/qa/dynamics-report.md.
- No listings, search or forms in scope, so no query-index is needed. Tags/CMP, GraphQL live data, locale scope and the account backend stay interim under the named owner decisions.

## E-full-site — 7/7 verified on aem.live; trailing-slash redirects published (2026-10-16)

- verify.mjs first failed 6 pages with a 404. It requests `/<path>/` because the migrated tree stores pages as `…/index.html`, and EDS 404s the trailing slash while the source answers it. Fixed for real users: a published redirects sheet with 6 rows `/<path>/ → /<path>`, all 301.
- Second pass: two pages had a broken `/country-selector` link (outside the plan). Repointed to the source and redeployed, giving 7/7 verified. Coverage stays aligned with the gate tables (7/7 PASS at both widths).
- Render check of restoreAtDelivery: the /de/de Vimeo loop plays (parity `video-plays`, 10 playback requests); parity 7/7 PASS.

## E2-link-audit — 177 hrefs GET-checked; 0 localizable left; 3 source-broken kept (2026-10-16)

- localize-links: one source-root link in /de/de/nav localized to `/` and the nav was republished; `--check` passes. 152 absolute links to targets outside the plan were kept, as scope extension.
- href audit (stardust/rollout/link-audit.json): 174/177 OK, internal 3/3 OK. The 3 not-ok links are broken on the source as well (2× 404, 1 unreachable .cn host) and were kept verbatim; they are recorded in direction.md.

## F-optimize — 0 open findings, health 100/100; 9 source-parity notes (2026-10-16)

- optimize.mjs over the 7 live pages: P1 0 · P2 0 · P3 0 open. Nine informational source-parity items (no JSON-LD on 7 pages, short "Imprint" title, shared description on / and /energylabel) mirror the source and are not changed under the replica contract. The accessibility layer reported no score in this run (null).

## G-aem — nothing to autofix (2026-10-16)

- autofix-aem dry-run: 0 candidates, because no open findings remain. No project edits, no re-deploy.

## H-report — 7/7 delivered; report and learnings written (2026-10-16)

- stardust/rollout/report.md: the summary block (pages, templates, blocks, quality, to-deliver) plus residuals (header search and account controls, which follow owner decision 4; the local done-check's trailing-slash reading). stardust/learnings.md has five entries.
- The migrate assets and report units are closed: media were hosted on DA at deploy time (no rehost in migrate), and all 7 pages are `migrated` in state.json; gate-evidence filled 7 sidecars.

## I-dashboard — dashboard written over 7 delivered pages (2026-10-16)

- stardust/rollout/dashboard/index.html + data.json: identified 7 · prototyped 7 · deployed 7.

## Handoff — 7/7 pages delivered and published; done-check complete (2026-10-16)

- Runner done-check: complete, 0 gaps. Rollout A–I ended, with all C-deliver units and migrate units done. The published-origin gate passes 7/7 at 1440 and 360.
- Open for the owner: the four decisions in dynamic-features.md (tags/CMP, GraphQL live data, locale scope, account/commerce, which includes the header search and account controls).
