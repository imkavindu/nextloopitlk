import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE, DURATION, prefersReducedMotion, revealTrigger } from '../lib/gsap';

/**
 * Runs GSAP code inside a `gsap.context()` scoped to the returned ref.
 * The context is reverted on unmount, which kills every tween/ScrollTrigger
 * created inside it — no memory leaks, StrictMode-safe.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context, scope: T) => void,
  deps: unknown[] = []
) {
  const scope = useRef<T>(null);

  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context((self) => setup(self, scope.current as T), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/**
 * Staggered fade+rise reveal for any element carrying `[data-reveal]`
 * inside the returned scope. Triggered by ScrollTrigger.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: { y?: number; stagger?: number; start?: string; selector?: string } = {}
) {
  const { y = 40, stagger = 0.09, start = 'top 82%', selector = '[data-reveal]' } = options;

  return useGsapContext<T>((_ctx, scope) => {
    const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'all' });
      return;
    }

    gsap.from(targets, {
      opacity: 0,
      y,
      duration: DURATION.base,
      ease: EASE.out,
      stagger,
      scrollTrigger: { ...revealTrigger(scope), start },
    });
  });
}

/**
 * Parallax drift for elements marked `[data-parallax]`.
 * Uses a numeric `data-parallax` value as the strength multiplier.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  selector = '[data-parallax]'
) {
  return useGsapContext<T>((_ctx, scope) => {
    if (prefersReducedMotion()) return;

    gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el) => {
      const strength = parseFloat(el.dataset.parallax || '1');
      gsap.to(el, {
        yPercent: -18 * strength,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  });
}
