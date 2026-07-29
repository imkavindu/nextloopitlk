import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  Code2, 
  Search, 
  ShoppingCart, 
  Globe, 
  CreditCard, 
  Megaphone, 
  Cpu,
  Palette,
  Layers,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  MinusCircle,
  ArrowUp,
  Zap,
  Shield,
  Smartphone,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const services = [
  {
    title: "High-Velocity Websites",
    description: "Most websites are digital graveyards. We build high-performance sales machines engineered to stop the scroll and force visitors to buy.",
    icon: Code2,
    color: "text-blue-400"
  },
  {
    title: "Aggressive E-commerce",
    description: "Average stores fail. Our engineered checkouts weaponize psychology and speed to explode your conversion rates and double your average order value.",
    icon: ShoppingCart,
    color: "text-purple-400"
  },
  {
    title: "Dominant SEO Growth",
    description: "Ranking is useless if it doesn't pay. We flood your funnel with high-intent buyers who are ready to pull out their credit cards, not just look around.",
    icon: Search,
    color: "text-emerald-400"
  },
  {
    title: "AI Profit Automation",
    description: "Kill manual bottlenecks. Scale your revenue 24/7 with custom AI systems that handle the grunt work while you focus on high-level growth.",
    icon: Cpu,
    color: "text-cyan-400"
  }
];

const projects = [
  {
    title: "shopx.lk",
    category: "High-Traffic Marketplace",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    description: "Engineering a sales machine that handles thousands of concurrent users. We optimized for 0.5s load times, directly increasing customer retention and marketplace revenue by 40%.",
    link: "https://shopx.lk",
    cta: "View Case Study"
  },
  {
    title: "BizFlow",
    category: "Revenue Protection AI",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Stopping profit leaks in real-time. This AI-driven system detects fraudulent orders before they hit the shipping floor, saving businesses millions in lost delivery costs.",
    link: "https://bizflow.vercel.app/",
    cta: "See How It Works"
  },
  {
    title: "ChatLoop",
    category: "Conversational AI Suite",
    isComingSoon: true,
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80",
    description: "Multi-channel automated engagement hub. Seamlessly automates customer chat pipelines across WhatsApp, Messenger, and Web with fine-tuned conversational intelligence.",
    link: "#contact",
    cta: "Get Early Access"
  }
];

const Navbar = ({ theme, toggleTheme }: { theme: 'dark' | 'light'; toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + href);
      return;
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay to prevent background confusion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/75 light:bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'navbar-active py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-100">NextLoop<span className="text-blue-400">IT</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Portfolio', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                onClick={(e) => handleNavClick(e, `#${item.toLowerCase()}`)}
              >
                {item}
              </a>
            ))}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-all border border-white/10 relative"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <a 
              href="#contact" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg shadow-blue-500/10 active:scale-95"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get a Free Quote
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <button 
              className="text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-4 right-4 mt-2 p-5 flex flex-col gap-3 md:hidden rounded-2xl mobile-dropdown-panel z-50 max-h-[80vh] overflow-y-auto"
            >
              {['Services', 'Portfolio', 'About', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-base font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-between"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(e, `#${item.toLowerCase()}`);
                  }}
                >
                  <span>{item}</span>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl text-center font-bold mt-2 shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all"
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

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-[10px] sm:text-xs font-bold tracking-wider uppercase text-blue-400 mb-6">
            Launching • April 6, 2026
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.15] sm:leading-[1.1] px-2 sm:px-0">
            Your Website Is Either A <br className="hidden sm:inline" />
            <span className="text-gradient">Profit Center Or A Cost Center.</span>
          </h1>
          <p className="text-xs sm:text-sm text-blue-400 font-bold uppercase tracking-wider sm:tracking-widest mb-6 sm:mb-8">
            Trusted by founders and established businesses for high-stakes growth.
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
            Stop yielding market share to faster competitors. We build high-velocity sales systems that turn visitors into loyal, paying customers with engineering precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2 sm:px-0">
            <div className="group relative w-full sm:w-auto">
              <a 
                href="#contact"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
              >
                Claim My Free Growth Strategy <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:block">
                100% Free • Secure & Private • No Obligation
              </p>
            </div>
            <a 
              href="https://wa.me/94788920777"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto glass border-emerald-500 hover:bg-emerald-500/10 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" /> WhatsApp An Expert
            </a>
          </div>
          <div className="mt-12 flex flex-col items-center px-4">
            <p className="text-xs sm:text-sm text-slate-400 font-medium mb-6 flex items-center gap-2 text-center justify-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
              Specialized Engineering for High-Growth Verticals:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-10 opacity-50 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-300 px-2">
              <span className="hover:text-blue-400 transition-colors cursor-default">E-Commerce</span>
              <span className="hover:text-blue-400 transition-colors cursor-default">FinTech</span>
              <span className="hover:text-blue-400 transition-colors cursor-default">SaaS Infrastructure</span>
              <span className="hover:text-blue-400 transition-colors cursor-default">AI Enterprise</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-900/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 block">The ROI Engine</span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 px-2">Unleash Your Full Profit Potential</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
            We don't care about "pretty" designs. We care about growth. Every line of code we write is optimized to maximize your revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className={`w-6 h-6 ${service.color}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RiskReversal = () => {
  return (
    <section className="py-16 sm:py-24 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 -z-10 blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass p-6 sm:p-12 lg:p-20 rounded-3xl sm:rounded-[48px] md:rounded-[60px] text-center border-blue-500/20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-8 px-2">Engineering Trust into Every Partnership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-blue-400 w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg sm:text-xl text-white">100% Satisfaction</h4>
              <p className="text-slate-400 text-sm leading-relaxed text-center px-4 md:px-0">We don't ship "okay." We ship results. We work until your vision is real and profitable.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-emerald-400 w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg sm:text-xl text-white">Zero Tech Jargon</h4>
              <p className="text-slate-400 text-sm leading-relaxed text-center px-4 md:px-0">Transparent communication. You'll always know exactly what we are building and why it matters.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Megaphone className="text-purple-400 w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg sm:text-xl text-white">Performance First</h4>
              <p className="text-slate-400 text-sm leading-relaxed text-center px-4 md:px-0">Our systems are built for speed and ROI. If it doesn't move the needle, we don't build it.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Proven Track Record</span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 px-2">Proven Systems That Generate Revenue</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto px-2 leading-relaxed">
            We don't do "experimental" builds. We deliver battle-tested enterprise systems that have a direct and measurable impact on your bottom line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.link}
              target={project.link.startsWith('#') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[32px] glass p-4 block hover:bg-white/10 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative">
                {project.isComingSoon && (
                  <div className="absolute top-4 left-4 z-10 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm shadow-lg shadow-blue-500/10">
                    Coming Soon
                  </div>
                )}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    {project.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="px-2 sm:px-4 pb-4">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors text-white flex items-center gap-2">
                  {project.title}
                  {project.isComingSoon && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 text-[9px] font-bold px-2 py-0.5 rounded-full inline-block">
                      Soon
                    </span>
                  )}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                  {project.cta} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold mb-6 leading-tight text-white">Your Competitors Are Already Hunting Your Customers.</h2>
              <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed italic border-l-2 border-blue-500/50 pl-4">
                "While you hesitate, your competition is leveraging aggressive digital strategies to dominate the market. Every day you wait is a day they get stronger and you lose market share."
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Stop bleeding leads to inferior, but faster competitors",
                  "Weaponize conversion psychology to force visitors to buy",
                  "Crush search results until you are the only choice",
                  "Automate the chaos and focus 100% on massive profit"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-100 text-sm sm:text-base font-bold tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
              <div className="w-full sm:w-auto">
                <a href="#contact" className="w-full sm:w-auto text-center bg-blue-600 text-white px-10 py-5 rounded-full font-bold block sm:inline-block hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 transform hover:-translate-y-1">
                  Unleash My Growth Now
                </a>
              </div>
            </motion.div>
          </div>
          <div className="lg:flex-1 relative w-full max-w-lg lg:max-w-none mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="aspect-square rounded-3xl glass p-3 sm:p-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                  alt="Software Development" 
                  className="w-full h-full object-cover rounded-2xl opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 glass p-4 sm:p-6 rounded-2xl z-20 animate-bounce-slow">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">100%</div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Commitment</div>
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web App Development',
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

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
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("JSON Parse Error. Raw response:", text);
        throw new Error(`Server returned invalid response (Status ${response.status}). Check server logs.`);
      }

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', service: 'Web App Development', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || `Server Error ${response.status}: Failed to send message`);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      setStatus('error');
      const msg = error instanceof Error ? error.message : 'Could not reach server';
      setErrorMessage(`Network error: ${msg}. Please check your connection or try again later.`);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-[28px] sm:rounded-[40px] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/3 bg-blue-600 p-6 sm:p-10 lg:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 italic tracking-tight">Stop Dreaming. <br />Start Dominating.</h2>
            <p className="text-blue-100 text-sm sm:text-base mb-10 leading-relaxed">
              Every day you spend overthinking is a day your competitors scale while you wait. Secure your slot now and let's build your profit engine.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Instant Chat</p>
                  <p className="font-bold underline decoration-blue-300 text-sm sm:text-base">+94 78 892 0777</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Direct Mail</p>
                  <p className="font-bold underline decoration-blue-300 text-sm sm:text-base">hello@nextloopit.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-400/20 rounded-lg flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-tight">Active Support: 24/7 Response</p>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 p-6 sm:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Service Interested In</label>
                <div className="relative">
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none text-sm sm:text-base cursor-pointer"
                  >
                    <option>Web App Development</option>
                    <option>SEO & Optimization</option>
                    <option>AI Automation</option>
                    <option>Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base" 
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 active:scale-[0.99]"
                >
                  {status === 'loading' ? 'Securing Connection...' : 'Secure My Free Strategy Session'}
                </button>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    🚀 Scarcity Alert: Only 2 project slots available for May. <br />
                    <span className="text-blue-400">Guaranteed response within 24 hours.</span>
                  </p>
                  <p className="flex items-center gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest border-t border-white/5 pt-2 w-full justify-center">
                    <span className="flex items-center gap-1 flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% Confidential</span>
                    <span className="flex items-center gap-1 flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> No Sales Pressure</span>
                  </p>
                </div>
              </div>
              
              {status === 'success' && (
                <p className="md:col-span-2 text-emerald-400 text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="md:col-span-2 text-red-400 text-sm font-medium">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hi! I'm the NextLoop IT assistant. How can I help you with your digital journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, the AI assistant is currently unavailable because the API key is not configured. Please add GEMINI_API_KEY to your environment variables." }]);
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "You are a helpful AI assistant for NextLoop IT, a professional IT services company. Your goal is to provide information about the company's services (Web app development, SEO, E-commerce, Domain & Hosting, Payment Integration, Digital Marketing, AI automation, Design, Product Build). Be professional, concise, and encourage users to contact the team for specific projects. The company was founded on April 6, 2026. The website is nextloopit.com. Phone: +94 78 892 0777. Location: Sri Lanka.",
        }
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-[calc(100vw-2rem)] sm:w-[400px] h-[450px] sm:h-[500px] rounded-3xl overflow-hidden flex flex-col mb-4 shadow-2xl border-white/20"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">NextLoop Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <MinusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-slate-400 italic">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-slate-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
      </button>
    </div>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:right-6 z-[60] w-12 h-12 bg-blue-600/80 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/20 backdrop-blur-sm transition-all group border border-white/10"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 min-h-screen bg-slate-950 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            to="/"
            className="flex items-center gap-2 text-blue-400 font-bold mb-8 hover:text-blue-300 transition-colors group px-1 sm:px-0"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          
          <div className="glass p-6 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[40px] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-8 text-white">Privacy Policy</h1>
            
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <p className="text-base sm:text-lg">
                NextLoop IT respects your privacy. Any information submitted through our website or advertisements will only be used to contact you regarding your inquiry, project request, or consultation.
              </p>
              
              <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                <p className="font-bold text-blue-100 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  We do not sell, share, or distribute your personal information to third parties.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Information collected may include:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Full Name",
                    "Phone Number",
                    "Email Address",
                    "Project Requirements"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5 text-sm sm:text-base">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-slate-300 space-y-4 text-sm sm:text-base">
                <p>
                  Your information is securely stored and used only for business communication purposes. We follow industry-standard security protocols to ensure your data remains protected at all times.
                </p>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest">Questions?</p>
                  <a href="mailto:hello@nextloopit.com" className="text-lg sm:text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    hello@nextloopit.com
                  </a>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs sm:text-sm text-slate-500 italic">
                    Last Updated: May 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/nextloopit" },
    { 
      icon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
        </svg>
      ), 
      href: "https://x.com/NextloopIT" 
    },
    { icon: Linkedin, href: "https://www.linkedin.com/company/nextloopit/" },
  ];

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded flex items-center justify-center">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">NextLoop<span className="text-blue-400">IT</span></span>
          </Link>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
            <Link 
              to="/privacy-policy"
              className="text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <RiskReversal />
      <Contact />
    </>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark'; // Dark is default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen font-sans selection:bg-blue-500/30">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Chatbot />
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}
