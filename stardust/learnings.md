# Learnings — gaggenau.com replica (2026-10-16)

- An origin capture taken by an interrupted run can carry the consent banner (a 62% false red at 360). Re-shoot origins with `stitch-shot --consent .cmpboxbtnyes` and check the top band before iterating.
- gate-all selects `status: deployed` pages from the state file it is given. A scratch state built from the coverage ledger is the clean way to run the roster gate without touching the core lifecycle.
- A page with a scroll stop below the document height (de-de at 1440) stalls the stitch; `--vh 1000` on both sides fixes it.
- migrate's default slashless → `<dir>/index.html` shape makes rollout's URL helpers request `/<path>/`. On EDS that 404s while the source answers it, so publish trailing-slash redirect rows.
- Keep `<html lang>` per path in the foundation from C0: German copy depends on `hyphens: auto`, and a pinned `en` cost a fix round and a foundation request.
