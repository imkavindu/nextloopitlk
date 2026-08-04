import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/** Elements that make the cursor react. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * Two-part magnetic cursor: a small solid dot that tracks the pointer almost
 * 1:1, and a larger blurred ring that lags behind for weight.
 *
 * Hovering anything interactive expands the ring, blurs it further and fades
 * the dot — the classic agency-site "target lock". Cards with a `data-cursor`
 * label also swap the ring's contents for that text.
 *
 * Everything runs on `gsap.quickTo`, so pointer movement never triggers a
 * React render and the transforms stay on the compositor.
 */
export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Touch devices have no cursor to enhance, and reduced-motion users
    // shouldn't get an extra moving element.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Hide the native cursor only once we know we're taking over.
    document.documentElement.classList.add('has-custom-cursor');

    const ctx = gsap.context(() => {
      // Different durations create the trailing/elastic relationship.
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' });

      let visible = false;

      const onMove = (e: PointerEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onLeaveWindow = () => {
        visible = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
        if (!target) return;

        const text = target.getAttribute('data-cursor') ?? '';
        label.textContent = text;

        gsap.to(ring, {
          scale: text ? 2.6 : 1.9,
          opacity: 1,
          borderColor: 'rgba(125, 211, 252, 0.85)',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 0.35, opacity: 0.6, duration: 0.3, overwrite: 'auto' });
        gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
      };

      const onOut = (e: PointerEvent) => {
        const target = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
        if (!target) return;

        // Ignore moves between children of the same interactive element.
        const next = e.relatedTarget as HTMLElement | null;
        if (next?.closest?.(INTERACTIVE) === target) return;

        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(148, 163, 184, 0.5)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, overwrite: 'auto' });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      };

      // Press feedback.
      const onDown = () =>
        gsap.to(ring, { scale: 0.8, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
      const onUp = () =>
        gsap.to(ring, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerout', onOut, { passive: true });
      document.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerup', onUp, { passive: true });
      document.addEventListener('pointerleave', onLeaveWindow);

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerout', onOut);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointerleave', onLeaveWindow);
      };
    });

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};
