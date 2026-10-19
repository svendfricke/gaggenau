# EDS conversion log — Gaggenau replica

## Publish decision (2026-10-16)

- Decision: **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer and their locale variants) go live on the aem.live origin (`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`). Decided by the run's operator before handoff; recorded once here.

## archetype-static — /general/legal (template `static`, page Template `store`)

- Block `content-text-media` (m-contenttextmedia), decode tier **template-slotted** (node-slotting: `.heading` / `.content > .text` / `.media` wrappers, authored nodes moved). One row, one cell: `[picture] [h1] h2 p…`. Variants: `split` (authored option — legal: heading above a 50 % text column ≥ 600px); `has-media` (set by the block when a picture is authored — index `/`: media first, heading moves inside `.content`). Reused later by the region-selector index page.
- D1 🟡 (3×, "default-content candidate"): justified — the module carries a bespoke two-column split layout and the media variant; it is the store build's content module, not plain prose.
- h1: the source page renders no `<h1>` (3 × h2). The content authors `<h1>Data Protection Information</h1>` (the page title) in the first block cell; the block moves it into a visually hidden `.sr-only` wrapper — one h1, zero pixel change.
- delivery-lint P1 `one-cta-per-p` is a false positive: Section 2's "Opt-out:" paragraph is prose with a `<strong>` kicker and two inline URL links (no CTA); splitting it would change the source layout. Kept verbatim.
- qa-gate `units` ✗ ×3 is an instrument limit: the schema's repeat unit is the prose `<p>` (6/22/15), a tag qa-gate has no proxy for; measured in the harness: 6/22/14 `.text p` (the 15th is the source's empty trailing `<p></p>`, dropped by the pipeline, 0 px). The harness `broken image` is the chrome logo on the auth-gated preview.da.live host (foundation, not this unit); the 2560 cap ✗ is the harness lacking `body.store` (Template metadata) — with the class applied main measures 1200px.
- Links: external targets kept absolute; the anchor text is wrapped in `span.link-text` (accent underline) and the external glyph is drawn by href attribute in block CSS (survives the editor swap).
- Metadata: Title + Template only. The meta description is absent, as on the source (`_meta.json` description null) — replica authors no fabricated content.

## archetype-region-selector — / (template `region-selector`, page Template `store`)

- Blocks: REUSE `content-text-media` ×4 (2 × `has-media`, 1 empty, 1 text-only); NEW `content-teaser` (m-contentteaser, template-slotted: `.content > .heading` + optional `.text`) and `region-accordion` (g-col > m-countryselectorlist > m-togglebox, reconstructive: a link-free `<p>`/heading opens a region, following lists/link paragraphs belong to it; one row per region `| <p>Region</p> | <ul><li><a>Country</a></li>… |`, flattened single cell tolerated).
- `content-text-media` has-media styling finished in the block CSS (region.css lift: media `order 1` / mb 20 / 50 % ≥ 600, table-cells ≥ 769, heading inside `.content` unpadded, `:not(.split)` flow-root ≥ 769). Every new rule needs `.media`, `.content .heading`, `.has-media` or `:not(.split)` — none match /general/legal; legal gate re-run after the change: 0.01 % / 0.05 %, Δh 0.
- The source's empty third m-contenttextmedia (a 40 px spacer module) is authored as an empty `content-text-media` block — kept, it survives the pipeline (`.plain.html`) and carries the 40 px gap.
- `region-accordion` motion (progress.json archetypes.region-selector.motion): click toggles `.is-open` on title/item/panel, max-height transition 400 ms with `.is-in-transition`, rests at `none`/0; verified on the preview (mid-transition 0.4 s, open 700 px, closed 0). Title = the authored `<p>` moved into an in-page anchor `a.togglebox-title` (as on source; EW7: never a `<button>`); prefers-reduced-motion skips the animation.
- h1: source renders none; `<h1>Select your region</h1>` (the page title minus the brand suffix) authored in the first block cell → `.sr-only`, as on legal.
- block-roundtrip residual 🔴 MISSING CTA "See more" (`a.morelesslink`, javascript:void(0)) is a false positive: the control is `display:none` on source and prototype (static.css `.morelesslink`) and absent from the source capture's visible CTA list — not content. qa-gate `units` ✗ ×2 and empty-block ✗ are instrument limits (repeat unit `div.item` has no tag proxy — harness measured 6 items / 49 countries; the empty block is the source spacer). D1 🟡 ×5 justified as for legal.
- Gate origin captures re-taken with `stitch-shot --consent .cmpboxbtnyes` (the consentmanager scrim, as in the archetype's captureState); presence.json gained an `index` entry (`.js-content=main`).

## Redirects (2026-10-16)

- No redirects needed: every in-scope source URL resolved to itself at capture, and the source root `/` serves a page, delivered as the `index` document. `stardust/redirects.tsv` is header-only, so no redirects sheet is published (an empty sheet would serve nothing).

## Redirects — trailing-slash rows (2026-10-16, supersedes the "none needed" note above)

- The source answers every in-scope path with a trailing slash too (200, or 308 → slashless for /de/de/); EDS 404s them. Six rows `/<path>/ → /<path>` are in `stardust/redirects.tsv`, PUT to DA as `/redirects.json`, previewed and published. On aem.page and aem.live they answer 301 to the slashless path, and `/` still answers 200.
- `/country-selector` (linked as "homepage" from /general and /confirmation) is outside the fixed site plan, so it is repointed to `https://www.gaggenau.com/country-selector` (200 on the source), and both pages are redeployed and live.
