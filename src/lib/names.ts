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
  warmestRegister: Register;
}

export interface Address {
  speaker: string;
  target: string;
  form: string;
  register: Register;
  count: number;
}

export interface NamesData {
  characters: NamedCharacter[];
  addresses: Address[];
  coverage: { quotes: number; attributed: number };
  lineages: { patronymic: string; father: string; children: string[] }[];
  registers: { key: Register; label: string; description: string }[];
}

let _names: NamesData | null = null;

export function getNames(): NamesData {
  return (_names ??= JSON.parse(
    readFileSync(join(process.cwd(), 'data', 'names.json'), 'utf8'),
  ) as NamesData);
}

export function getNamed(id: string): NamedCharacter | undefined {
  return getNames().characters.find((c) => c.id === id);
}

/** Register ordered from most distant to most intimate. Used to place rungs. */
export const REGISTER_ORDER: Register[] = ['formal', 'distanced', 'neutral', 'familiar', 'tender'];
