"""Pydantic schemas.

These mirror the TypeScript interfaces in web/src/lib one-to-one, deliberately.
FastAPI emits an OpenAPI document from them, and `openapi-typescript` regenerates
the client types — so the shapes are defined once, here, and the front end can
never drift from the API without the compiler noticing.
"""

import warnings
from typing import Literal

from pydantic import BaseModel, Field

Register = Literal["formal", "distanced", "neutral", "familiar", "tender"]
Group = Literal["family", "women", "monastery", "boys", "town", "court"]

# `register` is the wire name the front end reads, so the two models below keep
# it — but it collides with `BaseModel.register`, the classmethod `abc.ABCMeta`
# hangs on every pydantic model, and pydantic reacts to that collision twice.
#
# It takes the inherited classmethod as the field's DEFAULT. That is not
# cosmetic: it made `register` optional in the published OpenAPI document
# (absent from `required`, telling any client a row might lack a field every
# row has) and let a model be built with a bound method sitting where a
# register belongs. Writing `Field(...)` puts an explicit "required, no
# default" in the class body, so there is nothing left to inherit.
#
# It also warns, on every import and every test run. There is no per-field
# opt-out for this one anywhere in `ConfigDict`, so the single message is
# filtered around the two class bodies that raise it and nowhere else.
_REGISTER_SHADOWS_BASEMODEL = (
    r'Field name "register" in "\w+" shadows an attribute in parent "BaseModel"'
)


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


with warnings.catch_warnings():
    warnings.filterwarnings("ignore", _REGISTER_SHADOWS_BASEMODEL, UserWarning)

    class NameForm(BaseModel):
        form: str
        kind: Literal["patronymic-pair", "given", "diminutive", "surname"]
        register: Register = Field(...)
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


with warnings.catch_warnings():
    warnings.filterwarnings("ignore", _REGISTER_SHADOWS_BASEMODEL, UserWarning)

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
        register: Register = Field(...)
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
