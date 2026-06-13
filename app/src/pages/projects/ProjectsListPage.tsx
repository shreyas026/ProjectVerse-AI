import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects } from '@/services/mockData';
import { Search, Filter, Grid3X3, List, Heart, Bookmark, Eye, GitBranch, ExternalLink } from 'lucide-react';

const categories = ['All', 'Web Dev', 'Mobile', 'AI/ML', 'IoT', 'Blockchain', 'Cloud', 'DevOps'];

export function ProjectsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = mockProjects.filter((p) => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Project Showcase</h1>
          <p className="text-muted-foreground">Discover amazing projects from students across campus</p>
        </div>
        <Button className="gap-2">
          <GitBranch className="w-4 h-4" /> Submit Project
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects, technologies..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Projects Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map((project) => (
          <Card key={project._id} className={`overflow-hidden hover:shadow-lg transition-all group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
            {project.thumbnail && viewMode === 'grid' && (
              <div className="relative h-48 overflow-hidden">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <Badge className="bg-primary/90 text-primary-foreground">{project.category}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <CardContent className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.shortDescription}</p>
                </div>
                {viewMode === 'list' && project.thumbnail && (
                  <img src={project.thumbnail} alt="" className="w-24 h-24 rounded-lg object-cover ml-4 shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.technologies.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1 text-xs"><Eye className="w-3.5 h-3.5" /> {project.views}</span>
                  <span className="flex items-center gap-1 text-xs"><Heart className="w-3.5 h-3.5" /> {project.likes.length}</span>
                </div>
                <div className="flex gap-1">
                  {project.githubUrl && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(project.githubUrl, '_blank')}>
                      <GitBranch className="w-4 h-4" />
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(project.liveUrl, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
