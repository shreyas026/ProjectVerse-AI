import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { ShieldAlert, Users, FolderKanban, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PlatformStats } from '../../types';

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ProjectItem {
  id: string;
  title: string;
  owner_name: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      adminApi.getStats(),
      adminApi.listUsers(),
      adminApi.listProjects()
    ]).then(([s, u, p]) => {
      setStats(s.data);
      setUsers(u.data);
      setProjects(p.data);
    }).catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also remove their student profile.')) return;
    try {
      await adminApi.deleteUser(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to remove this project from the database?')) return;
    try {
      await adminApi.deleteProject(projectId);
      toast.success('Project moderated and deleted');
      loadData();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
          <ShieldAlert size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Administrative Portal</h1>
          <p className="text-xs text-slate-400">Moderate platform users, evaluate student projects, and review database records</p>
        </div>
      </div>

      {/* Grid stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrations', val: stats?.total_users ?? 0, icon: Users },
          { label: 'Student Accounts', val: stats?.total_students ?? 0, icon: Users },
          { label: 'Faculty Evaluators', val: stats?.total_faculty ?? 0, icon: Users },
          { label: 'Projects Registered', val: stats?.total_projects ?? 0, icon: FolderKanban },
        ].map(card => (
          <div key={card.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{card.label}</span>
              <card.icon size={16} className="text-primary-400" />
            </div>
            <div className="font-display text-3xl font-black text-white">{card.val}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Moderation */}
        <div className="glass-card">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Moderate Users</h3>
          <div className="overflow-y-auto max-h-80 space-y-2 pr-1 text-xs">
            {users.map(u => (
              <div key={u.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{u.name}</p>
                  <p className="text-slate-500 mt-0.5">{u.email} · <span className="capitalize text-primary-400">{u.role}</span></p>
                </div>
                <button onClick={() => handleDeleteUser(u.id)} className="text-slate-500 hover:text-red-400 p-1.5 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Project Moderation */}
        <div className="glass-card">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Moderate Projects</h3>
          <div className="overflow-y-auto max-h-80 space-y-2 pr-1 text-xs">
            {projects.map(p => (
              <div key={p.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{p.title}</p>
                  <p className="text-slate-500 mt-0.5">By {p.owner_name}</p>
                </div>
                <button onClick={() => handleDeleteProject(p.id)} className="text-slate-500 hover:text-red-400 p-1.5 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
