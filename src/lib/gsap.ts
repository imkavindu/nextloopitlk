import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once for the whole app.
gsap.registerPlugin(ScrollTrigger);

// Respect users who prefer reduced motion.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared easing / timing tokens so every animation feels part of one system.
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  smooth: 'power1.out',
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

/** Default ScrollTrigger config for "reveal once when it enters view". */
export const revealTrigger = (trigger: Element | string) => ({
  trigger,
  start: 'top 82%',
  toggleActions: 'play none none none' as const,
});

export { gsap, ScrollTrigger };
