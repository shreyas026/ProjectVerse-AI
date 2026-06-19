import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';
import { User, Save, Github, Linkedin, Globe, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { StudentProfile } from '../../types';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState<string>('programming_languages');

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    studentApi.getProfile().then(r => {
      setProfile(r.data);
      reset(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await studentApi.uploadAvatar(file);
      const url = res.data.avatar_url;
      setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      updateUser({ avatar_url: url });
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await studentApi.updateProfile(data);
      setProfile(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    if (!skillInput.trim() || !profile) return;
    const skills = { ...profile.skills };
    const cat = skillCategory as keyof typeof skills;
    if (!skills[cat].includes(skillInput.trim())) {
      skills[cat] = [...skills[cat], skillInput.trim()];
      setProfile({ ...profile, skills });
      setValue('skills', skills);
    }
    setSkillInput('');
  };

  const removeSkill = (cat: string, skill: string) => {
    if (!profile) return;
    const skills = { ...profile.skills };
    const c = cat as keyof typeof skills;
    skills[c] = skills[c].filter(s => s !== skill);
    setProfile({ ...profile, skills });
    setValue('skills', skills);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  const skillCategories = [
    { key: 'programming_languages', label: 'Languages', color: 'badge-primary' },
    { key: 'frameworks', label: 'Frameworks', color: 'badge-success' },
    { key: 'databases', label: 'Databases', color: 'badge-warning' },
    { key: 'ai_skills', label: 'AI / ML', color: 'badge-danger' },
    { key: 'other', label: 'Other', color: 'badge-primary' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3"><User size={28} className="text-primary-400" /> My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="glass-card flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-glow relative overflow-hidden">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-24 h-24 rounded-2xl object-cover" />
                : getInitials(profile?.name || user?.name || 'U')}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-primary-600 hover:bg-primary-500 p-2 rounded-xl text-white cursor-pointer shadow-lg transition-colors">
              <input type="file" onChange={handleAvatarChange} className="hidden" accept="image/*" />
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-white">{profile?.name}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className="badge-primary">{profile?.department || 'Department'}</span>
              <span className="badge-success">Year {profile?.year || 1}</span>
              <span className="badge-warning">{profile?.projects_created || 0} Projects</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="glass-card">
          <h3 className="font-display font-bold text-lg text-white mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Full Name</label>
              <input {...register('name')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">College</label>
              <input {...register('college')} className="input-field" placeholder="MIT, Stanford..." />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Department</label>
              <input {...register('department')} className="input-field" placeholder="Computer Science" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Year</label>
              <select {...register('year', { valueAsNumber: true })} className="input-field">
                {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">Bio</label>
              <textarea {...register('bio')} rows={3} className="input-field resize-none" placeholder="Tell us about yourself..." />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card">
          <h3 className="font-display font-bold text-lg text-white mb-4">Skills</h3>
          <div className="flex gap-2 mb-4">
            <select value={skillCategory} onChange={e => setSkillCategory(e.target.value)} className="input-field w-40">
              {skillCategories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="input-field flex-1" placeholder="Type a skill and press Enter" />
            <button type="button" onClick={addSkill} className="btn-primary px-4"><Plus size={16} /></button>
          </div>
          {skillCategories.map(cat => {
            const skills = profile?.skills?.[cat.key as keyof typeof profile.skills] || [];
            if (skills.length === 0) return null;
            return (
              <div key={cat.key} className="mb-3">
                <p className="text-xs text-slate-400 mb-1.5 font-medium">{cat.label}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string) => (
                    <span key={s} className={`${cat.color} flex items-center gap-1`}>
                      {s}
                      <button type="button" onClick={() => removeSkill(cat.key, s)} className="hover:text-white"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Links */}
        <div className="glass-card">
          <h3 className="font-display font-bold text-lg text-white mb-4">Social Links</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Github size={18} className="text-slate-400 flex-shrink-0" />
              <input {...register('links.github')} className="input-field" placeholder="https://github.com/username" />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin size={18} className="text-slate-400 flex-shrink-0" />
              <input {...register('links.linkedin')} className="input-field" placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-slate-400 flex-shrink-0" />
              <input {...register('links.portfolio')} className="input-field" placeholder="https://yourportfolio.com" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
