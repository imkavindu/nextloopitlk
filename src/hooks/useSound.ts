import { useCallback, useEffect, useState } from 'react';
import {
  isSoundEnabled,
  loadPreference,
  playClick,
  playHover,
  subscribe,
  toggleSound,
  unlockAudio,
} from '../lib/audio';

/**
 * Reactive view of the global sound preference, plus the play helpers.
 * Every consumer stays in sync through the audio module's subscription list.
 */
export function useSound() {
  const [enabled, setEnabled] = useState(isSoundEnabled);

  useEffect(() => {
    // Hydrate from localStorage on first mount.
    setEnabled(loadPreference());
    const unsubscribe = subscribe(setEnabled);
    return () => {
      unsubscribe();
    };
  }, []);


  return {
    enabled,
    toggle: useCallback(() => toggleSound(), []),
    hover: useCallback(() => playHover(), []),
    click: useCallback(() => playClick(), []),
  };
}

/**
 * Delegated hover/click sound for anything matching the interactive
 * selectors. One pair of listeners on the document beats hundreds of
 * per-element handlers, and new nodes are covered automatically.
 */
export function useGlobalSoundFx() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const INTERACTIVE =
      'a, button, [role="button"], input, textarea, select, [data-cursor]';

    // pointerover bubbles from descendants too, which would retrigger the
    // sound as the pointer crosses an icon inside a button. Only fire when
    // the closest interactive ancestor actually changes.
    let current: Element | null = null;

    const onOver = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) ?? null;
      if (target === current) return;
      current = target;
      if (!target || target.hasAttribute('data-no-sound')) return;
      playHover();
    };


    const onClick = (e: Event) => {
      // Any click is a valid gesture to unlock the AudioContext.
      unlockAudio();
      const target = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
      if (!target || target.hasAttribute('data-no-sound')) return;
      playClick();
    };

    // pointerover fires per element (unlike pointerenter) so delegation works.
    if (fine) document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onClick, { passive: true });

    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onClick);
    };
  }, []);
}
