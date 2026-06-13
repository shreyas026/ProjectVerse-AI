import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockTasks, mockProjects } from '@/services/mockData';
import {
  Kanban, StickyNote, FolderOpen, Plus, GripVertical,
  CheckCircle2, Circle, Clock, AlertCircle, Pencil, Trash2, FileText
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-500', icon: Circle },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  { id: 'review', label: 'Review', color: 'bg-amber-500', icon: AlertCircle },
  { id: 'done', label: 'Done', color: 'bg-emerald-500', icon: CheckCircle2 },
];

const PRIORITY_COLORS = {
  low: 'bg-slate-500/10 text-slate-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-amber-500/10 text-amber-500',
  urgent: 'bg-red-500/10 text-red-500',
};

export function WorkspacePage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [activeTab, setActiveTab] = useState('board');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((t) => t._id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      _id: Date.now().toString(), projectId: '1', title: newTaskTitle,
      description: '', status: 'todo' as const, priority: 'medium' as const,
      createdBy: mockProjects[0].owner, tags: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Kanban className="w-6 h-6 text-primary" /> Project Workspace</h1>
          <p className="text-muted-foreground">Smart Agriculture IoT Platform</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddTask(true)}><Plus className="w-4 h-4" /> Add Task</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board" className="gap-2"><Kanban className="w-4 h-4" /> Board</TabsTrigger>
          <TabsTrigger value="notes" className="gap-2"><StickyNote className="w-4 h-4" /> Notes</TabsTrigger>
          <TabsTrigger value="files" className="gap-2"><FolderOpen className="w-4 h-4" /> Files</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          {/* Add Task Input */}
          {showAddTask && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input placeholder="Task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} autoFocus />
                  <Button onClick={addTask}>Add</Button>
                  <Button variant="ghost" onClick={() => setShowAddTask(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <col.icon className={`w-4 h-4 ${col.color.replace('bg-', 'text-')}`} />
                    <h3 className="font-semibold text-sm">{col.label}</h3>
                    <Badge variant="secondary" className="text-[10px]">{colTasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <Card key={task._id} className="cursor-grab hover:shadow-md transition-all group">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{task.title}</p>
                              {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>}
                              <div className="flex items-center justify-between mt-2">
                                <Badge className={`${PRIORITY_COLORS[task.priority]} text-[10px] capitalize`}>{task.priority}</Badge>
                                {task.assignee && (
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assignee.avatar} />
                                    <AvatarFallback className="text-[10px]">{task.assignee.firstName?.[0]}</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              {task.dueDate && (
                                <p className="text-[10px] text-muted-foreground mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                              )}
                              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
                                  <Button key={c.id} variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => moveTask(task._id, c.id)}>Move to {c.label}</Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Project Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Write your project notes here... Use this space for meeting minutes, ideas, documentation..." rows={12} className="resize-none" />
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="outline">Clear</Button>
                <Button className="gap-2"><Pencil className="w-4 h-4" /> Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Project Files</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['Architecture.pdf', 'API_Docs.md', 'Design.fig', 'Database_Schema.png', 'Pitch_Deck.pptx', 'Requirements.docx'].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-accent transition-colors cursor-pointer">
                    <FileText className="w-10 h-10 text-primary" />
                    <p className="text-xs text-center font-medium truncate w-full">{f}</p>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed hover:bg-accent transition-colors cursor-pointer">
                  <Plus className="w-10 h-10 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Upload</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
