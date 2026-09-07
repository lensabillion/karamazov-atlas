---
type: is
id: is-01m1xtyp878v353mmdww1pypya
title: "Name Key: make every name in the book resolvable"
kind: feature
status: closed
priority: 1
version: 2
labels:
  - reader
dependencies: []
parent_id: is-01m1xty0ybnq416hd8apek32xf
created_at: 2026-09-07T11:44:44.294Z
updated_at: 2026-09-07T12:07:04.176Z
closed_at: 2026-09-07T12:07:04.176Z
close_reason: null
resolution: null
duplicate_of: null
---
Tap or hover any character name anywhere in the app and get: who they are in one line, every form their name takes, and — the part nobody does — who calls them which form and what that says about the relationship. Russian naming encodes formality: the same person is Alexey Fyodorovitch to a stranger, Alyosha to his brothers, Alyoshka in contempt, Alyoshenka in tenderness.

We already hold the machine half in data/mentions.json. The alias table exists, is conservative, and is why Dmitri counts 1,291 rather than the 923 a naive search returns. No reader has ever seen it.

Highest value-to-effort in the whole project: no API key, no extraction, no new data. It is the difference between an analyst's tool and something a reader keeps open beside the book.

Done when: a name in the reader is tappable; the panel shows identity, alias forms, and speaker-relationship notes; it works from the chapter page, the character page, and search results.
