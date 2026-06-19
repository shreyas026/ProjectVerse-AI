import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { teamApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { formatRelative } from '../../lib/utils';
import { Users, Send, CheckSquare, MessageSquare, BarChart2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Team, Task, Message, ContributionReport } from '../../types';

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contributions, setContributions] = useState<ContributionReport[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'stats'>('board');
  const [chatInput, setChatInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const loadWorkspaceData = () => {
    if (!id) return;
    Promise.all([
      teamApi.get(id),
      teamApi.getTasks(id),
      teamApi.getMessages(id),
      teamApi.getContributions(id)
    ]).then(([t, tk, msg, c]) => {
      setTeam(t.data);
      setTasks(tk.data);
      setMessages(msg.data);
      setContributions(c.data.contributions);
    }).catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWorkspaceData();

    // WebSocket connection
    const wsUrl = `ws://localhost:8000/teams/${id}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
      // Reload contributions on incoming messages
      if (id) {
        teamApi.getContributions(id).then(c => setContributions(c.data.contributions)).catch(() => {});
      }
    };

    return () => {
      ws.close();
    };
  }, [id]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !wsRef.current || !user) return;
    const payload = {
      sender_id: user.id,
      sender_name: user.name,
      content: chatInput.trim(),
      message_type: 'text'
    };
    wsRef.current.send(JSON.stringify(payload));
    setChatInput('');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || !id) return;
    try {
      const res = await teamApi.createTask(id, {
        team_id: id,
        title: taskInput.trim(),
        priority: 'medium'
      });
      setTasks(prev => [...prev, res.data]);
      setTaskInput('');
      toast.success('Task added!');
      // Reload contributions
      teamApi.getContributions(id).then(c => setContributions(c.data.contributions)).catch(() => {});
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    if (!id) return;
    try {
      await teamApi.updateTaskStatus(id, taskId, status);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status as any } : t));
      toast.success('Task updated!');
      // Reload contributions
      teamApi.getContributions(id).then(c => setContributions(c.data.contributions)).catch(() => {});
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return;
    try {
      await teamApi.deleteTask(id, taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
      // Reload contributions
      teamApi.getContributions(id).then(c => setContributions(c.data.contributions)).catch(() => {});
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users size={28} className="text-primary-400" /> {team?.name}
          </h1>
          <p className="text-slate-400 mt-1">Team Workspace & Task Tracker</p>
        </div>

        {/* Tab menu */}
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button onClick={() => setActiveTab('board')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'board' ? 'bg-primary-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'}`}>
            <CheckSquare size={14} /> Task Board
          </button>
          <button onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-primary-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'}`}>
            <MessageSquare size={14} /> Team Chat
          </button>
          <button onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'stats' ? 'bg-primary-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-white'}`}>
            <BarChart2 size={14} /> Contributions
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {activeTab === 'board' && (
        <div className="space-y-6">
          {/* Quick task add form */}
          <form onSubmit={handleCreateTask} className="flex gap-2 max-w-md">
            <input value={taskInput} onChange={e => setTaskInput(e.target.value)}
              className="input-field py-2 text-xs" placeholder="Create new action item..." />
            <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1">
              <Plus size={14} /> Add
            </button>
          </form>

          {/* Grid columns */}
          <div className="grid md:grid-cols-3 gap-6">
            {(['todo', 'in_progress', 'completed'] as const).map(col => {
              const colTasks = tasks.filter(t => t.status === col);
              return (
                <div key={col} className="kanban-column">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <h3 className="font-semibold text-sm capitalize text-slate-300">
                      {col === 'in_progress' ? 'In Progress' : col}
                    </h3>
                    <span className="badge bg-white/5 border border-white/10 text-slate-400 text-xs font-bold">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto max-h-96 pr-1">
                    {colTasks.map(t => (
                      <div key={t.id} className="task-card">
                        <div className="flex items-start justify-between">
                          <p className="text-xs text-white leading-relaxed">{t.title}</p>
                          <button onClick={() => handleDeleteTask(t.id)} className="text-slate-500 hover:text-red-400">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">{t.priority}</span>
                          <div className="flex gap-1.5">
                            {col !== 'todo' && (
                              <button onClick={() => handleUpdateTaskStatus(t.id, col === 'completed' ? 'in_progress' : 'todo')}
                                className="text-[10px] text-primary-400 hover:underline">
                                Prev
                              </button>
                            )}
                            {col !== 'completed' && (
                              <button onClick={() => handleUpdateTaskStatus(t.id, col === 'todo' ? 'in_progress' : 'completed')}
                                className="text-[10px] text-primary-400 hover:underline font-bold">
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Chat */}
      {activeTab === 'chat' && (
        <div className="glass-card flex flex-col h-[400px] overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${m.sender_id === user?.id ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                  {m.sender_id !== user?.id && <span className="block font-bold text-[10px] text-primary-300 mb-1">{m.sender_name}</span>}
                  <p>{m.content}</p>
                  <span className="block text-[8px] text-slate-400 mt-1.5 text-right">{formatRelative(m.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={chatScrollRef} />
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              className="input-field py-2 text-xs" placeholder="Message team workspace..." />
            <button type="submit" className="btn-primary p-2.5 rounded-xl flex items-center justify-center">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Contributions stats */}
      {activeTab === 'stats' && (
        <div className="glass-card space-y-6">
          <h3 className="font-display font-semibold text-lg text-white">Teammate Contribution Breakdown</h3>
          <div className="space-y-4">
            {contributions.map(c => (
              <div key={c.member_id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{c.member_name}</span>
                  <span className="text-primary-400">{c.contribution_percentage}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    style={{ width: `${c.contribution_percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
