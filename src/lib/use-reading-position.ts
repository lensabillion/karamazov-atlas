'use client';

import { useSyncExternalStore } from 'react';
import { GATE_STYLE_ID, POSITION_KEY, gateCss, parsePosition } from './reading-position';

/**
 * The reader's place, shared by every component on the page and every tab.
 *
 * localStorage is the store; a same-tab event and the cross-tab `storage`
 * event both notify subscribers. Every read and write is guarded, because
 * storage throws in private windows and blocked-cookie profiles, and the
 * fallback there is simply the whole book.
 */

const EVENT = 'atlas:position';

function read(): number | null {
  try {
    return parsePosition(window.localStorage.getItem(POSITION_KEY));
  } catch {
    return null;
  }
}

/** Keep the pre-paint stylesheet in step with the saved place. */
function applyGate(position: number | null) {
  const css = gateCss(position);
  let el = document.getElementById(GATE_STYLE_ID);
  if (!css) {
    el?.remove();
    document.documentElement.removeAttribute('data-position');
    return;
  }
  if (!el) {
    el = document.createElement('style');
    el.id = GATE_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  document.documentElement.setAttribute('data-position', String(position));
}

function subscribe(onChange: () => void) {
  // Another tab changed the place: re-gate this one too.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== POSITION_KEY && e.key !== null) return;
    applyGate(read());
    onChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Set the place, or null for the whole book. */
export function setReadingPosition(position: number | null) {
  const next = position === null ? null : parsePosition(String(position));
  try {
    if (next === null) window.localStorage.removeItem(POSITION_KEY);
    else window.localStorage.setItem(POSITION_KEY, String(next));
  } catch {
    // Storage unavailable: the gate still applies for this page view.
  }
  applyGate(next);
  window.dispatchEvent(new Event(EVENT));
}

/** The current place; null means the whole book. Null on the server. */
export function useReadingPosition(): number | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
