import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Plus, Sparkles } from 'lucide-react';

const TECH_OPTIONS = ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'TensorFlow', 'PyTorch', 'Flutter', 'AWS', 'Docker', 'Go', 'Rust', 'Java', 'C++', 'PostgreSQL'];
const CATEGORIES = ['Web Dev', 'Mobile', 'AI/ML', 'IoT', 'Blockchain', 'Cloud', 'DevOps', 'Cybersecurity', 'Data Science'];

export function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState('');

  const addTech = (t: string) => {
    if (!selectedTech.includes(t)) setSelectedTech([...selectedTech, t]);
  };
  const removeTech = (t: string) => setSelectedTech(selectedTech.filter((s) => s !== t));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">Showcase your work to the campus community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Project Details</CardTitle>
          <CardDescription>Fill in the basic information about your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Project Title *</Label>
            <Input placeholder="e.g., Smart Agriculture IoT Platform" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Short Description *</Label>
            <Input placeholder="One-line description for cards" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label>Full Description *</Label>
            <Textarea placeholder="Detailed description of your project..." rows={5} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="in_progress">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Technology Stack */}
          <div className="space-y-3">
            <Label>Technology Stack</Label>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((t) => (
                <Badge key={t} variant={selectedTech.includes(t) ? 'default' : 'outline'} className="cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => addTech(t)}>
                  {t}
                </Badge>
              ))}
            </div>
            {selectedTech.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedTech.map((t) => (
                  <Badge key={t} className="gap-1 pr-1">
                    {t}
                    <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeTech(t)} />
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input placeholder="Add custom technology" value={customTech} onChange={(e) => setCustomTech(e.target.value)} className="flex-1" />
              <Button variant="outline" size="icon" onClick={() => { if (customTech) { addTech(customTech); setCustomTech(''); } }}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          <Separator />

          {/* Links */}
          <div className="space-y-4">
            <Label>Project Links</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">GitHub Repository</Label>
                <Input placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Live Demo</Label>
                <Input placeholder="https://..." />
              </div>
            </div>
          </div>

          <Separator />

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Project Media</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">Thumbnail</p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">Screenshots</p>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">Demo Video</p>
              </div>
            </div>
          </div>

          {/* AI Originality Check */}
          <div className="p-4 bg-primary/5 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">AI Originality Check</p>
              <p className="text-xs text-muted-foreground">We&apos;ll check your project for uniqueness using AI when you submit</p>
            </div>
            <Button variant="outline" size="sm">Learn More</Button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Save as Draft</Button>
            <Button>Publish Project</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
