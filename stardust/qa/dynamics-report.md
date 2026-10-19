# Dynamics parity check — https://main--52a40dc9--aemcoder.aem.live — 2026-10-16T15:07:43.651Z

Replayed 7 checks over 12 features · pass 7 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| region / country accordion | M | done | dom-count | PASS | 6 × .region-accordion .item [aria-expanded] (min 6) |  |
| region / country accordion | M | done | dom-count | PASS | 27 × .region-accordion .togglebox-content a (min 24) |  |
| marketing header nav + utility icons | M | done | dom-count | PASS | 6 × header .hdr-navlink (min 1) | player.vimeo.com:200×4 player.vimeo.com:302×1 f.vimeocdn.com:200×3 i.vimeocdn.com:200×2 vod-adaptive-ak.vimeocdn.com:200×5 |
| client-rendered text slots | CR | done | dom-count | PASS | 3 × .content-text-media (min 3) |  |
| magazine teaser Vimeo loop (autoplay muted) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 10 (ok) | player.vimeo.com:200×4 f.vimeocdn.com:200×3 player.vimeo.com:302×1 i.vimeocdn.com:200×2 vod-adaptive-ak.vimeocdn.com:200×5 |
| consentmanager.net CMP | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| Adobe Launch tag manager | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (3 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- YouTube consent popover (CR) — done
- dataLayer / utag_data settings objects (A) — interim · owner: Consumed only by tags; follows decision batch 1
- first-party GET /graphql (marketing app) (A) — interim · owner: Live marketing-app data on the new host (decision batch 2) · environment limit: endpoint is host-bound (404 on the EDS host)
- runtime-injected iframe (V) — interim
- hreflang locale variants (I18N) — interim · owner: Locale-tree scope beyond the 7 planned pages (decision batch 3); region links point to the live country sites
- sign-in / account link, commerce signals (X) — interim · owner: Account / commerce backend on the new host (decision batch 4)
