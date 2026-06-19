import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { facultyApi } from '../../api/client';
import { Users, BarChart3, FolderKanban, GraduationCap, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../lib/utils';

interface StudentProfile {
  id: string;
  name: string;
  department: string;
  year: number;
  projects_created: number;
  bio?: string;
  skills?: any;
}

interface Project {
  id: string;
  title: string;
  owner_name: string;
  tech_stack: string[];
  domain?: string;
  status: string;
  quality_score?: number;
  originality_score?: number;
  created_at: string;
}

export default function FacultyDashboardPage() {
  const location = useLocation();
  const path = location.pathname;

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [analysisReport, setAnalysisReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    Promise.all([
      facultyApi.getStudents(),
      facultyApi.listProjects()
    ]).then(([s, p]) => {
      setStudents(s.data);
      setProjects(p.data);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyzeClass = async () => {
    if (projects.length === 0) {
      toast.error('No projects to analyze');
      return;
    }
    setAnalyzing(true);
    try {
      const pids = projects.map(p => p.id);
      const res = await facultyApi.analyzeClass(pids);
      setAnalysisReport(res.data.report);
      toast.success('Bulk project duplicate analysis complete!');
    } catch {
      toast.error('Failed to run bulk analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Render Sub-Views based on current pathname
  const renderContent = () => {
    switch (path) {
      case '/faculty/projects':
        return (
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white">Class Projects</h3>
              <span className="badge-primary">{projects.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-3 px-2">Project Title</th>
                    <th className="py-3 px-2">Student Owner</th>
                    <th className="py-3 px-2">Domain</th>
                    <th className="py-3 px-2">Tech Stack</th>
                    <th className="py-3 px-2 text-center">Quality</th>
                    <th className="py-3 px-2 text-center">Originality</th>
                    <th className="py-3 px-2">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-2 font-semibold text-white">{p.title}</td>
                      <td className="py-3.5 px-2 text-slate-200">{p.owner_name}</td>
                      <td className="py-3.5 px-2 text-slate-400">{p.domain || 'N/A'}</td>
                      <td className="py-3.5 px-2">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {p.tech_stack.slice(0, 3).map(t => (
                            <span key={t} className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 text-[10px]">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold">
                        {p.quality_score ? (
                          <span className={`badge ${p.quality_score >= 80 ? 'badge-success' : p.quality_score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                            {p.quality_score}%
                          </span>
                        ) : '--'}
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold">
                        {p.originality_score ? (
                          <span className={`badge ${p.originality_score >= 80 ? 'badge-success' : p.originality_score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                            {p.originality_score}%
                          </span>
                        ) : '--'}
                      </td>
                      <td className="py-3.5 px-2 text-slate-400">{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '/faculty/students':
        return (
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white">Class Roster</h3>
              <span className="badge-primary">{students.length} Students</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-3 px-2">Student Name</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2 text-center">Year</th>
                    <th className="py-3 px-2 text-center">Projects Uploaded</th>
                    <th className="py-3 px-2">Bio / Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-2 font-semibold text-white">{s.name}</td>
                      <td className="py-3.5 px-2">{s.department || 'Computer Science'}</td>
                      <td className="py-3.5 px-2 text-center font-bold">{s.year}</td>
                      <td className="py-3.5 px-2 text-center">
                        <span className="badge bg-white/10 text-white font-medium">{s.projects_created}</span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-400 truncate max-w-xs">{s.bio || 'No bio entered yet.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case '/faculty/analyze':
        return (
          <div className="space-y-6">
            <div className="glass-card space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Class Similarity & Originality Report</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Run bulk AI semantic audits on all class submissions to flag duplicates</p>
                </div>
                <button onClick={handleAnalyzeClass} disabled={analyzing} className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 self-start">
                  <BarChart3 size={14} /> {analyzing ? 'Analyzing...' : 'Analyze Projects'}
                </button>
              </div>

              {analysisReport.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <ShieldAlert size={36} className="text-slate-500 mx-auto mb-3 animate-bounce" />
                  <p className="text-slate-400 text-sm">No analysis reports run yet. Click "Analyze Projects" to start audit.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="py-2.5">Student</th>
                        <th className="py-2.5">Project Name</th>
                        <th className="py-2.5 text-center">Similarity Score</th>
                        <th className="py-2.5 text-center">Duplicate Status</th>
                        <th className="py-2.5">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {analysisReport.map((rep, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-medium text-white">{rep.owner_name}</td>
                          <td className="py-3">{rep.project_title}</td>
                          <td className="py-3 text-center font-bold text-slate-100">{rep.similarity_score}%</td>
                          <td className="py-3 text-center">
                            <span className={`badge ${rep.duplicate_status === 'Duplicate' ? 'badge-danger' : rep.duplicate_status === 'Very Similar' ? 'badge-warning' : 'badge-success'}`}>
                              {rep.duplicate_status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400">{rep.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case '/faculty/dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Grid count cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Total Students</span>
                  <div className="font-display text-3xl font-black text-white">{students.length}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <GraduationCap size={20} />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Active Projects</span>
                  <div className="font-display text-3xl font-black text-white">{projects.length}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <FolderKanban size={20} />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Audits Pending</span>
                  <div className="font-display text-3xl font-black text-white">
                    {projects.filter(p => !p.originality_score).length}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <ShieldAlert size={20} />
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="glass-card">
              <h3 className="font-display font-semibold text-lg text-white mb-4">Recent Project Submissions</h3>
              <div className="space-y-3">
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-500/30 transition-all">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">By {p.owner_name} · {formatDate(p.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge-primary">{p.domain || 'General'}</span>
                      <Link to="/faculty/projects" className="text-xs text-primary-400 hover:text-primary-300 font-medium">Verify</Link>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-6">No projects submitted yet.</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users size={28} className="text-primary-400" /> Faculty Portal
          </h1>
          <p className="text-slate-400 mt-1">
            {path === '/faculty/projects' ? 'Browse all submitted projects in the catalog'
              : path === '/faculty/students' ? 'Manage your classroom roster and profiles'
              : path === '/faculty/analyze' ? 'Run AI semantic originality audits'
              : 'Monitor class profiles, evaluate projects, and audit metrics'}
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto">
        {[
          { to: '/faculty/dashboard', label: 'Dashboard', icon: Users },
          { to: '/faculty/projects', label: 'Projects', icon: FolderKanban },
          { to: '/faculty/students', label: 'Students', icon: GraduationCap },
          { to: '/faculty/analyze', label: 'Class Analyzer', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const active = path === tab.to || (tab.to === '/faculty/dashboard' && path === '/faculty/dashboard');
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium transition-all ${active ? 'border-primary-500 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Dynamic Sub-view */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}
