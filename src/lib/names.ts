import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Register = 'formal' | 'distanced' | 'neutral' | 'familiar' | 'tender';

export interface NameForm {
  form: string;
  kind: 'patronymic-pair' | 'given' | 'diminutive' | 'surname';
  register: Register;
  gloss: string;
  count: number;
  chapters: string[];
  firstChapter: string | null;
}

export interface NamedCharacter {
  id: string;
  name: string;
  short: string;
  group: string;
  patronymic: string | null;
  givenName: string | null;
  fatherName: string | null;
  forms: NameForm[];
  total: number;
  registerByChapter: Record<string, Partial<Record<Register, number>>>;
  /** Least formal register the TEXT ever uses for them, narration included. Naming, not feeling. */
  warmestRegister: Register;
}

/** A name used in attributed speech: who said which form of whose name, and how often. */
export interface Address {
  speaker: string;
  target: string;
  form: string;
  register: Register;
  count: number;
}

export interface SpeechRecord {
  chapter: string;
  at: number;
  length: number;
  speaker: string;
  names: { target: string; form: string; register: Register; relation: 'address' | 'mention' }[];
}

export interface NamesData {
  characters: NamedCharacter[];
  /** Direct address only: a vocative in attributed speech. */
  addresses: Address[];
  /** Third-person mention in attributed speech. */
  spokenOf: Address[];
  speech: SpeechRecord[];
  coverage: { quotes: number; attributed: number; addressed: number; mentioned: number };
  lineages: { patronymic: string; father: string; children: string[] }[];
  registers: { key: Register; label: string; description: string }[];
}

/** See the note in corpus.ts: caching in development hid rebuilt data. */
const CACHE = process.env.NODE_ENV === 'production';

let _names: NamesData | null = null;

export function getNames(): NamesData {
  const read = () =>
    JSON.parse(readFileSync(join(process.cwd(), 'data', 'names.json'), 'utf8')) as NamesData;
  if (!CACHE) return read();
  return (_names ??= read());
}

export function getNamed(id: string): NamedCharacter | undefined {
  return getNames().characters.find((c) => c.id === id);
}

/** Register ordered from most distant to most intimate. Used to place rungs. */
export const REGISTER_ORDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
