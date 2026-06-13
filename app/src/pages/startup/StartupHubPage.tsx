import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockStartups } from '@/services/mockData';
import { Lightbulb, Rocket, Search, Plus, Target, Sparkles, Handshake } from 'lucide-react';

export function StartupHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = mockStartups.filter((s) => {
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || (activeTab === 'recruiting' && (s.lookingFor.developers || s.lookingFor.coFounders));
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Rocket className="w-6 h-6 text-primary" /> Startup Hub</h1>
          <p className="text-muted-foreground">Build startups, find co-founders, and change the world</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Register Startup</Button>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold">Got a Startup Idea?</h3>
              <p className="text-sm text-muted-foreground mt-1">Use our AI Co-Founder to plan your architecture, design your database, and create a sprint plan.</p>
            </div>
            <Button className="gap-2 shrink-0"><Lightbulb className="w-4 h-4" /> Plan with AI</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search startups..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Startups</TabsTrigger>
          <TabsTrigger value="recruiting" className="gap-1"><Handshake className="w-4 h-4" /> Hiring</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((startup) => (
          <Card key={startup._id} className="hover:shadow-lg transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <Rocket className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{startup.name}</h3>
                    <Badge variant="secondary" className="capitalize text-[10px]">{startup.stage}</Badge>
                  </div>
                  <p className="text-sm text-primary font-medium mt-0.5">{startup.tagline}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{startup.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {Object.entries(startup.lookingFor).filter(([, v]) => v).map(([k]) => (
                      <Badge key={k} variant="outline" className="text-[10px] capitalize gap-1">
                        <Target className="w-3 h-3" /> Looking for {k.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">Join Team</Button>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
