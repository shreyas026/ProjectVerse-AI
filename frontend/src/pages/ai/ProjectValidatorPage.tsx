import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { aiApi } from '../../api/client';
import { scoreColor } from '../../lib/utils';
import { Shield, AlertTriangle, ExternalLink, HelpCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ValidationResult } from '../../types';

export default function ProjectValidatorPage() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!techStack.includes(techInput.trim())) {
      setTechStack(prev => [...prev, techInput.trim()]);
    }
    setTechInput('');
  };

  const handleRemoveTech = (t: string) => {
    setTechStack(prev => prev.filter(item => item !== t));
  };

  const handleReset = () => {
    setResult(null);
    setTechStack([]);
    setTechInput('');
    reset();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await aiApi.validateProject({
        title: data.title,
        description: data.description,
        tech_stack: techStack
      });
      setResult(res.data);
      toast.success('Validation report generated!');
    } catch {
      toast.error('Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
          <Shield size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Project Intelligence Validator</h1>
          <p className="text-xs text-slate-400">Validate your project idea, discover similar projects, and receive improvements to avoid duplication</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="glass-card">
          <h3 className="font-display font-bold text-lg text-white mb-4">Validate New Project</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Project Title</label>
              <input {...register('title', { required: true })} className="input-field" placeholder="e.g. AI Attendance System" />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Tech Stack</label>
              <div className="flex gap-2">
                <input value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  className="input-field flex-1" placeholder="e.g. Python, OpenCV" />
                <button type="button" onClick={handleAddTech} className="btn-primary py-2 px-4">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {techStack.map(t => (
                  <span key={t} className="badge-primary flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => handleRemoveTech(t)} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Project Description (Abstract/Synopsis)</label>
              <textarea {...register('description', { required: true })} rows={6} className="input-field resize-none text-sm" placeholder="Provide a detailed description of the project, including features and architecture..." />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Validating project...' : 'Validate Project Idea'}
            </button>
          </form>
        </div>

        {/* Right: Validation Result */}
        <div className="glass-card flex flex-col justify-center min-h-[300px]">
          {!result ? (
            <div className="text-center py-12">
              <HelpCircle size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Submit your project idea on the left to see the AI validation and similarity report.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Originality Score</span>
                  <div className={`font-display text-4xl font-black ${scoreColor(result.originality_score)}`}>
                    {result.originality_score}%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Max Similarity</span>
                  <div className={`font-display text-4xl font-black ${result.similarity_score > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.similarity_score}%
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <AlertTriangle size={18} className={result.originality_score < 70 ? 'text-amber-400' : 'text-emerald-400'} />
                <div>
                  <h4 className="font-semibold text-white text-sm">AI Recommendation</h4>
                  <p className="text-xs text-slate-400 mt-1">{result.recommendation}</p>
                </div>
              </div>

              {/* Similar projects */}
              <div>
                <h4 className="font-display font-semibold text-sm text-white mb-3">Similar Projects ({result.similar_projects.length})</h4>
                <div className="space-y-2">
                  {result.similar_projects.length === 0 ? (
                    <p className="text-xs text-slate-500">No highly similar projects found in database.</p>
                  ) : (
                    result.similar_projects.map(p => (
                      <div key={p.project_id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{p.title}</p>
                          <p className="text-slate-500 mt-0.5">By {p.owner_name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-300">{p.similarity_score}% Match</span>
                          {p.showcase_id && (
                            <a href={`/showcases/${p.showcase_id}`} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 flex items-center gap-0.5">
                              Showcase <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button type="button" onClick={handleReset} className="btn-secondary w-full flex items-center justify-center gap-2 mt-4 py-2.5">
                <RefreshCw size={14} /> Validate Another Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
