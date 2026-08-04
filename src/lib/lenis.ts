import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

/** The active Lenis instance, or null when smooth scroll is disabled. */
export const getLenis = () => lenis;

/**
 * Boots Lenis and drives it from GSAP's ticker so smooth scroll and every
 * ScrollTrigger share a single rAF loop — no double-rAF jitter and no drift
 * between the scroll position and scrubbed animations.
 *
 * Returns a teardown function. Safe under StrictMode double-mounting.
 */
export function initSmoothScroll() {
  // Users who prefer reduced motion get plain native scrolling.
  if (prefersReducedMotion()) return () => {};

  // Guard against a second init leaving an orphaned instance behind.
  if (lenis) return () => {};

  lenis = new Lenis({
    duration: 1.05,
    // Expo-out feel: quick pickup, long glide.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Native momentum on touch feels better than emulated smoothing.
    syncTouch: false,
    touchMultiplier: 1.6,
  });

  // Keep ScrollTrigger's cached scroll position in sync with Lenis.
  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time: number) => {
    // GSAP ticker time is in seconds; Lenis expects milliseconds.
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);

  // Lenis does its own frame smoothing — GSAP's would fight it.
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  return () => {
    if (tickerFn) gsap.ticker.remove(tickerFn);
    tickerFn = null;
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smoothly scrolls to a selector, element or offset; respects reduced motion. */
export function scrollTo(
  target: string | number | HTMLElement,
  options: { offset?: number } = {}
) {
  const { offset = 0 } = options;

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
    return;
  }

  // Reduced-motion / pre-init fallback.
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  const top =
    typeof target === 'number'
      ? target
      : el instanceof HTMLElement
        ? el.getBoundingClientRect().top + window.scrollY + offset
        : 0;

  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
