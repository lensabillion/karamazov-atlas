---
type: is
id: is-01m232z88vw4yh5865mxvke0sb
title: Improve timeline reading and interaction while preserving column design
kind: task
status: closed
priority: 2
version: 3
labels: []
dependencies: []
created_at: 2026-09-09T12:41:03.515Z
updated_at: 2026-09-18T14:24:31.984Z
closed_at: 2026-09-18T14:24:31.984Z
close_reason: "Column heads sticky (under nav on wide; pinned in a self-scrolling chart frame on narrow); chosen block's account sits beside the chart or docks to the bottom on phones, with passage link; labels clipped to block height; endFraction honoured; aria-pressed buttons, Escape closes. Verified in browser at 1320 and 1024 widths: no page overflow, heads top 60px under 59px nav. Commit 9990b0c."
resolution: null
duplicate_of: null
---
Keep the timeline typography, colors and proportional character columns. Improve orientation with persistent column headers and clear reading guidance; keep selected event details near the chart; contain mobile scrolling; prevent label overflow; honor the existing endFraction data and expose available chapter citations. Verify layout, keyboard interaction and geometry.
