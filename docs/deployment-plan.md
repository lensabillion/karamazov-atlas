---
title: Deployment Plan
description: How the frontend ships to Vercel, and why there is no backend
---
# Deployment Plan

**Date:** 2026-09-09 · **Status:** Decided — Vercel only. The backend was removed on 15 October 2026 (atlas-ub16); see §2.

---

## 1. What we are actually deploying

Measured from `next build`, not assumed:

| | |
| --- | --- |
| Prerendered pages | **131** — `/`, `/ask`, `/names`, `/read`, `/timeline`, `/who`, 27 character pages, 96 chapters |
| Routes needing a server | **1** — `ƒ /api/chat` |
| Data | 99 files committed in `data/` (~2.3 MB) plus `karamazov.txt` (1.9 MB) |
| Secrets | **1** — `ANTHROPIC_API_KEY` |

Two facts drive everything below.

**The app is 99% static.** Every page a reader looks at is prerendered at build time
from committed data. Nothing is fetched at runtime. The corpus, the name analysis, the
relationships and the timeline are all baked into HTML.

**Builds are hermetic.** `data/` is committed, so a build needs no database, no API, and
no network. Clone, `npm ci`, `npm run build`, done. This is worth protecting — it is why
deployment is simple.

---

## 2. Decision: frontend only

A FastAPI + SQLite/FTS5 service lived in `api/` from 8 September to 15 October 2026,
with a Dockerfile, a Render blueprint and a typed client. Its one consumer was
`/api/chat`'s search tool, behind `ATLAS_API_URL`, with a fallback to the in-process
scan of the committed JSON. The 15 October deep review found the live service
answering 500 under load and 400 to ordinary questions, and the fallback hiding both:
the service was paid for and bypassed.

The owner removed it rather than fix it (atlas-ub16). The reasoning that first argued
for deferring it still holds and now governs any future backend: 349,367 words fit in
memory, every page is prerendered, and the one server route already answers from the
committed data. **Deploy a backend when something needs it**, not before.

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

## 4. Phase 2 — Backend

Removed; see §2. If one is ever needed again: a container platform with a real
filesystem, the database built into the image from the committed JSON, and never
public without auth.

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
| 1 | Frontend only, or both? | **Frontend only.** A backend ran on Render from September and was removed on 15 October 2026 |
| 2 | Enable `/ask` publicly? | **Open.** Recommend no until `atlas-gx3e` (rate limiting) lands |
| 3 | Platform | **Vercel**, decided |
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
| Node version drift | Low | Pin `engines` |

---

## 10. Sequence

1. Rotate the exposed API key.
2. Pin Node in `package.json`.
3. Add CI (`atlas-83bt`), including the data-drift check.
4. Deploy frontend to Vercel, **private, without the key**. Verify all 131 pages.
5. Decide on Ask. If yes: rate limit, then add the key.
6. Make public if wanted.

Steps 1–4 are a short path to a working public URL.

---

## 11. Runbook — what is committed and what to click

Configuration is in the repo. These are the manual steps that remain.

### Files added

| File | Purpose |
| --- | --- |
| `vercel.json` | Framework preset, region, and a 60s cap on the chat function |

### Environment variables

`.env.example` is deleted and gitignored on `main` by deliberate choice, so the
configuration is documented here instead. Set these in each platform's own
environment store; none of them belong in the repository.

**Vercel** — all optional. Every page but `/api/chat` is prerendered from committed
data and needs none of them.

| Variable | Absent | Present |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `/ask` renders a clear notice; everything else is unaffected | `/ask` is live — read §6 before setting this |
| `CHAT_RATE_LIMIT` | Defaults to 10 | Requests per window, per caller |
| `CHAT_RATE_WINDOW_MS` | Defaults to 60000 | Window length in milliseconds |

### Frontend on Vercel

1. Import the repo. The framework preset is detected; `vercel.json` pins the rest.
2. Environment variables:
   - `ANTHROPIC_API_KEY` → only when `/ask` should be live. See §6 first.
3. Deploy. 131 pages prerender at build time from committed data; no network needed.
