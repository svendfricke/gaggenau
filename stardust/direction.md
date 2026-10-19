---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-16T11:42:19Z
  againstInput: https://www.gaggenau.com/de/de
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.gaggenau.com/de/de (and the 6 store-template pages in the fixed site plan), promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md · current/DESIGN.json → DESIGN.json (at 2026-10-16T11:42:19Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (2 entries, both deferred — pure replica in this run).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link audit decisions (E2, 2026-10-16)

- Internal targets outside the fixed 7-page site plan are scope extension: they stay absolute to www.gaggenau.com (152 kept links; e.g. product categories, dealer finder, other country sites). `/country-selector` (linked as "homepage" from /general and /confirmation) is repointed to the source.
- Three source links are broken on the source itself and are kept verbatim: `/de/my-gaggenau/produkt-registrieren` (404), `/tr/genel/faydali-bilgiler` (404), and `www.gaggenau-world.com.cn` (unreachable from the test network; environment limit). This is source parity, not a delivery defect.
