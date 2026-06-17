import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { projectService } from '@/services/project.service';
import { Heart, Bookmark, Eye, GitBranch, ExternalLink, Users, FileText, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import type { Project } from '@/types';

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error('Error loading project details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleLike = async () => {
    if (!id || !project) return;
    try {
      const res = await projectService.likeProject(id);
      if (res) {
        const currentUserId = '1';
        setProject(prev => {
          if (!prev) return null;
          const newLikes = [...prev.likes];
          const idx = newLikes.indexOf(currentUserId);
          if (res.liked) {
            if (idx === -1) newLikes.push(currentUserId);
          } else {
            if (idx > -1) newLikes.splice(idx, 1);
          }
          return { ...prev, likes: newLikes };
        });
      }
    } catch (err) {
      console.error('Error liking project:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-destructive">Project Not Found</h2>
        <p className="text-muted-foreground mt-2">The project you are looking for does not exist or has been deleted.</p>
        <Button className="mt-4" onClick={() => navigate('/projects')}>Back to Showcase</Button>
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero */}
      {project.thumbnail && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="mb-3">{project.category}</Badge>
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <p className="text-white/80 mt-2">{project.shortDescription}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={project.owner?.avatar} />
            <AvatarFallback>{project.owner?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{project.owner?.firstName} {project.owner?.lastName}</p>
            <p className="text-xs text-muted-foreground">{project.owner?.college?.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleLike}><Heart className="w-4 h-4" /> {project.likes.length}</Button>
          <Button type="button" variant="outline" size="sm" className="gap-2"><Bookmark className="w-4 h-4" /> Save</Button>
          {project.githubUrl && <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => window.open(project.githubUrl, '_blank')}><GitBranch className="w-4 h-4" /> Code</Button>}
          {project.liveUrl && <Button type="button" size="sm" className="gap-2" onClick={() => window.open(project.liveUrl, '_blank')}><ExternalLink className="w-4 h-4" /> Live Demo</Button>}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2"><FileText className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="team" className="gap-2"><Users className="w-4 h-4" /> Team</TabsTrigger>
          <TabsTrigger value="tech" className="gap-2"><CheckCircle className="w-4 h-4" /> Tech Stack</TabsTrigger>
          <TabsTrigger value="comments" className="gap-2"><MessageSquare className="w-4 h-4" /> Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>About this Project</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              {project.originalityScore && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                  <p className="text-sm font-medium">Originality Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all" style={{ width: `${project.originalityScore}%` }} />
                    </div>
                    <span className="text-sm font-bold">{project.originalityScore}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {project.team.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
                  <Avatar><AvatarImage src={m.userId?.avatar} /><AvatarFallback>{m.userId?.firstName?.[0]}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{m.userId?.firstName} {m.userId?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                  <Badge variant="secondary">{m.contribution}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Technologies Used</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <Badge key={t} className="px-3 py-1.5 text-sm">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Discussion</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
