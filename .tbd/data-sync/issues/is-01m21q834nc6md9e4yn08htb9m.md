---
type: is
id: is-01m21q834nc6md9e4yn08htb9m
title: Deploy the frontend
kind: epic
status: open
priority: 1
version: 2
labels: []
dependencies: []
created_at: 2026-09-08T23:56:55.828Z
updated_at: 2026-09-18T15:49:07.383Z
---
Ship the Next.js app to a public URL. Plan: docs/deployment-plan.md.

The app is 99% static — 131 prerendered pages, one dynamic route (/api/chat) — and builds are hermetic because data/ is committed. So a first deploy needs no backend, no database and no secrets.

Recommendation is Vercel: Next 16 with Turbopack and a streaming AI route tracks their runtime most closely. Static export is the cheaper alternative but drops /ask entirely.

Sequence: rotate the exposed key, pin Node engines, add CI, deploy private without a key, then decide on Ask.

## Notes

18 Sep 2026 check: the frontend IS deployed on Vercel (project lensa-billions-projects/karamazov-atlas), production builds from main — latest 4c6c0c7 (PR #15 merge) on 17 Sep, state success — but behind Vercel Deployment Protection (production URL redirects to vercel.com/login). That matches the plan's 'deploy private' step. Done: engines pinned, CI, private deploy. Remaining, owner's decisions: rotate the key (atlas-qcsc), decide whether /ask gets a key in Vercel, turn off protection or add a domain to make it public, then Render for the API.
