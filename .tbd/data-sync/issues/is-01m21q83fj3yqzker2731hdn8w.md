---
type: is
id: is-01m21q83fj3yqzker2731hdn8w
title: Pin the Node version in package.json
kind: chore
status: closed
priority: 2
version: 2
labels: []
dependencies: []
created_at: 2026-09-08T23:56:56.178Z
updated_at: 2026-09-09T15:55:37.006Z
closed_at: 2026-09-09T15:55:37.005Z
close_reason: null
resolution: null
duplicate_of: null
---
package.json declares no engines field, so a deploy platform picks the Node version. The scripts assume >=22.12.0 (Next 16). Add engines so local, CI and production agree.
