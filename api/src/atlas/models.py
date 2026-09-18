"""Pydantic schemas.

These mirror the TypeScript interfaces in web/src/lib one-to-one, deliberately.
FastAPI emits an OpenAPI document from them, and `openapi-typescript` regenerates
the client types — so the shapes are defined once, here, and the front end can
never drift from the API without the compiler noticing.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Register = Literal["formal", "distanced", "neutral", "familiar", "tender"]
Group = Literal["family", "women", "monastery", "boys", "town", "court"]


class Chapter(BaseModel):
    id: str
    part: str
    part_num: int
    book_num: int
    book_title: str
    num: int
    roman: str
    title: str
    cite: str
    start: int
    end: int
    word_count: int


class CorpusMeta(BaseModel):
    title: str
    author: str
    translator: str
    source: str
    word_count: int
    chapter_count: int
    book_count: int


class Character(BaseModel):
    id: str
    name: str
    short: str
    group: Group
    aliases: list[str]
    total: int
    chapter_count: int


class NameForm(BaseModel):
    form: str
    kind: Literal["patronymic-pair", "given", "diminutive", "surname"]
    register: Register
    gloss: str
    count: int
    chapters: list[str]
    first_chapter: str | None = None


class NamedCharacter(BaseModel):
    id: str
    name: str
    short: str
    group: Group
    patronymic: str | None = None
    given_name: str | None = None
    father_name: str | None = None
    forms: list[NameForm]
    total: int
    warmest_register: Register = Field(
        description=(
            "The least formal register in which the text ever names this character, "
            "narration included. It measures naming, not affection — see atlas-w56r."
        )
    )


class Lineage(BaseModel):
    patronymic: str
    father: str
    children: list[str]


class Address(BaseModel):
    """A name used in attributed dialogue: who said which form of whose name.

    `/addresses` returns direct address only (a vocative: "Listen, Alyosha, …");
    `/spoken-of` returns third-person mentions. Coverage is partial by
    construction: only quoted passages whose speaker can be identified are
    counted, and `/names/coverage` reports the ratio so no caller can mistake
    this for a census.
    """

    speaker: str
    target: str
    form: str
    register: Register
    count: int


class Coverage(BaseModel):
    quotes: int
    attributed: int
    ratio: float
    addressed: int = Field(description="Names used as direct address in attributed speech.")
    mentioned: int = Field(description="Names mentioned in the third person in attributed speech.")


class SearchHit(BaseModel):
    chapter_id: str
    cite: str
    title: str
    score: float
    excerpt: str


class Edge(BaseModel):
    source: str
    target: str
    weight: int
    chapters: list[str]
