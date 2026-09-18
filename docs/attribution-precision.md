# Speech attribution: what it can claim, and how often it is right

Measured 18 September 2026 for atlas-w56r (review finding R2) and atlas-30o1.
Code: `scripts/lib/attribution.ts`. Tests: `scripts/test-names.ts`.

## What changed

The first version counted **every name inside a speech as the speaker
addressing that person**, and let a dialogue tag reach back over an adjacent
quotation. The review's example, II.7: Rakitin's long speech about Grushenka
was handed to Alyosha, because Alyosha's short reply sat between it and the
words "said Alyosha".

| Fault | Fix |
| --- | --- |
| A tag reached across another quotation | The gap between a closing quote and its tag may contain no quotation mark, no sentence end and no paragraph break |
| Mention counted as address | A name is **address** only as a vocative: at the start of the speech or set off by punctuation, optionally after "my dear", "brother" and similar; otherwise **mention** |
| A vocative followed by an unlisted patronymic ("Grigory Vassilyevitch,") read as mention | A trailing patronymic is allowed after the name |
| Two-word names wrapped across a line break were missed or counted as the short form | Name patterns match any whitespace between words (19 lines end in "Pyotr", 41 in "Dmitri") |
| "Fetyukovitch", a surname, read as "child of Fetyuk" | Patronymics are only taken from multi-word forms |
| The byname "Lizaveta Smerdyastchaya" classed as a familiar diminutive | A two-word form ending in *-aya* is a byname: distanced |
| "Pyotr Ilyitch" (91), "Kuzma Kuzmitch" (20), "Grigory Vassilyevitch" (29) not in the alias list | Added; *-itch* patronymics recognised |

Every attributed speech that names someone is now stored with its chapter and
character offset (`speech` in `data/names.json`), so each count can be traced
to the passage behind it.

## Coverage

807 of 5,857 quotations carry a dialogue tag the pattern can read (13.8%).
Inside them: **72** names used as direct address, **58** spoken of in the third
person. Coverage is partial by construction and the names page says so; "said
to their face by" is a floor, never a census.

## Precision, by hand

A systematic sample (every third direct-address record, every second mention)
was read against the text after all fixes above.

| Judgement | Correct | Sample | Population |
| --- | --- | --- | --- |
| Direct address is really a vocative | 25 | 25 | 72 |
| Mention is really third-person | 25 | 25 | 58 |
| Speaker is right | 50 | 50 | 130 |

Before the patronymic fix, the mention sample had one error in 25: "wait a
little, Grigory Vassilyevitch," (III.7), a vocative. It is now a unit test.

**What this does not measure.** Recall: speeches without a readable tag
(about 86%) are simply not attributed, and a vocative in unusual form ("O
Lord, Alyosha") may still read as mention. Fifty judgements establish that the
records the atlas shows are reliable, not that they are complete.

## What the site may and may not say

- It may say who is **heard** using a form to someone's face, in tagged speech.
- It may say the **least formal register the text ever uses** for a person,
  narration included. That is a fact about naming.
- It may not say anyone is "unloved", "coldest", or never called something:
  a finite alias list cannot prove absence, and naming is not feeling. The
  pattern the names page draws from the three formal names is labelled a
  reading, offered as one.
