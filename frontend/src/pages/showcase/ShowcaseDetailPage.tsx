import { useEffect, useState } from 'react';
import { useParams as getParams } from 'react-router-dom';
import { showcaseApi } from '../../api/client';
import { ThumbsUp, Download, Github, Globe, ExternalLink, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Showcase } from '../../types';

export default function ShowcaseDetailPage() {
  const { id } = getParams<{ id: string }>();
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const loadShowcase = () => {
    if (!id) return;
    showcaseApi.get(id)
      .then(r => setShowcase(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadShowcase();
  }, [id]);

  const handleLike = async () => {
    if (!id || liked) return;
    try {
      await showcaseApi.like(id);
      setLiked(true);
      setShowcase(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      toast.success('Project liked!');
    } catch {
      toast.error('Failed to like project');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!showcase) return <div className="text-center py-16 text-slate-400">Showcase not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="badge-primary mb-2 block w-max">Project Showcase</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">{showcase.project_title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><User size={12} /> By {showcase.owner_name}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(showcase.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleLike} disabled={liked}
            className={`btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 ${liked ? 'opacity-60 cursor-default' : ''}`}>
            <ThumbsUp size={14} className={liked ? 'fill-current' : ''} /> {showcase.likes} Likes
          </button>
          {showcase.zip_url && (
            <a href={showcase.zip_url} className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5">
              <Download size={14} /> Download ZIP
            </a>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card">
            <h3 className="font-display font-semibold text-lg text-white mb-3">About the Project</h3>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{showcase.description}</p>
          </div>

          <div className="glass-card">
            <h3 className="font-display font-semibold text-lg text-white mb-3">Key Features</h3>
            <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed list-disc list-inside">
              {showcase.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Meta & Links */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <div className="glass-card">
            <h3 className="font-display font-semibold text-sm text-white mb-3">Technology Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {showcase.tech_stack.map(t => (
                <span key={t} className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="glass-card space-y-3">
            <h3 className="font-display font-semibold text-sm text-white">Repository & Deployment</h3>
            {showcase.github_url && (
              <a href={showcase.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all text-xs text-slate-300">
                <span className="flex items-center gap-2"><Github size={14} /> GitHub Repository</span>
                <ExternalLink size={12} />
              </a>
            )}
            {showcase.deployment_url && (
              <a href={showcase.deployment_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all text-xs text-slate-300">
                <span className="flex items-center gap-2"><Globe size={14} /> Live Deployment</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
