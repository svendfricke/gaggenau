# Font licensing

The brand faces below are proprietary (BSH Hausgeräte GmbH / Gaggenau). They are the
brand's own webfonts, self-hosted by the brand on www.gaggenau.com, and are re-hosted here
for a same-design (replica) migration. The decision to publish is recorded by the project
owner; confirm the webfont/embedding licence covers this origin before go-live.

| File | Family | Foundry / owner | Status |
|---|---|---|---|
| gaggenau-text-regular.woff2 | Gaggenau Text 400 (store build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenau-text-bold.woff2 | Gaggenau Text 700 (store build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenau-display-regular.woff2 | Gaggenau Display 400 (store build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenau-display-bold.woff2 | Gaggenau Display 700 (store build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenautext-regular.woff2 | GaggenauText normal (landing build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenautext-bold.woff2 | GaggenauText bold (landing build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenaudisplay-regular.woff2 | GaggenauDisplay normal (landing build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| gaggenaudisplay-bold.woff2 | GaggenauDisplay bold (landing build) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |
| icons.woff2 | icons (store glyph font) | Gaggenau / BSH (proprietary) | publish decision recorded — licence to confirm |

## Remove path

If the licence cannot be confirmed: delete the `.woff2` files above and their `@font-face`
rules in `styles/fonts.css`. Every stack names a metric-matched local fallback second
(`gaggenau-text-fallback`, `gaggenau-display-fallback`, `gaggenautext-fallback`,
`gaggenaudisplay-fallback` in `styles/styles.css`), so text falls back to Arial with the brand
metrics; the `icons` glyphs (social icons, arrows) would disappear and need SVG replacements.
