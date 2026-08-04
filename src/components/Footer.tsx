import { Link } from 'react-router-dom';
import { Code2, Facebook, Linkedin } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useGsap';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const socialLinks = [
  { icon: Facebook, href: 'https://web.facebook.com/nextloopit', label: 'Facebook' },
  { icon: XIcon, href: 'https://x.com/NextloopIT', label: 'X' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/nextloopit/', label: 'LinkedIn' },
];

export const Footer = () => {
  const scope = useRevealOnScroll<HTMLElement>({ y: 26, stagger: 0.1 });

  return (
    <footer ref={scope} className="relative pt-16 pb-12 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 hairline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link data-reveal to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 flex items-center justify-center transition-transform duration-500 group-hover:rotate-[8deg]">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight text-white">
              NextLoop<span className="text-gradient">IT</span>
            </span>
          </Link>

          <div data-reveal className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-400/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <social.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>

          <div
            data-reveal
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm"
          >
            <Link
              to="/privacy-policy"
              className="text-slate-400 hover:text-cyan-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              Privacy Policy
            </Link>
            <p className="text-slate-500 text-center sm:text-left">
              © 2026 NextLoop IT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
