---
type: is
id: is-01m2jdxqyekd89js64f85gbtcc
title: Retire the v3 colour aliases
kind: chore
status: open
priority: 3
version: 1
labels:
  - design
dependencies: []
created_at: 2026-09-15T11:41:04.845Z
updated_at: 2026-09-15T11:41:04.845Z
---
--blue, --teal, --purple and --pink still resolve, pointing at cloth and gilt. Deliberate: aliasing touched one file instead of thirty, and it is honest about what happened.

Still debt. A reader seeing var(--blue) render red will not trust the token names. Rename through the components to --cloth, --gilt and the inks, then delete the aliases.
