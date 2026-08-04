import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Smooth 3D tilt that follows the pointer. Disabled on touch/coarse pointers
 * and when the user prefers reduced motion. All tweens live in a
 * gsap.context() that is reverted on unmount.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(
  options: { max?: number; scale?: number; glare?: boolean } = {}
) {
  const { max = 9, scale = 1.02, glare = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const setX = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const setY = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setX(px * max * 2);
        setY(-py * max * 2);
        if (glare) {
          el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
          el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
        }
      };

      const onEnter = () =>
        gsap.to(el, { scale, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });

      const onLeave = () => {
        gsap.to(el, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.6)',
          overwrite: 'auto',
        });
      };

      gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      };
    }, el);

    return () => ctx.revert();
  }, [max, scale, glare]);

  return ref;
}

/**
 * Magnetic hover — the element eases toward the cursor, then springs back.
 * Great for primary CTAs. Pointer-fine devices only.
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>(strength = 0.28) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);

      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    }, el);

    return () => ctx.revert();
  }, [strength]);

  return ref;
}

/**
 * Counts a number up when the element scrolls into view.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  end: number,
  suffix = ''
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = `${end}${suffix}`;
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(obj.val)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [end, suffix]);

  return ref;
}
