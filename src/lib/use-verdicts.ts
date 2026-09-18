'use client';

import { useSyncExternalStore } from 'react';

/**
 * The reader's verdicts (atlas-o9w6), kept in this browser.
 *
 * Every answer is recorded with the reading position it was given at, so the
 * divergence view (atlas-tbhb) can show when the reader's answers moved and
 * what they had just read. It is a per-reader record by nature — nobody else's
 * verdict belongs on it — so localStorage is the right store; every access is
 * guarded, and a blocked store simply means nothing is remembered.
 */

export interface VerdictRecord {
  /** ISO timestamp. */
  at: string;
  /** 1-based reading position when given; 96 for a reader who has finished. */
  position: number;
  /** Who killed Fyodor Pavlovitch; null for "not yet sure". */
  killed: string | null;
  /** Who is responsible for his death. */
  responsible: string[];
}

const KEY = 'karamazov-atlas:verdicts';
const EVENT = 'atlas:verdicts';
const EMPTY: VerdictRecord[] = [];

let cachedRaw: string | null = null;
let cached: VerdictRecord[] = EMPTY;

function read(): VerdictRecord[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  // useSyncExternalStore needs a stable snapshot: re-parse only when it changed.
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw ?? '[]');
    cached = Array.isArray(parsed) ? (parsed as VerdictRecord[]) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY || e.key === null) onChange(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useVerdicts(): VerdictRecord[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function recordVerdict(record: Omit<VerdictRecord, 'at'>) {
  const next = [...read(), { ...record, at: new Date().toISOString() }];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the answer stands for this page view only.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearVerdicts() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
  window.dispatchEvent(new Event(EVENT));
}
