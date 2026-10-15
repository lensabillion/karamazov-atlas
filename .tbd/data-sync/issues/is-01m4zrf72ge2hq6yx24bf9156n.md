---
type: is
id: is-01m4zrf72ge2hq6yx24bf9156n
title: Serve robots.txt and sitemap.xml
kind: task
status: open
priority: 2
version: 1
labels: []
dependencies: []
parent_id: is-01m4zrf6q049k1mk4akxp72deg
created_at: 2026-10-15T12:26:54.415Z
updated_at: 2026-10-15T12:26:54.415Z
---
src/app/robots.ts (allow all, disallow /api/, point at the sitemap) and src/app/sitemap.ts listing every static route plus every /read/[id] and /character/[id] from the same corpus sources the pages' generateStaticParams use. The origin comes from NEXT_PUBLIC_SITE_URL, then Vercel's VERCEL_PROJECT_PRODUCTION_URL, then localhost.
