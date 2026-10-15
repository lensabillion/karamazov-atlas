---
type: is
id: is-01m4zkcbwp5q1zgdxeesns2x4r
title: Stop the first-paint flash of the whole-book scope on /ask
kind: bug
status: in_progress
priority: 3
version: 2
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:58.166Z
updated_at: 2026-10-15T10:58:15.473Z
---
M7. useReadingPosition's server snapshot is null, so a reader with a place set sees 'Answers draw on the whole book' until hydration. Gate the sentence in CSS on html[data-position], which the pre-paint script already sets.
