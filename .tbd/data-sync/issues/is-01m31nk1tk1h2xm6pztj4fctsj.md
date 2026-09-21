---
type: is
id: is-01m31nk1tk1h2xm6pztj4fctsj
title: "Design system: resolve the pre-existing breaches of the documented contract"
kind: task
status: open
priority: 3
version: 1
labels:
  - design
dependencies: []
created_at: 2026-09-21T09:43:39.603Z
updated_at: 2026-09-21T09:43:39.603Z
---
Found while closing atlas-3w18/atlas-203l. The contract now written at the top of
src/app/globals.css forbids more than the guard (scripts/test-design-system.ts)
enforces, and three kinds of pre-existing code break it. None were introduced by
the cleanup, and all three are left alone there because fixing any of them MOVES
PIXELS — a design decision, not a consolidation. Each is flagged with a NOTE in the
contract pointing here, so the document does not claim a compliance the code lacks.

1. BOXES. The RULE group forbids "a 1px box drawn around content to group it", as
   does the first-edition skill ("Rules, not borders"). `.card`, `.chart`, `.notice`
   and `.name-panel` are exactly that. Decide per component: a rule instead of a
   box, or a stated exception (a form field arguably IS a UI surface).

2. TYPE SIZES OFF THE SCALE. The SIZE group allows six sizes, --text-xs … --text-xl.
   - `.plate__name` (plate.css:65) is `clamp(1.75rem, 4.5vw, 2.75rem)`. The max
     equals --text-xl, but it cannot simply become `var(--text-xl)`: the 760px block
     redefines --text-xl, so the mobile maximum would change. 1.75rem is a seventh
     size.
   - CharacterPlate.tsx:69 sets `style={{ fontSize: '0.6em' }}` inline on the
     "of {totalChapters}" fraction.

3. THE GUARD HAS NO TYPE-SIZE CHECK. Once (2) is resolved, add check 8 ("every
   font-size is a --text-* token") the way check 7 was added for spacing: prove it
   red on a mutation, green on the tree. It cannot land before (2), or `npm test`
   fails.

The radius disagreement (3px vs the spec's 2px) is the same kind of problem and
is already atlas-w8zq.
