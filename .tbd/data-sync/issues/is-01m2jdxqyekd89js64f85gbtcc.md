---
type: is
id: is-01m2jdxqyekd89js64f85gbtcc
title: Retire the v3 colour aliases
kind: chore
status: closed
priority: 3
version: 2
labels:
  - design
dependencies: []
created_at: 2026-09-15T11:41:04.845Z
updated_at: 2026-09-18T14:00:39.626Z
closed_at: 2026-09-18T14:00:39.626Z
close_reason: All var(--blue|teal|purple|pink*) uses renamed to cloth/gilt/ink/surface; aliases deleted; build output contains none. Design doc and skill updated.
resolution: null
duplicate_of: null
---
--blue, --teal, --purple and --pink still resolve, pointing at cloth and gilt. Deliberate: aliasing touched one file instead of thirty, and it is honest about what happened.

Still debt. A reader seeing var(--blue) render red will not trust the token names. Rename through the components to --cloth, --gilt and the inks, then delete the aliases.
