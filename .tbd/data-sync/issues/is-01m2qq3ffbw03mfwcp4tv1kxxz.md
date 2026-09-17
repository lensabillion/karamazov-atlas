---
type: is
id: is-01m2qq3ffbw03mfwcp4tv1kxxz
title: Verify illustrated homepage spacing and interactions in the browser
kind: task
status: closed
priority: 2
version: 3
labels: []
dependencies: []
created_at: 2026-09-17T12:57:42.122Z
updated_at: 2026-09-17T13:42:53.733Z
closed_at: 2026-09-17T13:42:53.733Z
close_reason: Published storytelling/white-canvas changes in PR 15, commit 0ab22a0. Frontend, Backend and Vercel checks pass. Browser verification at 1280, 760 and 390px confirms white background, unchanged Old Standard TT/cream descriptions and no overflow; corrected intrinsic grid-width issue. All 51 homepage images loaded, keyboard disclosures/movement links/related reading verified, archive endpoint returns 200. Larger supplied originals used for two scenes; uncertain identities remain explicit in the appendix and atlas-isd0.
resolution: null
duplicate_of: null
---
Follow-up to atlas-30f9 and atlas-oof5. Live browser access was denied by the app approval service because of a usage limit on 2026-09-17; do not bypass that denial. Source-level reviews, tests, typecheck, build, pixel verification and static output checks pass. When access resumes, inspect desktop, tablet and 390px phone layout; confirm 15 existing images plus 36 catalogue extracts load, open scene contents and catalogue disclosure operate with keyboard, image links and ZIP download work, links lead to intended people and chapters, and no horizontal overflow occurs.
