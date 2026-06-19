import { useEffect, useState } from 'react';
import { projectApi } from '../../api/client';
import { FolderKanban, Plus, Trash2, Edit2, ExternalLink, Calendar, Code, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import type { Project } from '../../types';
import { formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();
  const { register: registerShowcase, handleSubmit: handleSubmitShowcase, reset: resetShowcase } = useForm();

  const loadProjects = () => {
    setLoading(true);
    projectApi.myProjects()
      .then(r => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    reset({
      title: '',
      description: '',
      tech_stack: '',
      domain: 'Web Development',
      github_url: '',
      tags: ''
    });
    setProjectModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    reset({
      title: p.title,
      description: p.description,
      tech_stack: p.tech_stack.join(', '),
      domain: p.domain || 'Web Development',
      github_url: p.github_url || '',
      tags: p.tags?.join(', ') || ''
    });
    setProjectModalOpen(true);
  };

  const onSubmitProject = async (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      tech_stack: data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean),
      domain: data.domain,
      github_url: data.github_url || null,
      tags: data.tags ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    };

    try {
      if (editingProject) {
        await projectApi.update(editingProject.id, payload);
        toast.success('Project updated!');
      } else {
        await projectApi.create(payload);
        toast.success('Project created!');
      }
      setProjectModalOpen(false);
      loadProjects();
    } catch {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectApi.delete(id);
      toast.success('Project deleted');
      loadProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const openShowcaseModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = projects.find(p => p.id === projectId);
    resetShowcase({
      description: proj?.description || '',
      features: '',
      github_url: proj?.github_url || '',
      deployment_url: '',
      demo_video_url: '',
      tech_stack: proj?.tech_stack.join(', ') || '',
      tags: proj?.tags?.join(', ') || ''
    });
    setShowcaseModalOpen(true);
  };

  const onSubmitShowcase = async (data: any) => {
    if (!selectedProjectId) return;
    const payload = {
      project_id: selectedProjectId,
      description: data.description,
      features: data.features.split('\n').map((s: string) => s.trim()).filter(Boolean),
      github_url: data.github_url || null,
      deployment_url: data.deployment_url || null,
      demo_video_url: data.demo_video_url || null,
      tech_stack: data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean),
      tags: data.tags ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    };

    try {
      await projectApi.createShowcase(selectedProjectId, payload);
      toast.success('Project Showcase published successfully!');
      setShowcaseModalOpen(false);
      loadProjects();
    } catch {
      toast.error('Failed to publish showcase. Check if already showcased.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <FolderKanban size={28} className="text-primary-400" /> My Projects
          </h1>
          <p className="text-slate-400 mt-1">Manage your academic projects, audit their quality, and publish showcases</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 py-2.5">
          <Plus size={16} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card text-center py-16">
          <FolderKanban size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">No projects added yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">Create a new project entry to start checking code quality, testing originality, and publishing to the showcase!</p>
          <button onClick={openAddModal} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="glass-card flex flex-col justify-between group h-full">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="badge-primary text-[10px]">{p.domain || 'Uncategorized'}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(p)} className="text-slate-400 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-primary-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">{p.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {p.tech_stack.map(t => (
                    <span key={t} className="badge bg-primary-500/10 text-primary-300 border border-primary-500/20 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-auto space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(p.created_at)}</span>
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-0.5">
                      Repo <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <Link to={`/quality-checker`} className="btn-secondary py-1.5 px-2 text-center text-[10px] rounded-lg flex items-center justify-center gap-1">
                    <Code size={11} /> Quality
                  </Link>
                  <button onClick={() => openShowcaseModal(p.id)} className="btn-primary py-1.5 px-2 text-center text-[10px] rounded-lg flex items-center justify-center gap-1">
                    <Sparkles size={11} /> Showcase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Add/Edit Modal */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-card w-full max-w-lg animate-slide-up relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setProjectModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <Plus size={20} className="rotate-45" />
            </button>
            <h2 className="font-display font-bold text-xl text-white mb-6">
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
            <form onSubmit={handleSubmit(onSubmitProject)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Project Title</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="e.g. Smart Traffic Management System" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Description (minimum 20 chars)</label>
                <textarea {...register('description', { required: true, minLength: 20 })} rows={4} className="input-field resize-none" placeholder="Provide a detailed description of the project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Domain</label>
                  <select {...register('domain')} className="input-field">
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Machine Learning / AI">Machine Learning / AI</option>
                    <option value="IoT / Embedded">IoT / Embedded</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">GitHub URL (Optional)</label>
                  <input {...register('github_url')} type="url" className="input-field" placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input {...register('tech_stack', { required: true })} className="input-field" placeholder="e.g. React, Node.js, MongoDB, Tailwind" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Tags (comma separated, optional)</label>
                <input {...register('tags')} className="input-field" placeholder="e.g. AI, Smart City, Hackathon" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setProjectModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-sm">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Showcase Publish Modal */}
      {showcaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-card w-full max-w-lg animate-slide-up relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowcaseModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <Plus size={20} className="rotate-45" />
            </button>
            <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-primary-400" /> Publish Project Showcase
            </h2>
            <form onSubmit={handleSubmitShowcase(onSubmitShowcase)} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Showcase Description</label>
                <textarea {...registerShowcase('description', { required: true })} rows={3} className="input-field resize-none" placeholder="Enter high-level marketing or overview text..." />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Key Features (One feature per line)</label>
                <textarea {...registerShowcase('features', { required: true })} rows={3} className="input-field resize-none" placeholder="Real-time face detection&#10;Integrated chat server&#10;Dark mode support" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Deployment URL (Optional)</label>
                  <input {...registerShowcase('deployment_url')} type="url" className="input-field" placeholder="https://myproject.vercel.app" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Demo Video URL (Optional)</label>
                  <input {...registerShowcase('demo_video_url')} type="url" className="input-field" placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Tech Stack (comma separated)</label>
                  <input {...registerShowcase('tech_stack', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Tags (comma separated)</label>
                  <input {...registerShowcase('tags')} className="input-field" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowcaseModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-sm">Publish Showcase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
