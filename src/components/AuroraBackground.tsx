import { useGsapContext } from '../hooks/useGsap';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/**
 * Floating gradient orbs. Each orb drifts on its own infinite timeline and
 * also responds to scroll (parallax) via ScrollTrigger scrub.
 * Everything is created inside a gsap.context() and reverted on unmount.
 */
export const AuroraBackground = ({ variant = 'hero' }: { variant?: 'hero' | 'section' }) => {
  const scope = useGsapContext<HTMLDivElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    const orbs = gsap.utils.toArray<HTMLElement>('.orb', el);

    orbs.forEach((orb, i) => {
      // Continuous free-floating drift
      gsap.to(orb, {
        xPercent: gsap.utils.random(-14, 14),
        yPercent: gsap.utils.random(-18, 18),
        scale: gsap.utils.random(0.9, 1.15),
        duration: gsap.utils.random(9, 15),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });

      // Scroll-linked parallax
      gsap.to(orb, {
        yPercent: `+=${(i % 2 === 0 ? -1 : 1) * 22}`,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });
  });

  const isHero = variant === 'hero';

  return (
    <div ref={scope} aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="orb bg-blue-600/25"
        style={{
          width: isHero ? '46%' : '38%',
          height: isHero ? '46%' : '38%',
          top: '-8%',
          left: '-8%',
        }}
      />
      <div
        className="orb bg-cyan-500/20"
        style={{ width: '34%', height: '34%', top: '20%', right: '-6%' }}
      />
      <div
        className="orb bg-emerald-500/20"
        style={{ width: '40%', height: '40%', bottom: '-12%', left: '25%' }}
      />
    </div>
  );
};
