import { useState } from 'react';
import { CheckCircle2, Loader2, Mail, MessageSquare, Send } from 'lucide-react';
import { useGsapContext } from '../hooks/useGsap';
import { gsap, EASE, prefersReducedMotion } from '../lib/gsap';

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm sm:text-base placeholder:text-slate-500 focus:outline-none';

export const Contact = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web App Development',
    message: '',
  });

  const scope = useGsapContext<HTMLElement>((_ctx, el) => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    });

    tl.from('[data-contact-panel]', {
      opacity: 0,
      y: 60,
      scale: 0.97,
      duration: 1,
      ease: EASE.expo,
    })
      .from(
        '[data-contact-aside] > *',
        { opacity: 0, x: -26, duration: 0.6, stagger: 0.1, ease: EASE.out },
        '-=0.6'
      )
      .from(
        '[data-contact-field]',
        { opacity: 0, y: 26, duration: 0.6, stagger: 0.08, ease: EASE.out },
        '-=0.55'
      );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data: { error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Server returned invalid response (Status ${response.status}). Check server logs.`
        );
      }

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', service: 'Web App Development', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || `Server Error ${response.status}: Failed to send message`);
      }
    } catch (error) {
      setStatus('error');
      const msg = error instanceof Error ? error.message : 'Could not reach server';
      setErrorMessage(`Network error: ${msg}. Please check your connection or try again later.`);
    }
  };

  return (
    <section ref={scope} id="contact" className="relative py-20 sm:py-28 pb-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          data-contact-panel
          className="glass rounded-[28px] sm:rounded-[40px] overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Aside */}
          <div
            data-contact-aside
            className="lg:w-1/3 relative p-7 sm:p-10 lg:p-12 text-white overflow-hidden"
            style={{
              background:
                'linear-gradient(160deg, #1d4ed8 0%, #0e7490 55%, #065f46 100%)',
            }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 blur-3xl rounded-full pointer-events-none" />

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-5 tracking-tight relative">
              Stop Dreaming.
              <br />
              Start Dominating.
            </h2>

            <p className="text-blue-50/85 text-sm sm:text-base mb-10 leading-relaxed relative">
              Every day you spend overthinking is a day your competitors scale while you wait.
              Secure your slot now and let&apos;s build your profit engine.
            </p>

            <a
              href="https://wa.me/94788920777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 mb-6 group relative"
            >
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-blue-100/80 uppercase font-bold tracking-[0.2em]">
                  Instant Chat
                </p>
                <p className="font-bold text-sm sm:text-base">+94 78 892 0777</p>
              </div>
            </a>

            <a href="mailto:hello@nextloopit.com" className="flex items-center gap-4 mb-6 group relative">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-blue-100/80 uppercase font-bold tracking-[0.2em]">
                  Direct Mail
                </p>
                <p className="font-bold text-sm sm:text-base">hello@nextloopit.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 relative">
              <div className="w-11 h-11 bg-emerald-300/20 rounded-xl flex items-center justify-center text-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-50 uppercase tracking-tight">
                Active Support: 24/7 Response
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-2/3 p-6 sm:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div data-contact-field className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>

              <div data-contact-field className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>

              <div data-contact-field className="space-y-2 md:col-span-2">
                <label htmlFor="service" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Service Interested In
                </label>
                <div className="relative">
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                  >
                    <option className="bg-slate-900">Web App Development</option>
                    <option className="bg-slate-900">SEO &amp; Optimization</option>
                    <option className="bg-slate-900">AI Automation</option>
                    <option className="bg-slate-900">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div data-contact-field className="space-y-2 md:col-span-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-y`}
                  placeholder="Tell us about your project..."
                />
              </div>

              <div data-contact-field className="md:col-span-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full font-bold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Securing Connection...
                    </>
                  ) : (
                    <>
                      Secure My Free Strategy Session <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-5 flex flex-col items-center gap-3">
                  <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.18em] leading-relaxed">
                    🚀 Only 2 project slots available for May.
                    <br />
                    <span className="text-cyan-400">Guaranteed response within 24 hours.</span>
                  </p>

                  <p className="flex flex-wrap items-center justify-center gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-[0.18em] border-t border-white/5 pt-3 w-full">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% Confidential
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> No Sales Pressure
                    </span>
                  </p>
                </div>
              </div>

              {status === 'success' && (
                <p
                  role="status"
                  className="md:col-span-2 text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3"
                >
                  Message sent successfully! We&apos;ll get back to you soon.
                </p>
              )}

              {status === 'error' && (
                <p
                  role="alert"
                  className="md:col-span-2 text-red-400 text-sm font-semibold bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3"
                >
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
