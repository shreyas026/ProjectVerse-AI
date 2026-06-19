import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { teamApi } from '../../api/client';
import { Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Team } from '../../types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const loadTeams = () => {
    teamApi.list()
      .then(r => setTeams(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(prev => prev.filter(item => item !== s));
  };

  const onSubmit = async (data: any) => {
    try {
      await teamApi.create({
        project_id: data.project_id || "placeholder_project",
        name: data.name,
        description: data.description,
        required_skills: skills,
        max_members: Number(data.max_members),
        domain: data.domain,
      });
      toast.success('Team created successfully!');
      setModalOpen(false);
      reset();
      setSkills([]);
      loadTeams();
    } catch {
      toast.error('Failed to create team');
    }
  };

  const handleApply = async (id: string) => {
    const msg = prompt('Enter a short application message outlining your skills:');
    if (msg === null) return;
    try {
      await teamApi.apply(id, msg);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Application failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users size={28} className="text-primary-400" /> Collaboration Hub
          </h1>
          <p className="text-slate-400 mt-1">Discover teams looking for members, or build your own team</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 py-2">
          <Plus size={16} /> Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Users size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">No active teams</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">Create a team workspace and recruit developers, designers, and AI students!</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Create Team
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(t => (
            <div key={t.id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-primary">{t.domain || 'General'}</span>
                  <span className="badge bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    {t.members.length}/{t.max_members} Members
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1 line-clamp-1">{t.name}</h3>
                <p className="text-slate-400 text-xs mb-3">Owned by {t.owner_name}</p>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{t.description}</p>
                
                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {t.required_skills.map(s => (
                      <span key={s} className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-auto flex gap-2">
                <button onClick={() => handleApply(t.id)} className="btn-primary py-2 text-xs flex-1 text-center font-bold">
                  Apply to Join
                </button>
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
            <h2 className="font-display font-bold text-xl text-white mb-6">Create Team Workspace</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Team Name</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="e.g. Next-Gen AI Devs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Domain / Category</label>
                  <input {...register('domain', { required: true })} className="input-field" placeholder="e.g. Machine Learning" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Max Teammates</label>
                  <input {...register('max_members', { required: true })} type="number" className="input-field" placeholder="e.g. 4" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Required Skills</label>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="input-field flex-1" placeholder="e.g. React, PyTorch" />
                  <button type="button" onClick={handleAddSkill} className="btn-primary py-2 px-4">+</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {skills.map(s => (
                    <span key={s} className="badge-primary flex items-center gap-1">
                      {s}
                      <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Workspace Description</label>
                <textarea {...register('description', { required: true })} rows={3} className="input-field resize-none" placeholder="Describe what your team will work on..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-sm">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
