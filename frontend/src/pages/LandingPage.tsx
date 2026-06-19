import { Link } from 'react-router-dom';
import {
  Zap, Bot, Shield, FileCheck, Users, Telescope,
  BarChart3, ArrowRight, Star,
  Github, Linkedin, Brain, Target, Layers
} from 'lucide-react';

const features = [
  { icon: Bot, title: 'Edu AI Assistant', desc: 'RAG-powered AI mentor for project guidance, career advice, and interview prep.', color: 'from-violet-500 to-purple-600' },
  { icon: Shield, title: 'Project Validator', desc: 'Semantic similarity detection to prevent duplicates before you start building.', color: 'from-blue-500 to-indigo-600' },
  { icon: FileCheck, title: 'Quality Checker', desc: 'Automated code analysis with Pylint, Bandit, and AI-generated improvement reports.', color: 'from-emerald-500 to-teal-600' },
  { icon: Users, title: 'AI Team Matching', desc: 'Smart teammate recommendations based on skills, achievements, and impact scores.', color: 'from-orange-500 to-amber-600' },
  { icon: Telescope, title: 'Project Showcase', desc: 'Public portfolio pages with screenshots, demos, and downloadable resources.', color: 'from-pink-500 to-rose-600' },
  { icon: BarChart3, title: 'Impact Scoring', desc: 'Multi-dimensional scoring: Technical + Innovation + Achievement + Contribution.', color: 'from-cyan-500 to-sky-600' },
];

const stats = [
  { label: 'Students', value: '10K+' },
  { label: 'Projects Validated', value: '50K+' },
  { label: 'AI Interactions', value: '200K+' },
  { label: 'Institutions', value: '100+' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              <span className="text-gradient">ProjectVerse</span><span className="text-white"> AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-float"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, animationDuration: `${4 + Math.random() * 6}s` }} />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-400 text-sm font-medium mb-8">
            <Zap size={14} className="animate-glow-pulse" />
            AI-Powered Academic Innovation Platform
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            From Idea to{' '}
            <span className="text-gradient">Innovation</span>
            <br />in One Platform
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Validate projects, find teammates, get AI mentorship, showcase your work,
            and build a portfolio that stands out — all in one academic ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-lg px-8 py-4">
              Start Building <ArrowRight size={18} />
            </Link>
            <Link to="/showcase" className="btn-secondary flex items-center gap-2 justify-center text-lg px-8 py-4">
              <Telescope size={18} /> Explore Showcases
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="glass-card text-center py-4">
                <div className="font-display text-3xl font-black text-gradient">{s.value}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">16 integrated modules powering the complete academic innovation lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="glass-card group cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-glow-sm group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-surface-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Brain, title: 'Submit Your Idea', desc: 'Enter your project title, description, and tech stack. Our AI checks for duplicates instantly.' },
              { step: '02', icon: Target, title: 'Build & Collaborate', desc: 'Form teams with AI-matched teammates, manage tasks, and chat in your team workspace.' },
              { step: '03', icon: Layers, title: 'Showcase & Score', desc: 'Publish your project, earn quality scores, and build a portfolio faculty and recruiters love.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30 mb-4 relative">
                  <s.icon size={28} className="text-primary-400" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">{s.step}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10" />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
              </div>
              <h2 className="font-display text-4xl font-black text-white mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-slate-400 mb-8">Join thousands of students already using ProjectVerse AI.</p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
                Create Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary-400" />
            <span className="font-display font-bold text-white">ProjectVerse AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 ProjectVerse AI. Built for academic excellence.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
