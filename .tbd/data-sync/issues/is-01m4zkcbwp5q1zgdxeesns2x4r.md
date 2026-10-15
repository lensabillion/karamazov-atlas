---
type: is
id: is-01m4zkcbwp5q1zgdxeesns2x4r
title: Stop the first-paint flash of the whole-book scope on /ask
kind: bug
status: closed
priority: 3
version: 3
labels: []
dependencies: []
parent_id: is-01m4zkcb01x03f4dxbb3ed8ehw
created_at: 2026-10-15T10:57:58.166Z
updated_at: 2026-10-15T11:10:02.571Z
closed_at: 2026-10-15T11:10:02.571Z
close_reason: "AskPanel renders both sentences in one .ask-scope paragraph when the position is unknown; four globals.css rules keyed on html[data-position] (set by the pre-paint gate script) pick one, colour included; data-scoped removed. Measured on a script-free copy of the server HTML with data-position=36: visible text is the place sentence, .ask-scope__whole display none, colour rgb(74,64,56) --ink-2, border rgb(154,123,50) --gilt, before React. Hydrated: names Bk V, ch. 5, same colours, 0 spans left. No place: whole sentence inline, place none. No console errors from the page. PR https://github.com/lensabillion/karamazov-atlas/pull/21"
resolution: null
duplicate_of: null
---
M7. useReadingPosition's server snapshot is null, so a reader with a place set sees 'Answers draw on the whole book' until hydration. Gate the sentence in CSS on html[data-position], which the pre-paint script already sets.
