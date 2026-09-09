---
title: TODO — audit findings and their state
description: Everything the 2026-09-09 review found, what has been fixed, and what is left
---
# TODO

**Audit date:** 2026-09-09 · Ground truth for work items is tbd (`tbd list`).
This file is the review's own record: what was found, what was fixed in this pass,
and what remains.

Status key: **[ ]** open · **[x]** fixed this pass · **[~]** partly done · **[!]** blocked on a person

---

## 1. Process — the things that fell through the cracks

- **[!] Two commits are on no pull request.** PR #4 merged before the deployment
  config and the rate limiter were committed, so `render.yaml`, `vercel.json`,
  `api/Dockerfile`, `.env.example` and `src/lib/rate-limit.ts` exist only on
  `atlas-bdxb/name-key`. **Render and Vercel deploy from a branch — point either at
  `main` today and the config is not there.** Needs a PR. → `atlas-lg09`
- **[!] `.env.example` was deleted on `main`** (commit `c4290bc`), so `main` documents
  no configuration at all. The branch restores it.
- **[!] An exposed API key has still not been rotated.** → `atlas-qcsc` (P0)
- **[ ] Another session's work is uncommitted** — new timeline and relationship-view
  modules, three CSS files, two test scripts. Their tests pass. Left untouched here
  because it is someone else's in-progress work, not mine to commit.

## 2. Correctness

- **[x] Memoised loaders serve stale data.** `getCorpus`, `getMentions` and `getNames`
  cached with `??=` for the life of the process, so a rebuilt corpus was invisible to
  a running dev server. This produced a screenshot that showed corrected data as still
  wrong, and nearly caused a working fix to be "re-fixed". → `atlas-arat`
- **[x] Name orbit labels collide at six or more forms.** A fixed 61° step meant
  `6 × 61 = 366°`, wrapping the sixth label onto the first. Latent — no character has
  six forms yet — and silent when it fires. → `atlas-xd1p`
- **[x] Curated data had nothing enforcing its integrity.** A tie pointing at a
  missing person, or a timeline span naming an unknown character, rendered as a
  silently absent line. → `atlas-h0xk`
- **[ ] Attribution treats a mentioned person as an addressee.** The data model, not
  the copy, still conflates "Alyosha said X about Dmitri" with "said it to Dmitri".
  → `atlas-w56r`

## 3. Design system

- **[x] Shape encoding was incomplete.** `NameOrbit` drew raw circles while the system
  states category is encoded by shape. → `atlas-32hp`
- **[x] No legend on `/names`** despite shape carrying meaning there.

## 4. Testing and gates

- **[x] No CI.** Nothing gated a push. Typecheck, four test suites, the build and the
  Python tests all existed and none of them ran automatically. → `atlas-83bt`
- **[x] Nothing detected data drift.** `npm run corpus` silently rebuilt nothing for
  weeks and every test still passed. CI now regenerates and fails on a diff.
  → `atlas-nkqm`
- **[x] `src/lib/atlas-api.ts` had no tests** — including its fallback, which is the
  behaviour that keeps the site up when Render is down. *(new finding)*
- **[ ] Name morphology, lineage and attribution are untested.** → `atlas-30o1`

## 5. Documentation

- **[x] Route tables listed `/network` and `/map`,** removed several commits ago.
  → part of `atlas-dvvm`
- **[x] `docs/design-document.md` described the Python API without marking it a
  prototype** the app does not consume.

## 6. Performance

- **[ ] `searchCorpus` reads all 96 chapter files per query.** Now only the fallback
  path, so less pressing, but unchanged. → `atlas-0goa`

## 7. Product — the largest open item

- **[ ] The app optimises for the wrong reader.** The Codex review's R1: statistics
  lead, and there is no illustrated scene sequence. This is the actual product goal
  and the biggest open piece of work. → `atlas-t72d`
