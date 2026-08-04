import { ArrowUpRight } from 'lucide-react';
import { useGsapContext } from '../hooks/useGsap';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';
import { SectionHeading } from '../components/SectionHeading';
import { TiltCard } from '../components/TiltCard';
import { services } from '../data/content';

export const Services = () => {
  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    // Cards fly in with a 3D flip + stagger as the grid enters the viewport.
    gsap.from('[data-service-card]', {
      opacity: 0,
      y: 60,
      rotateX: -12,
      transformOrigin: 'top center',
      duration: 0.9,
      ease: EASE.expo,
      stagger: 0.12,
      scrollTrigger: {
        trigger: el.querySelector('[data-service-grid]'),
        start: 'top 85%',
        once: true,
      },
    });

    // Icons pop in slightly after their card. clearProps drops the inline
    // transform afterwards — otherwise it outranks the `group-hover:scale`
    // classes on the icon and the hover effect never appears.
    gsap.from('[data-service-icon]', {
      scale: 0.4,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(2)',
      stagger: 0.12,
      delay: 0.25,
      clearProps: 'transform',
      scrollTrigger: {

        trigger: el.querySelector('[data-service-grid]'),
        start: 'top 85%',
        once: true,
      },
    });
  });

  return (
    <section
      ref={scope}
      id="services"
      className="relative py-20 sm:py-28 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="The ROI Engine"
          title={
            <>
              Unleash Your Full <span className="text-gradient">Profit Potential</span>
            </>
          }
          subtitle='We don&apos;t care about "pretty" designs. We care about growth. Every line of code we write is optimized to maximize your revenue.'
        />

        <div
          data-service-grid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          style={{ perspective: '1200px' }}
        >
          {services.map((service) => (
            <TiltCard
              key={service.title}
              max={9}
              className="p-6 sm:p-7 rounded-3xl group h-full"
            >
              <div data-service-card className="h-full flex flex-col">
                <div
                  data-service-icon
                  className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg ${service.glow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                >
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold mb-3 text-white">
                  {service.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {service.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
