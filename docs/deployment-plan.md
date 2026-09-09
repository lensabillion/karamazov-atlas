---
title: Deployment Plan
description: How the frontend and backend get shipped, in what order, and why the backend waits
---
# Deployment Plan

**Date:** 2026-09-09 · **Status:** Decided — Render (backend) + Vercel (frontend). Configuration committed; see §11.

---

## 1. What we are actually deploying

Measured from `next build`, not assumed:

| | |
| --- | --- |
| Prerendered pages | **131** — `/`, `/ask`, `/names`, `/read`, `/timeline`, `/who`, 27 character pages, 96 chapters |
| Routes needing a server | **1** — `ƒ /api/chat` |
| Data | 99 files committed in `data/` (~2.3 MB) plus `karamazov.txt` (1.9 MB) |
| Secrets | **1** — `ANTHROPIC_API_KEY` |
| Backend | FastAPI + SQLite/FTS5 in `api/` — **not consumed by the app** |

Two facts drive everything below.

**The app is 99% static.** Every page a reader looks at is prerendered at build time
from committed data. Nothing is fetched at runtime. The corpus, the name analysis, the
relationships and the timeline are all baked into HTML.

**Builds are hermetic.** `data/` is committed, so a build needs no database, no API, and
no network. Clone, `npm ci`, `npm run build`, done. This is worth protecting — it is why
deployment is simple.

---

## 2. Decision taken: both, and the backend now has a job

The original recommendation here was to defer the backend because nothing called
it. **The decision is to deploy both**, so the recommendation is superseded — and
rather than ship an idle service, the chat route's retrieval now uses it.

`/api/chat`'s `searchNovel` tool calls the API's FTS5 endpoint when `ATLAS_API_URL`
is set, and falls back to the local corpus scan when it is not. That gives the
backend a real consumer, and keeps local development, preview builds and a Render
outage all working — an outage degrades one feature instead of taking the site down.

The reasoning that produced the original recommendation is kept below, because it
still governs *what the backend must earn*: if the FTS5 path never measurably beats
the local scan, the service is not paying for itself.

### Original reasoning (superseded)

The Python service works and its 11 tests pass. It is also **dead weight in production
today**: the Next.js app does not call it, and `/api/chat` does not call it either.

Deploying it now would mean paying for a service, securing it, monitoring it, and
keeping it available — for zero traffic and zero dependents. It would also create a
false impression that the app depends on it, which the next person to touch this repo
would have to disprove.

**Deploy the frontend now. Deploy the backend when something calls it.** That is
`atlas-gc9d` step 5, and it is not done.

If the goal is simply to *see it running somewhere*, the frontend alone achieves that
completely.

---

## 3. Phase 1 — Frontend

### Target: Vercel

Not out of habit. Next 16 with Turbopack, App Router and partial prerendering tracks
Vercel's own runtime most closely, and this app's one dynamic route is a streaming AI
response — which is exactly what their Node/Edge functions handle without configuration.
The alternatives and why they lose:

| Option | Verdict |
| --- | --- |
| **Vercel** | Recommended. Zero-config for this stack; streaming works out of the box |
| Netlify | Workable via the Next runtime adapter, historically a step behind on new Next releases |
| Cloudflare Pages | Needs `@opennextjs/cloudflare`; the AI SDK streaming path is the risk |
| Static export (`output: 'export'`) + any CDN | Cheapest and simplest, but **drops `/api/chat` entirely**. Viable only if we accept losing Ask |
| Self-host (Docker + Node) | Most control, most work. Only worth it if we must avoid vendor lock-in |

### Configuration

```
Build command     npm run build
Install command   npm ci
Output            .next  (framework preset handles this)
Node version      22.x   (pin it — package.json currently declares no engines)
Env (server)      ANTHROPIC_API_KEY
```

Two things to fix before the first deploy:

1. **Pin Node.** `package.json` has no `engines` field, so the platform picks. Add
   `"engines": { "node": ">=22.12.0" }` to match what the scripts already assume.
2. **Decide the `/ask` posture.** Without a key the page renders a clear notice. With a
   key it is a public, unauthenticated, streaming LLM endpoint. See §6.

### What deploys with no key at all

Everything except Ask. `/`, `/read`, `/who`, `/names`, `/timeline` and all 123 detail
pages are static and work with zero configuration and zero secrets. This is a legitimate
first deploy, and the one I would do first.

---

## 4. Phase 2 — Backend, when it is needed

Trigger: the Next app or `/api/chat` actually reads from it (`atlas-gc9d` step 5).

### Target: a container platform, not a serverless function

SQLite with FTS5 wants a real filesystem and a warm process. Serverless would rebuild or
re-download the database per cold start.

| Option | Notes |
| --- | --- |
| **Fly.io** | Recommended. Small always-on VM, real disk, cheap, scales to zero optionally |
| Railway / Render | Equivalent; pick on pricing and familiarity |
| AWS App Runner / ECS | Fine, more setup than this justifies |
| Vercel Functions | **Not suitable.** SQLite/FTS5 on ephemeral storage per invocation |

### The database question

`data/atlas.db` is **gitignored**. It is derived, so it must be produced during the image
build, not committed:

```dockerfile
# after copying data/ and src/
RUN python -m atlas.ingest        # builds data/atlas.db from the committed JSON
```

That keeps the container immutable and reproducible: same commit in, same database out,
no volume, no migration on boot. Revisit only if the API ever gains writes.

### Networking

The API is read-only and has no auth. It must not be public. Either:

- Keep it on a private network and let only the Next deployment reach it, or
- Put a shared secret header between the two.

Decide before it is exposed, not after.

---

## 5. CI/CD

There is **no CI today** (`atlas-83bt`). This should land before, not after, automated
deploys — a pipeline that deploys without gates just ships breakage faster.

```
on: pull_request, push to main
  1. npm ci
  2. npm run corpus       # regenerate derived data from source
  3. git diff --exit-code data/   # committed data must match what the pipeline produces
  4. npx tsc --noEmit
  5. npm run test         # 15 golden checks
  6. npm run build
  7. (api) uv sync && pytest    # 11 tests
```

Step 3 is the important one and is not obvious. The review found that `npm run corpus`
had been silently rebuilding nothing for weeks. A CI check that regenerates the data and
fails if it differs from what is committed would have caught that the day it appeared.

Deploy on green merge to `main`. Preview deploys per PR.

---

## 6. Secrets and exposure

`ANTHROPIC_API_KEY` is the only secret, and it is the whole risk surface.

- Set it in the platform's env store. Never in the repo. `.env.local` is gitignored.
- **The key used during development was exposed in a session transcript and must be
  rotated before any deploy.** This is outstanding.
- `/api/chat` with a key set is a public unauthenticated LLM endpoint that anyone can
  call and bill to this account. Before enabling it publicly, add at minimum a rate
  limit per IP and a hard `maxOutputTokens`. It already caps steps at 6.

If none of that is wanted yet, deploy without the key. Ask degrades gracefully by design.

---

## 7. Rollback and observability

- **Rollback:** platform-level instant rollback to the previous build. Because the data
  is committed, a rollback restores content and code together — there is no separate
  data state to reconcile. This is a real benefit of the hermetic build.
- **Observability:** platform request logs are enough at this stage. The one thing worth
  adding with the key enabled is a counter on `/api/chat` calls, because that is the
  line item that costs money.

---

## 8. Decisions

| # | Decision | Outcome |
| --- | --- | --- |
| 1 | Frontend only, or both? | **Both.** Backend on Render, frontend on Vercel |
| 2 | Enable `/ask` publicly? | **Open.** Recommend no until `atlas-gx3e` (rate limiting) lands |
| 3 | Platform | **Vercel + Render**, decided |
| 4 | Public or private first? | **Open.** Private is one toggle and costs nothing |
| 5 | Custom domain? | Not needed for a first deploy |

---

## 9. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Exposed API key is reused in production | **High** | Rotate before deploying. Outstanding |
| `/ask` abused as a free LLM proxy | **High** if enabled | Rate limit, or ship without the key |
| No CI, so a broken build reaches production | Medium | `atlas-83bt` before automated deploy |
| Committed data drifts from the pipeline | Medium | CI step 3 above |
| Backend deployed but unused | Low | Phase 2 gate — do not deploy it yet |
| Node version drift | Low | Pin `engines` |

---

## 10. Sequence

1. Rotate the exposed API key.
2. Pin Node in `package.json`.
3. Add CI (`atlas-83bt`), including the data-drift check.
4. Deploy frontend to Vercel, **private, without the key**. Verify all 131 pages.
5. Decide on Ask. If yes: rate limit, then add the key.
6. Make public if wanted.
7. Backend only when `atlas-gc9d` step 5 gives it a consumer.

Steps 1–4 are a short path to a working public URL and need no backend at all.

---

## 11. Runbook — what is committed and what to click

Configuration is in the repo. These are the manual steps that remain.

### Files added

| File | Purpose |
| --- | --- |
| `api/Dockerfile` | Builds the API image and the SQLite/FTS5 database into it |
| `render.yaml` | Render blueprint for the web service |
| `vercel.json` | Framework preset, region, and a 60s cap on the chat function |
| `.env.example` | Every variable, with what happens when each is absent |
| `src/lib/atlas-api.ts` | Typed client; falls back to local search when unconfigured |

### A. Backend on Render

1. Render → **Blueprints** → New Blueprint Instance → point at this repo. It reads
   `render.yaml`.
2. Set `ALLOWED_ORIGINS` when prompted. It is `sync: false`, so it is never
   committed. Leave it as the localhost default until the Vercel URL exists, then
   set it to that origin.
3. Deploy. The build runs `python -m atlas.ingest` and **fails the build** if the
   image does not contain exactly 96 chapters — a bad corpus never reaches a reader.
4. Verify: `curl https://<service>.onrender.com/health` → `{"ok":true,"chapters":96}`.

Notes:
- `plan: starter`, not free. SQLite wants a warm process and a real filesystem;
  a sleeping instance would cold-start on every query.
- `autoDeploy: false`. The backend deploys on a deliberate promote, not on every
  push to the branch.
- No disk is attached, on purpose. The database is part of the image, so a
  redeploy is the migration.

### B. Frontend on Vercel

1. Import the repo. The framework preset is detected; `vercel.json` pins the rest.
2. Environment variables:
   - `ATLAS_API_URL` → the Render URL. **Omit it and the site still works**, using
     the local corpus scan.
   - `ANTHROPIC_API_KEY` → only when `/ask` should be live. See §6 first.
3. Deploy. 131 pages prerender at build time from committed data; no network needed.
4. Return to Render and set `ALLOWED_ORIGINS` to the Vercel origin.

### C. Verify the seam

```bash
curl "https://<render-url>/health"
curl "https://<render-url>/search?q=Inquisitor&limit=2"
curl -H "Origin: https://<vercel-url>" -D - -o /dev/null "https://<render-url>/health" | grep -i access-control
```

The last one must echo the Vercel origin. If it does not, `ALLOWED_ORIGINS` is unset
and the browser will block the call.

### What was verified locally, and what was not

**Verified:** ingest against relocated container paths produces 96 chapters; the
build-time assertion passes; `/health`, `/search` and spoiler-scoped search all
return correct results; CORS echoes the configured origin; the chat route falls
back cleanly with `ATLAS_API_URL` unset.

**Not verified:** the Docker image build itself. The local Docker daemon was not
running, so `api/Dockerfile` is unbuilt. The path logic it depends on was validated
by simulating the container layout, but the first real build will happen on Render.
Expect to iterate once on it.
