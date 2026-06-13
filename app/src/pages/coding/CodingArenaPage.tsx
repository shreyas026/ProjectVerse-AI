import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockChallenges, mockUser } from '@/services/mockData';
import { Code2, Trophy, Flame, Target, Zap, Clock, Brain, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router';

const difficultyColors = {
  easy: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
  hard: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  expert: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export function CodingArenaPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems');

  const userStats = {
    problemsSolved: 142,
    totalProblems: 500,
    currentStreak: 12,
    maxStreak: 45,
    ranking: 23,
    totalParticipants: 1250,
    rating: mockUser.scores?.codingRating || 1850,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Code2 className="w-6 h-6 text-primary" /> Coding Arena</h1>
          <p className="text-muted-foreground">Practice, compete, and level up your coding skills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/leaderboard')}><Trophy className="w-4 h-4" /> Leaderboard</Button>
          <Button className="gap-2"><Zap className="w-4 h-4" /> Daily Challenge</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-emerald-500" />
              <Badge variant="secondary">{Math.round((userStats.problemsSolved / userStats.totalProblems) * 100)}%</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.problemsSolved}</p>
            <p className="text-xs text-muted-foreground">Problems Solved</p>
            <Progress value={(userStats.problemsSolved / userStats.totalProblems) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5 text-orange-500" />
              <Badge variant="secondary" className="text-orange-500">Hot!</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
            <Progress value={(userStats.currentStreak / userStats.maxStreak) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
            <Progress value={(userStats.rating / 3000) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <Badge variant="secondary">Top {Math.round((userStats.ranking / userStats.totalParticipants) * 100)}%</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">#{userStats.ranking}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="problems" className="gap-2"><Code2 className="w-4 h-4" /> Problems</TabsTrigger>
          <TabsTrigger value="contests" className="gap-2"><Trophy className="w-4 h-4" /> Contests</TabsTrigger>
          <TabsTrigger value="daily" className="gap-2"><Brain className="w-4 h-4" /> Daily Challenge</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Problem Set</CardTitle>
                <div className="flex gap-2">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                    <Badge key={d} variant="outline" className="capitalize cursor-pointer hover:bg-accent">{d}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  onClick={() => navigate(`/coding/challenge/${challenge._id}`)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium group-hover:text-primary transition-colors">{challenge.title}</p>
                      <Badge className={`${difficultyColors[challenge.difficulty]} capitalize text-[10px]`}>{challenge.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {challenge.points} pts</span>
                      <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> {challenge.acceptanceRate}% acceptance</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {challenge.timeLimit}ms</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {challenge.tags.slice(0, 2).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contests" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Weekly Coding Contest</h3>
              <p className="text-muted-foreground mt-2">Next contest starts in 2 days. Prepare yourself!</p>
              <div className="flex justify-center gap-4 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">02</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">14</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">35</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
              <Button className="mt-6 gap-2"><Zap className="w-4 h-4" /> Register Now</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Today&apos;s Challenge</CardTitle>
              <CardDescription>Solve today&apos;s problem to maintain your streak!</CardDescription>
            </CardHeader>
            <CardContent>
              <div onClick={() => navigate('/coding/challenge/1')} className="p-6 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Two Sum</h3>
                    <p className="text-muted-foreground mt-1">Given an array of integers and a target, return indices of two numbers that add up to target.</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-emerald-500/10 text-emerald-500">Easy</Badge>
                      <Badge variant="secondary">10 points</Badge>
                      <Badge variant="secondary">Array</Badge>
                    </div>
                  </div>
                  <Button>Solve Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
