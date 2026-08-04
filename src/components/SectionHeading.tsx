import { useGsapContext } from '../hooks/useGsap';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';
import { SplitText } from './SplitText';

interface SectionHeadingProps {
  eyebrow: string;
  title?: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  /**
   * Plain-string title that gets the per-word mask reveal. Use `title`
   * instead when the heading needs rich markup (gradient spans, breaks).
   */
  splitTitle?: string;
}

/**
 * Shared section heading with a GSAP reveal driven by ScrollTrigger.
 * The whole timeline lives in a gsap.context() scoped to this component,
 * so every tween and trigger is killed on unmount.
 */
export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  splitTitle,
}: SectionHeadingProps) => {
  const scope = useGsapContext<HTMLDivElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    tl.from(el.querySelectorAll('[data-h-eyebrow]'), {
      opacity: 0,
      y: 16,
      duration: 0.5,
      ease: EASE.out,
    });

    // SplitText runs its own word reveal — animating the wrapper too would
    // double up the motion, so only tween the block for plain nodes.
    if (!splitTitle) {
      tl.from(
        el.querySelectorAll('[data-h-title]'),
        { opacity: 0, y: 34, duration: 0.85, ease: EASE.expo },
        '-=0.25'
      );
    }

    tl.from(
      el.querySelectorAll('[data-h-sub]'),
      { opacity: 0, y: 20, duration: 0.7, ease: EASE.out },
      '-=0.5'
    ).from(
      el.querySelectorAll('[data-h-rule]'),
      { scaleX: 0, duration: 0.8, ease: EASE.inOut, transformOrigin: 'center' },
      '-=0.6'
    );
  }, [splitTitle]);

  const alignment =
    align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  const headingClass =
    'text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white mb-4 px-2 leading-[1.15]';

  return (
    <div
      ref={scope}
      className={`flex flex-col ${alignment} mb-12 sm:mb-16 max-w-3xl ${
        align === 'center' ? 'mx-auto' : ''
      }`}
    >
      <span data-h-eyebrow className="eyebrow mb-4">
        <span className="w-6 h-px bg-cyan-400/70" />
        {eyebrow}
      </span>

      {splitTitle ? (
        <SplitText as="h2" text={splitTitle} className={headingClass} variant="mask" />
      ) : (
        <h2 data-h-title className={headingClass}>
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          data-h-sub
          className="text-slate-400 text-sm sm:text-base leading-relaxed px-2 max-w-2xl"
        >
          {subtitle}
        </p>
      )}

      <div data-h-rule className="hairline w-40 mt-8" />
    </div>
  );
};
