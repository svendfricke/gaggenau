<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-16T12:34:32.513Z · input stardust/current/_dynamics.json (3 pages, 20 findings) · target probe https://main--52a40dc9--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 3/3 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 3/3 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-first-party-api-get-graphql | A | first-party API GET /graphql | 1/3 (reach 1/7) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | cr-client-rendered-slot-js-content | CR | client-rendered slot js-content | 2/3 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 5 | cr-client-rendered-slot-js-moreless | CR | client-rendered slot js-moreless | 2/3 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "By choosing one of the options from the " |
| 6 | cr-client-rendered-slot-text-js-content | CR | client-rendered slot text js-content | 2/3 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "By choosing one of the options from the " |
| 7 | cr-client-rendered-slot-m-youtubeconsentpopover-js-youtubeco | CR | client-rendered slot m-youtubeconsentpopover js-youtubeconsentpopover | 2/3 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 8 | i18n-locale-variants-za-be-be-cz-dk | I18N | locale variants za,be,be,cz,dk | 1/3 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 9 | i18n-locale-variants-de-de-de | I18N | locale variants de,de,de | 1/3 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "http://www.adobe.com/de/privacy/opt-out." |
| 10 | m-modal-trigger-aria-haspopup-target-outside-dom-at-capture | M | modal trigger aria-haspopup → target outside DOM at capture | 3/3 (reach 7/7) | rebuild-native | self | pending | modal-loader | none |  |
| 11 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 3/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-unknown-third-party-host-cdn-consentmanager-net | T | unknown third-party host cdn.consentmanager.net | 3/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 13 | t-unknown-third-party-host-b-delivery-consentmanager-net | T | unknown third-party host b.delivery.consentmanager.net | 2/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 14 | t-unknown-third-party-host-a-delivery-consentmanager-net | T | unknown third-party host a.delivery.consentmanager.net | 2/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 15 | t-unknown-third-party-host-media3-bsh-group-com | T | unknown third-party host media3.bsh-group.com | 1/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-unknown-third-party-host-d-delivery-consentmanager-net | T | unknown third-party host d.delivery.consentmanager.net | 1/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 17 | t-unknown-third-party-host-media3-bosch-home-com | T | unknown third-party host media3.bosch-home.com | 1/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 3/3 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 19 | x-sign-in-account-links | X | sign-in / account links | 1/3 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 20 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 1/3 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 5 row(s) — read-settings, settled-dom-snapshot, modal-loader.
- **One owner decision batch:** 10 row(s) — which tier for the target host; consumer on the migrated pages? · scope of the locale trees · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 3 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.

## Phases

- **tags** — 7
- **capture** — 4
- **detect** — 2
- **locale wave** — 2
- **register** — 2
- **off-origin data** — 1
- **interactive** — 1
- **embeds** — 1
