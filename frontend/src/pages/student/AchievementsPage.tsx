import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentApi, aiApi } from '../../api/client';
import { formatDate } from '../../lib/utils';
import { Trophy, Plus, Trash2, Calendar, Award, ExternalLink, Sparkles, FileText, Upload, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Achievement } from '../../types';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadAchievements = () => {
    studentApi.getAchievements()
      .then(r => setAchievements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await studentApi.createAchievement({
        ...data,
        date: new Date(data.date).toISOString()
      });
      toast.success('Achievement added!');
      setModalOpen(false);
      reset();
      loadAchievements();
    } catch {
      toast.error('Failed to create achievement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await studentApi.deleteAchievement(id);
      toast.success('Achievement deleted');
      loadAchievements();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleFileUpload = async (achievementId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      await studentApi.uploadAchievementFile(achievementId, file, type);
      toast.success('Certificate file uploaded successfully!');
      loadAchievements();
    } catch {
      toast.error('Failed to upload file');
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await aiApi.analyzeAchievements();
      toast.success('Achievements analyzed by AI! Scorecards updated.');
    } catch {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Trophy size={28} className="text-primary-400" /> Achievements & Certifications
          </h1>
          <p className="text-slate-400 mt-1">Showcase your hackathons, open source contributions, and certificates</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAnalyze} disabled={analyzing || achievements.length === 0}
            className="btn-secondary flex items-center gap-2 py-2 disabled:opacity-50">
            <Sparkles size={16} />
            {analyzing ? 'Analyzing...' : 'AI Analyze'}
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 py-2">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Trophy size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">No achievements added yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">Upload certificates or awards to build your student innovation impact scores!</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add Your First Achievement
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(a => (
            <div key={a.id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="badge-primary capitalize">{a.achievement_type.replace('_', ' ')}</div>
                  <button onClick={() => handleDelete(a.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                {a.image_url && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 mb-3">
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-display font-bold text-lg text-white mb-1 line-clamp-1">{a.title}</h3>
                <p className="text-slate-400 text-sm mb-3 font-medium flex items-center gap-1.5">
                  <Award size={14} className="text-primary-400" /> {a.organization}
                </p>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{a.description}</p>
              </div>

              {/* Upload Proof and display links */}
              <div className="mt-3 py-2 px-3 bg-white/5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Verification Proof</span>
                <div className="flex items-center gap-2">
                  {a.pdf_url && (
                    <a href={a.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 flex items-center gap-0.5 text-xs font-semibold">
                      <FileText size={12} /> PDF
                    </a>
                  )}
                  {a.image_url && (
                    <a href={a.image_url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 flex items-center gap-0.5 text-xs font-semibold">
                      <Image size={12} /> IMG
                    </a>
                  )}
                  <label className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-0.5 text-xs font-semibold">
                    <Upload size={12} />
                    <input type="file" onChange={(e) => handleFileUpload(a.id, e)} className="hidden" accept="image/*,application/pdf" />
                    Upload
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(a.date)}
                </span>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-card w-full max-w-lg animate-slide-up relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <Plus size={20} className="rotate-45" />
            </button>
            <h2 className="font-display font-bold text-xl text-white mb-6">Add Achievement</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Title</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="e.g. Smart India Hackathon Winner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Organization</label>
                  <input {...register('organization', { required: true })} className="input-field" placeholder="e.g. Ministry of Education" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Type</label>
                  <select {...register('achievement_type')} className="input-field">
                    <option value="hackathon">Hackathon Win</option>
                    <option value="certification">Certification</option>
                    <option value="internship">Internship</option>
                    <option value="research_paper">Research Paper</option>
                    <option value="workshop">Workshop</option>
                    <option value="open_source">Open Source</option>
                    <option value="competition">Competition Result</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Date</label>
                  <input {...register('date', { required: true })} type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Url (Optional)</label>
                  <input {...register('url')} type="url" className="input-field" placeholder="e.g. Certificate URL" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Description</label>
                <textarea {...register('description', { required: true })} rows={3} className="input-field resize-none" placeholder="Describe your achievement..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-sm">Add Achievement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
