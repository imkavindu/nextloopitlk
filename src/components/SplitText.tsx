import { useEffect, useRef } from 'react';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';

type Variant = 'mask' | 'clip' | 'chars';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Element to render. Headings should pass their real level for a11y. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /**
   * mask  — words rise out of an overflow-hidden mask (default, cheapest)
   * clip  — lines wipe in via an animated clip-path
   * chars — per-character stagger, best for short strings only
   */
  variant?: Variant;
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  stagger?: number;
  /** Play immediately on mount instead of waiting for ScrollTrigger. */
  immediate?: boolean;
  start?: string;
}

/**
 * Scroll-triggered text reveal.
 *
 * The text is split into spans at render time (not by mutating the DOM after
 * paint), so there's no flash of unsplit text and no layout thrash. Screen
 * readers get the original string via `aria-label` while the visual spans are
 * hidden from the accessibility tree.
 */
export const SplitText = ({
  text,
  className = '',
  as: Tag = 'span',
  variant = 'mask',
  delay = 0,
  stagger,
  immediate = false,
  start = 'top 85%',
}: SplitTextProps) => {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>('[data-split-item]');
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, yPercent: 0, clipPath: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      const scrollTrigger = immediate ? undefined : { trigger: el, start, once: true };

      if (variant === 'clip') {
        gsap.fromTo(
          targets,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.1,
            ease: EASE.expo,
            stagger: stagger ?? 0.12,
            delay,
            scrollTrigger,
          }
        );
        return;
      }

      // mask + chars both animate out of their overflow-hidden wrapper.
      gsap.fromTo(
        targets,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: variant === 'chars' ? 0.8 : 1,
          ease: EASE.expo,
          stagger: stagger ?? (variant === 'chars' ? 0.022 : 0.045),
          delay,
          scrollTrigger,
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, variant, delay, stagger, immediate, start]);

  // `clip` animates whole lines; the others need per-token masks.
  if (variant === 'clip') {
    return (
      <Tag ref={scope as never} className={className} aria-label={text}>
        <span data-split-item aria-hidden className="inline-block">
          {text}
        </span>
      </Tag>
    );
  }

  const tokens = variant === 'chars' ? Array.from(text) : text.split(' ');

  return (
    <Tag ref={scope as never} className={className} aria-label={text}>
      {tokens.map((token, i) => (
        <span
          key={`${token}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <span data-split-item className="inline-block will-change-transform">
            {token === ' ' ? '\u00A0' : token}
            {variant === 'mask' ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
};
