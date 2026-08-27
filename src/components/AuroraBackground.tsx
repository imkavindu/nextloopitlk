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
    <div ref={scope} aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="orb bg-blue-600/10"
        style={{
          width: isHero ? '40%' : '30%',
          height: isHero ? '40%' : '30%',
          top: '-10%',
          left: '30%',
        }}
      />
      <div
        className="orb bg-cyan-500/05"
        style={{ width: '25%', height: '25%', top: '15%', right: '10%' }}
      />
    </div>
  );
};
