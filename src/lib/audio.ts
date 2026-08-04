/**
 * Tiny Web Audio synth for UI feedback.
 *
 * No asset files: every sound is generated from oscillators, so there is
 * nothing to download and nothing to cache. The AudioContext is created
 * lazily on the first real user gesture, which keeps browsers' autoplay
 * policies happy and avoids a console warning on load.
 */

const STORAGE_KEY = 'nl-sound-enabled';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let unlocked = false;

type Listener = (enabled: boolean) => void;
const listeners = new Set<Listener>();

/** Sound is opt-in: silent unless the visitor has switched it on before. */
export function loadPreference() {
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    enabled = false;
  }
  return enabled;
}

export const isSoundEnabled = () => enabled;

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => fn(enabled));
}

function ensureContext() {
  if (ctx) return ctx;

  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;

  ctx = new AC();
  master = ctx.createGain();
  // Deliberately quiet — UI sound should be felt, not heard.
  master.gain.value = 0.05;
  master.connect(ctx.destination);
  return ctx;
}

/** Must be called from a user gesture handler (click/keydown). */
export function unlockAudio() {
  if (unlocked) return;
  const c = ensureContext();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  unlocked = true;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* private mode — preference just won't persist */
  }

  if (next) {
    unlockAudio();
    // Confirmation blip so the toggle proves itself.
    playTone({ freq: 660, duration: 0.09, type: 'sine', volume: 0.9 });
  }

  emit();
}

export function toggleSound() {
  setSoundEnabled(!enabled);
  return enabled;
}

interface ToneOptions {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  /** Optional glide target for a subtle pitch sweep. */
  toFreq?: number;
}

function playTone({
  freq,
  duration = 0.08,
  type = 'sine',
  volume = 1,
  toFreq,
}: ToneOptions) {
  if (!enabled) return;
  const c = ensureContext();
  if (!c || !master || c.state !== 'running') return;

  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (toFreq) {
    osc.frequency.exponentialRampToValueAtTime(toFreq, c.currentTime + duration);
  }

  // Short attack + exponential decay = "tick", never a click or pop.
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

  osc.connect(gain);
  gain.connect(master);

  osc.start();
  osc.stop(c.currentTime + duration + 0.02);

  // Free the nodes as soon as they're done.
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

/** Soft high tick for hovering interactive elements. */
export const playHover = () =>
  playTone({ freq: 1180, duration: 0.055, type: 'sine', volume: 0.55 });

/** Slightly fuller confirm sound with an upward glide for clicks. */
export const playClick = () =>
  playTone({ freq: 520, toFreq: 880, duration: 0.11, type: 'triangle', volume: 1 });

/** Releases the AudioContext (used on full app teardown). */
export function disposeAudio() {
  master?.disconnect();
  void ctx?.close();
  ctx = null;
  master = null;
  unlocked = false;
}
