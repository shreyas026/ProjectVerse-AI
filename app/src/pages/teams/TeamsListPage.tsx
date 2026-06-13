import { useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockTeams } from '@/services/mockData';
import { Users, Search, Plus, UserPlus, Sparkles } from 'lucide-react';

export function TeamsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockTeams.filter((t) => {
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || (activeTab === 'open' && t.requirements.isOpen) || (activeTab === 'my' && t.members.some((m) => m.userId._id === '1'));
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Collaboration Hub</h1>
          <p className="text-muted-foreground">Find teammates and build amazing projects together</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Create Team</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search teams..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="open">Open to Join</TabsTrigger>
          <TabsTrigger value="my">My Teams</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((team) => (
          <Card key={team._id} className="hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{team.name}</h3>
                    {team.requirements.isOpen && <Badge variant="default" className="text-[10px]">Recruiting</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{team.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {team.requirements.skillsNeeded.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 4).map((m, i) => (
                        <Avatar key={i} className="w-7 h-7 border-2 border-background">
                          <AvatarImage src={m.userId?.avatar} /><AvatarFallback>{m.userId?.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 4 && <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">+{team.members.length - 4}</div>}
                    </div>
                    <Button size="sm" variant="outline" className="gap-1"><UserPlus className="w-3.5 h-3.5" /> Join</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Team Recommendation */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">AI Team Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Let our AI match you with the perfect teammates based on your skills and interests</p>
          </div>
          <Button>Find Teammates</Button>
        </CardContent>
      </Card>
    </div>
  );
}
