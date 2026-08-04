import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Code2, Menu, X } from 'lucide-react';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';


import { scrollTo } from '../lib/lenis';
import { SoundToggle } from './SoundToggle';


const NAV_ITEMS = ['Services', 'Portfolio', 'About', 'Contact'] as const;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Backdrop blur toggle on scroll.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when resizing up to desktop.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Entrance animation + scroll progress bar, all inside a gsap.context().
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.from('[data-nav-item]', {
          opacity: 0,
          y: -18,
          duration: 0.7,
          ease: EASE.out,
          stagger: 0.07,
          delay: 0.15,
        });
      }

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + href);
      return;
    }

    // Smooth in-page scroll via Lenis, offset for the fixed navbar.
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      scrollTo(href, { offset: -80 });
    }

  };

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#05070d]/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isMobileMenuOpen ? 'navbar-active py-3' : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            data-nav-item
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform duration-500 group-hover:rotate-[8deg]">
              <Code2 className="text-white w-5 h-5" />
              <span className="absolute inset-0 rounded-xl bg-blue-400/40 blur-lg -z-10" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white">
              NextLoop<span className="text-gradient">IT</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-9">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                data-nav-item
                href={`#${item.toLowerCase()}`}
                className="nav-link text-sm font-medium text-slate-300 hover:text-white"
                onClick={(e) => handleNavClick(e, `#${item.toLowerCase()}`)}
              >
                {item}
              </a>
            ))}

            <a
              data-nav-item
              data-cursor="Let's talk"
              href="#contact"
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold active:scale-95"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get a Free Quote
            </a>

            <span data-nav-item>
              <SoundToggle />
            </span>
          </div>

          {/* Sound toggle stays reachable on mobile, outside the burger menu. */}
          <div className="flex items-center gap-2 md:hidden">
            <SoundToggle />

            <button
              data-nav-item
              className="text-white w-10 h-10 flex items-center justify-center rounded-xl glass"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Scroll progress indicator */}
        <div
          ref={progressRef}
          aria-hidden
          className={`scroll-progress absolute bottom-0 left-0 h-[2px] w-full scale-x-0 transition-opacity duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute top-full left-4 right-4 mt-2 p-5 flex flex-col gap-2 md:hidden rounded-2xl mobile-dropdown-panel z-50 max-h-[80vh] overflow-y-auto"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-base font-semibold py-3 px-4 rounded-xl flex items-center justify-between"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(e, `#${item.toLowerCase()}`);
                  }}
                >
                  <span>{item}</span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary py-3.5 px-4 rounded-xl text-center font-bold mt-2 active:scale-[0.98]"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(e, '#contact');
                }}
              >
                Get a Free Quote
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
