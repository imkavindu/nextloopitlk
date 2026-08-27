import { ArrowRight } from 'lucide-react';
import { useGsapContext } from '../hooks/useGsap';
import { useTilt } from '../hooks/useInteractions';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';
import { SectionHeading } from '../components/SectionHeading';
import { projects } from '../data/content';

type Project = (typeof projects)[number];

const ProjectCard = ({ project }: { project: Project }) => {
  const tiltRef = useTilt<HTMLAnchorElement>({ max: 6, scale: 1.015 });

  return (
    <a
      ref={tiltRef}
      data-project-card
      href={project.link}
      target={project.link.startsWith('#') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      data-cursor={project.isComingSoon ? 'Coming soon' : 'View case'}
      className="glass card-glow sheen group relative flex flex-col justify-between h-full overflow-hidden rounded-[28px] p-4 mt-0 pt-4"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="media-zoom aspect-[4/3] rounded-2xl mb-6 relative overflow-hidden mt-0">
        {project.isComingSoon && (
          <span className="absolute top-4 left-4 z-20 bg-cyan-500/15 text-cyan-200 border border-cyan-400/30 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md">
            Coming Soon
          </span>
        )}

        {/*
          GSAP drives the parallax on this wrapper via inline transforms.
          The image keeps its own CSS hover zoom — putting both on one
          element meant GSAP's inline transform silently won and the zoom
          never fired.
        */}
        <div data-project-media className="absolute inset-0 will-change-transform">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Gradient scrim + reveal overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
            {project.cta} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* tilt-layer lifts the copy out of the card plane on hover */}
      <div className="tilt-layer px-2 sm:px-3 pb-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.22em] mb-2 block">
            {project.category}
          </span>

          <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-white group-hover:text-gradient transition-colors flex items-center gap-2">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>
        </div>

        <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-bold group-hover:gap-3 transition-all mt-auto">
          {project.cta} <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
};

export const Portfolio = () => {
  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    gsap.from('[data-project-card]', {
      opacity: 0,
      y: 70,
      scale: 0.96,
      duration: 1,
      ease: EASE.expo,
      stagger: 0.14,
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: el.querySelector('[data-project-grid]'),
        start: 'top 85%',
        once: true,
      },
    });

    // Subtle parallax on the media wrapper (not the <img>, which owns the
    // CSS hover zoom) while scrolling through the section.
    gsap.utils.toArray<HTMLElement>('[data-project-media]', el).forEach((media) => {
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }
      );
    });

  });

  return (
    <section ref={scope} id="portfolio" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Proven Track Record"
          title={
            <>
              Systems That <span className="text-gradient">Generate Revenue</span>
            </>
          }
          subtitle='We don&apos;t do "experimental" builds. We deliver battle-tested enterprise systems that have a direct and measurable impact on your bottom line.'
        />

        <div
          data-project-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start max-w-7xl mx-auto"
          style={{ perspective: '1400px' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
