<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated, hands-off) · 2026-10-16T11:43:24Z · from stardust/dynamics/dynamic-features.generated-plan.md -->
# Dynamic features — Gaggenau (7 pages)

## Listings contract

None. No page in scope renders a listing, search box or query-index-backed band.

## Features

| id | class | feature | pages | disposition | reproducibility | status | interim tier / note |
|---|---|---|---|---|---|---|---|
| region-accordion | M | region / country accordion (store toggles, `js-content`, `js-moreless`) | index, energylabel | rebuild-native | self | planned (recreate) | native disclosure in the region-selector block; same open/closed states as captured |
| mega-nav | M | marketing header mega menu + utility icons (aria-haspopup triggers) | de-de | rebuild-native | self | planned (recreate) | header block, motion observed per archetype |
| settled-dom | CR | client-rendered slots (`js-content`, `text js-content`, `js-moreless`) | store pages | static-snapshot | self | planned | settled DOM text is the captured content |
| youtube-consent | CR | YouTube consent popover (`m-youtubeconsentpopover`) | store pages | static-snapshot | self | planned | not visible at capture; no video on in-scope pages → not rendered |
| settings-objects | A | `dataLayer`, `utag_data` settings objects | all | static-snapshot | self | recorded | consumed only by tags (below); not rendered |
| graphql | A | first-party GET /graphql (marketing app) | de-de | data-fed | needs-business-decision | interim: static snapshot | content captured at extract is authored into the document; endpoint is host-bound (404 on the EDS host) |
| tags | T | Adobe Launch tag manager; media3.bsh-group.com, media3.bosch-home.com | all | embed-passthrough | needs-business-decision | interim: off | scaffolded off on the new host until the owner names tags + property ids |
| consent | T | consentmanager.net CMP (cdn / a / b / d .delivery) | all | embed-passthrough | needs-business-decision | interim: off | the CMP banner is chrome of the source, not content; not shipped until the owner confirms CMP reuse on the new host |
| runtime-iframe | V | iframe without src (runtime-injected) | all | embed-passthrough | needs-human-capture | interim: omitted | tracking/consent frame, zero-size at capture; nothing visible to replicate |
| locales | I18N | hreflang locale variants (za, be, cz, dk, …; de) | index, de-de | rebuild-native | needs-business-decision | interim: links to source | scope fixed by the site plan; region links keep pointing to the live country sites |
| account-commerce | X | sign-in / my-account link, commerce signals (cart: true, prices: 0) | de-de | link-to-source | needs-backend | interim: links to source | account icon keeps its live href; no cart UI on in-scope pages |

## Decision batch (owner)

1. Which tags (Adobe Launch property) and which CMP configuration run on the new host.
2. GraphQL / marketing-app data on the new host (tier: static snapshot now; live feed later?).
3. Locale-tree scope beyond the 7 planned pages.
4. Account / commerce backend on the new host.

## Register

Hands-off assumptions above are interim tiers, not decided-out rows; each decision is named in the batch.
