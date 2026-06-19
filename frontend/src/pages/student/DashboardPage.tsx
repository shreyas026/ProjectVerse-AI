import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { studentApi, projectApi, teamApi } from '../../api/client';
import { scoreColor, formatDate } from '../../lib/utils';
import { Trophy, FolderKanban, Users, Bot, Shield, FileCheck, TrendingUp, Star, ArrowRight, Plus, Zap, Target, Code2, Lightbulb } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ImpactScore, Project, Team } from '../../types';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [scores, setScores] = useState<ImpactScore | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([studentApi.getScores(), projectApi.myProjects(), teamApi.myTeams()])
      .then(([s, p, t]) => { setScores(s.data); setProjects(p.data.slice(0, 3)); setTeams(t.data.slice(0, 2)); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const radarData = scores ? [
    { subject: 'Technical', value: scores.technical_score },
    { subject: 'Innovation', value: scores.innovation_score },
    { subject: 'Achievement', value: scores.achievement_score },
    { subject: 'Contribution', value: scores.contribution_score },
    { subject: 'Teamwork', value: scores.teamwork_score },
  ] : [];

  const quickActions = [
    { to: '/validate', icon: Shield, label: 'Validate Project', color: 'from-blue-500 to-indigo-600' },
    { to: '/edu-ai', icon: Bot, label: 'Ask Edu AI', color: 'from-violet-500 to-purple-600' },
    { to: '/quality-checker', icon: FileCheck, label: 'Check Quality', color: 'from-emerald-500 to-teal-600' },
    { to: '/teams', icon: Users, label: 'Find Team', color: 'from-orange-500 to-amber-600' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Good morning, <span className="text-gradient">{user?.name?.split(' ')[0]} 👋</span></h1>
          <p className="text-slate-400 mt-1">Here's your innovation overview</p>
        </div>
        <Link to="/projects/new" className="btn-primary flex items-center gap-2 self-start"><Plus size={16} /> New Project</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Impact Score', value: scores?.overall_score ?? 0, icon: Target },
          { label: 'Technical', value: scores?.technical_score ?? 0, icon: Code2 },
          { label: 'Innovation', value: scores?.innovation_score ?? 0, icon: Lightbulb },
          { label: 'Achievement', value: scores?.achievement_score ?? 0, icon: Trophy },
        ].map(card => (
          <div key={card.label} className="score-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{card.label}</span>
              <card.icon size={16} className="text-primary-400" />
            </div>
            <div className={`font-display text-4xl font-black ${scoreColor(card.value)}`}>{Math.round(card.value)}</div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-3">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700" style={{ width: `${card.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-primary-400" /> Skill Radar</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center gap-3">
              <Star size={32} className="text-slate-600" />
              <p className="text-slate-500 text-sm text-center">Complete achievements to generate your skill radar</p>
              <Link to="/achievements" className="btn-primary text-sm py-2 px-4">Add Achievement</Link>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2"><Zap size={18} className="text-primary-400" /> Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(a => (
              <Link key={a.to} to={a.to} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/40 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm`}>
                  <a.icon size={18} className="text-white" />
                </div>
                <span className="text-xs text-slate-300 font-medium text-center">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2"><Users size={18} className="text-primary-400" /> My Teams</h2>
            <Link to="/teams" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <Users size={28} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm mb-3">No teams yet</p>
                <Link to="/teams" className="btn-primary text-sm py-2 px-4">Find Team</Link>
              </div>
            ) : teams.map(t => (
              <Link key={t.id} to={`/teams/${t.id}/workspace`} className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white text-sm">{t.name}</span>
                  <span className="badge-primary text-xs">{t.members.length}/{t.max_members}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.required_skills.slice(0, 3).join(' · ')}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2"><FolderKanban size={20} className="text-primary-400" /> Recent Projects</h2>
          <Link to="/projects" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">All projects <ArrowRight size={14} /></Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No projects yet. Start building something amazing!</p>
            <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2"><Plus size={16} /> Create First Project</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors line-clamp-1">{p.title}</h3>
                  <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-primary'} text-xs ml-2 flex-shrink-0`}>{p.status}</span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tech_stack.slice(0, 3).map(t => <span key={t} className="badge-primary text-xs">{t}</span>)}
                </div>
                <p className="text-slate-500 text-xs mt-2">{formatDate(p.created_at)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
