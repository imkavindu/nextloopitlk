import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, Mail } from 'lucide-react';
import { useRevealOnScroll } from '../hooks/useGsap';

const collected = ['Full Name', 'Phone Number', 'Email Address', 'Project Requirements'];

export const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scope = useRevealOnScroll<HTMLDivElement>({ y: 30, stagger: 0.08, start: 'top 95%' });

  return (
    <div className="pt-28 pb-16 sm:pt-36 sm:pb-24 min-h-screen text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-blue-600/10 blur-[140px] rounded-full -z-10" />

      <div ref={scope} className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          data-reveal
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-8 hover:text-cyan-300 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div
          data-reveal
          className="glass p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[40px] relative overflow-hidden"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold mb-8 text-white">
            Privacy <span className="text-gradient">Policy</span>
          </h1>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p className="text-base sm:text-lg">
              NextLoop IT respects your privacy. Any information submitted through our website or
              advertisements will only be used to contact you regarding your inquiry, project
              request, or consultation.
            </p>

            <div className="p-5 sm:p-6 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
              <p className="font-bold text-blue-50 flex items-start gap-3 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                We do not sell, share, or distribute your personal information to third parties.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-3">
                <Layers className="w-5 h-5 text-cyan-400" />
                Information collected may include:
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collected.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 bg-white/[0.03] p-3.5 rounded-xl border border-white/8 text-sm sm:text-base hover:border-cyan-400/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm sm:text-base">
              Your information is securely stored and used only for business communication purposes.
              We follow industry-standard security protocols to ensure your data remains protected at
              all times.
            </p>

            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-[0.2em]">
                  Questions?
                </p>
                <a
                  href="mailto:hello@nextloopit.com"
                  className="text-lg sm:text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  hello@nextloopit.com
                </a>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 italic sm:text-right">
                Last Updated: May 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
