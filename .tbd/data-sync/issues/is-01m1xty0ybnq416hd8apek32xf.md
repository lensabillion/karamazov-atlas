---
type: is
id: is-01m1xty0ybnq416hd8apek32xf
title: "The Case File: turn a corpus browser into a reader's companion"
kind: epic
status: open
priority: 1
version: 12
labels: []
dependencies: []
child_order_hints:
  - is-01m1xtyp878v353mmdww1pypya
  - is-01m1xtypdn4msy69gy63y2q2ky
  - is-01m1xtypjypmckkas2x6fwny2q
  - is-01m1xtzhjd9p5gh2eda5nadq4d
  - is-01m1xtzhqzfv2y5at0xcdqp7rr
  - is-01m1xtzhxc0veaz3jmk0hzrtmy
  - is-01m1xtzj2vpws0jx7zj83mcdh2
  - is-01m1xtzj8anawer9vhaycpeanq
  - is-01m1xv2ez0nsbwqmmq7pn5qnd9
  - is-01m1xv9esyw6tfn9s8jq6cfg56
  - is-01m1xv9ezbqapy0xw2wfafej3r
created_at: 2026-09-07T11:44:22.475Z
updated_at: 2026-09-07T11:50:37.291Z
---
The app is currently an analyst's tool wearing a reader's clothes. Every page answers 'what does the data say' — mention counts, co-occurrence, structure. None answers 'what do I need right now, at chapter 41, having forgotten who Rakitin is.'

Reorients around two facts established in docs/research-book-representation.md (PR #2):

1. The names are the documented barrier to this novel, and we already solved the machine half. Alias resolution is why Dmitri counts 1,291 rather than 923. A reader has never seen any of it.

2. The book is an argument staged as a family, and the plot is a trial where the legal and moral answers come apart. Dmitri is convicted of a murder he did not commit; Ivan, who supplied the reasoning, goes free. No representation of any book makes the reader take a position on that.

Destination: the reader sits in the jury box. Evidence accrues as they read, cited to book and chapter. They return verdicts on two deliberately separate questions — who killed Fyodor Pavlovitch, and who is responsible — and see their own arc at the end.

Sequenced so value lands early: the name key and reading position are useful alone and need no API key. The verdict mechanic is the creative bet and comes after there is real evidence under it.
