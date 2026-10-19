# Rollout report — gaggenau.com → AEM Edge Delivery (2026-10-16)

| | |
|---|---|
| Pages | 7/7 delivered, published on aem.live, verified (scope: the fixed 7-page site plan) |
| Templates | 3: landing (/de/de), region-selector (/, /energylabel), static (/general, /general/legal, /general/imprint, /confirmation) |
| Blocks | 8 + header/footer: stage, teaser-slider, category-tiles, editorial-teaser, content-text-media, content-teaser, region-accordion, page-title |
| Quality | published-origin gate 7/7 PASS at 1440 and 360 (max 3.6%, Δh 0, clip 0, missing 0); optimize health 100/100, 0 open findings; dynamics parity 7/7; links 174/177 (3 broken on the source too) |
| Site | sitemap served 7 = assembled 7; `/` 200; redirects sheet with 6 trailing-slash rows; nav/footer (+ de/de) noindex and live |
| To deliver | owner decisions: tags/CMP on the new host, live GraphQL data, locale scope beyond the plan, account/commerce backend |

## Residuals (recorded, not gated)

- Header contract (1440, compared at foundation): the search field ("Suchbegriff") and the user-area control ("Benutzerbereich") open nothing on the build, because site search and the account backend are outside the plan (owner decision 4). The menu-panel visual reds were measured with the source consent scrim over the open states (an explorer limit); the panels match in the pixel gates.
- Local done-check reads migrate's `…/index.html` tree shape as trailing-slash URLs. The delivered URLs are slashless like the source, and the redirects sheet answers the slash variants with a 301.
- Prototype-HTML sidecars lint P0 "no h1" (the source has none); the delivered documents carry a visually hidden h1 and pass delivery-lint.
