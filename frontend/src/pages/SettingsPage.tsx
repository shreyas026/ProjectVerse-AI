import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { studentApi, facultyApi } from '../api/client';
import { Settings, Sun, Moon, Shield, Save, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Fetch appropriate profile based on role
    if (user?.role === 'student') {
      studentApi.getProfile()
        .then(r => reset(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (user?.role === 'faculty') {
      facultyApi.getProfile()
        .then(r => reset(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const onSubmitProfile = async (data: any) => {
    setSaving(true);
    try {
      if (user?.role === 'student') {
        const res = await studentApi.updateProfile(data);
        updateUser({ name: res.data.name });
      } else if (user?.role === 'faculty') {
        const res = await facultyApi.updateProfile(data);
        updateUser({ name: res.data.name });
      }
      toast.success('Profile settings saved!');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
          <Settings size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-xs text-slate-400">Manage your profile, login settings, and portal interface preferences</p>
        </div>
      </div>

      {/* Theme Preference Settings */}
      <div className="glass-card">
        <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Sun size={18} className="text-primary-400" /> Interface Theme
        </h3>
        <p className="text-xs text-slate-400 mb-4">Choose how ProjectVerse AI looks on your screen. Dark theme is active by default.</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Moon size={24} />
            <div className="text-xs font-semibold">Dark Mode (Default)</div>
          </button>
          <button
            onClick={() => toggleTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Sun size={24} />
            <div className="text-xs font-semibold">Light Mode</div>
          </button>
        </div>
      </div>

      {/* Profile Info Settings Form */}
      {(user?.role === 'student' || user?.role === 'faculty') && (
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
          <div className="glass-card">
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-primary-400" /> General Profile Settings
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Full Name</label>
                <input {...register('name', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">College/Institution</label>
                <input {...register('college', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Department</label>
                <input {...register('department', { required: true })} className="input-field" />
              </div>
              {user.role === 'student' ? (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Academic Year</label>
                  <select {...register('year', { valueAsNumber: true })} className="input-field">
                    {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Designation</label>
                  <input {...register('designation', { required: true })} className="input-field" placeholder="e.g. Associate Professor" />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-300 mb-1">Bio</label>
                <textarea {...register('bio')} rows={3} className="input-field resize-none" placeholder="Tell us about yourself..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Password and Security */}
      <div className="glass-card">
        <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary-400" /> Password & Security
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Current Password</label>
              <input type="password" disabled className="input-field opacity-60" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">New Password</label>
              <input type="password" disabled className="input-field opacity-60" placeholder="••••••••" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Note: Security changes are locked to local verification in demo mode.</p>
        </div>
      </div>
    </div>
  );
}
