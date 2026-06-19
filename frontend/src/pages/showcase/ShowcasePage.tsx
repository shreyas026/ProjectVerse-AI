import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showcaseApi } from '../../api/client';
import { Search, Eye, ThumbsUp, ArrowRight, Telescope, Sparkles } from 'lucide-react';
import type { Showcase } from '../../types';

export default function ShowcasePage() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadShowcases = (q?: string) => {
    setLoading(true);
    showcaseApi.list(q ? { q } : undefined)
      .then(r => setShowcases(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadShowcases();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadShowcases(searchQuery);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Telescope size={28} className="text-primary-400" /> Innovation Showcase
          </h1>
          <p className="text-slate-400 mt-1">Browse and search final academic projects built by student innovators</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2 text-xs" placeholder="Search title, tech, tags..." />
          </div>
          <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : showcases.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Telescope size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">No showcases found</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">Try refining your search terms or check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map(s => (
            <div key={s.id} className="glass-card flex flex-col justify-between group">
              <div>
                {/* Visual placeholder or screenshot */}
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 border border-white/5 flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-primary-500/30 transition-all">
                  <div className="absolute inset-0 bg-card-glow opacity-30" />
                  <Sparkles size={24} className="text-primary-400/40 animate-pulse" />
                </div>

                <div className="flex items-center justify-between mb-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>By {s.owner_name}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1.5 group-hover:text-primary-300 transition-colors line-clamp-1">
                  {s.project_title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{s.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {s.tech_stack.slice(0, 3).map(t => (
                    <span key={t} className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1"><Eye size={12} /> {s.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {s.likes}</span>
                </div>
                <Link to={`/showcases/${s.id}`} className="text-primary-400 hover:text-primary-300 font-bold flex items-center gap-0.5">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
