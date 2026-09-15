---
type: is
id: is-01m1yyx5cvrnx48thj89xfbxc6
title: "Bug: name orbit labels collide at six or more forms"
kind: bug
status: closed
priority: 3
version: 2
labels:
  - design
dependencies: []
created_at: 2026-09-07T22:13:03.002Z
updated_at: 2026-09-09T15:55:36.055Z
closed_at: 2026-09-09T15:55:36.054Z
close_reason: null
resolution: null
duplicate_of: null
---
NameOrbit.tsx places forms with a fixed angular step: (-140 + i * 61) degrees. Six forms is 366 degrees, so the sixth wraps onto the first and the labels overlap.

Latent — no character currently has six forms (Dmitri has four), so it does not fire today. It will the moment the alias table grows, and it will fail silently rather than loudly.

Fix: distribute by 360/forms.length with a fixed offset, or place by register ring and resolve collisions within the ring.
