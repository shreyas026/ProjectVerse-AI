import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLeaderboard } from '@/services/mockData';
import { Trophy, Medal, Star, Code2, Flame } from 'lucide-react';

export function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-500" /> Innovation Leaderboard</h1>
        <p className="text-muted-foreground">Top performers across coding, projects, and contributions</p>
      </div>

      <Tabs defaultValue="overall">
        <TabsList>
          <TabsTrigger value="overall" className="gap-2"><Star className="w-4 h-4" /> Overall</TabsTrigger>
          <TabsTrigger value="coding" className="gap-2"><Code2 className="w-4 h-4" /> Coding</TabsTrigger>
          <TabsTrigger value="streak" className="gap-2"><Flame className="w-4 h-4" /> Streaks</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Top Innovators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockLeaderboard.map((entry, i) => (
                <div key={entry.userId._id} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${i === 0 ? 'bg-amber-500/5 border border-amber-500/20' : i === 1 ? 'bg-slate-400/5 border border-slate-400/20' : i === 2 ? 'bg-orange-600/5 border border-orange-600/20' : 'hover:bg-accent'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                    i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-600 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < 3 ? <Medal className="w-5 h-5" /> : entry.rank}
                  </div>
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={entry.userId.avatar} />
                    <AvatarFallback>{entry.userId.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{entry.userId.firstName} {entry.userId.lastName}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Innovation: {entry.innovationScore}</span>
                      <span>Coding: {entry.codingScore}</span>
                      <span>Contribution: {entry.contributionScore}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold">{entry.totalScore.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                  {i === 0 && <Badge className="bg-amber-500 text-white shrink-0">#1</Badge>}
                  {i === 1 && <Badge variant="secondary" className="shrink-0">#2</Badge>}
                  {i === 2 && <Badge className="bg-orange-600 text-white shrink-0">#3</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
