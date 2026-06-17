import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/services/auth.service';
import { projectService } from '@/services/project.service';
import { eventService } from '@/services/event.service';
import { userService } from '@/services/user.service';
import { mockAnalytics } from '@/services/mockData';
import {
  TrendingUp, FolderOpen, Code2, Trophy, Zap, Calendar,
  Star, ArrowRight, Flame, Target, Users, Lightbulb, Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { User, Project, Event, LeaderboardEntry } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load all data concurrently
        const [meRes, projData, eventData, leadData] = await Promise.all([
          authService.getMe(),
          projectService.getAllProjects({ limit: 3 }),
          eventService.getAllEvents(),
          userService.getLeaderboard()
        ]);

        if (meRes.success) {
          setUser(meRes.data.user);
        }
        setProjects(projData.slice(0, 3));
        setEvents(eventData.slice(0, 3));
        setLeaderboard(leadData.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    );
  }

  const skills = user.skills || [];

  const radarData = [
    { subject: 'Coding', A: user.scores?.codingRating ? Math.min(100, (user.scores.codingRating / 2500) * 100) : 75, fullMark: 100 },
    { subject: 'Projects', A: user.scores?.innovationScore ? Math.min(100, (user.scores.innovationScore / 10000) * 100) : 85, fullMark: 100 },
    { subject: 'Collaboration', A: user.scores?.contributionScore ? Math.min(100, (user.scores.contributionScore / 10000) * 100) : 70, fullMark: 100 },
    { subject: 'Innovation', A: user.scores?.innovationScore ? Math.min(100, (user.scores.innovationScore / 10000) * 100) : 90, fullMark: 100 },
    { subject: 'Learning', A: 80, fullMark: 100 },
    { subject: 'Leadership', A: user.scores?.reliabilityScore || 65, fullMark: 100 },
  ];

  const statCards = [
    { title: 'Innovation Score', value: user.scores?.innovationScore || 0, icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+12%' },
    { title: 'Coding Rating', value: user.scores?.codingRating || 0, icon: Code2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+5%' },
    { title: 'Contribution', value: user.scores?.contributionScore || 0, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+8%' },
    { title: 'Projects', value: projects.length, icon: FolderOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: `+${projects.length}` },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.firstName}! <Flame className="inline w-6 h-6 text-orange-500" />
          </h1>
          <p className="text-muted-foreground mt-1">
            You&apos;re on a 12-day streak. Keep building amazing things!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/coding')}>
            <Zap className="w-4 h-4" /> Quick Action
          </Button>
          <Button size="sm" className="gap-2" onClick={() => navigate('/projects/new')}>
            <FolderOpen className="w-4 h-4" /> New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">{stat.trend}</Badge>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill Radar */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Skill Profile</CardTitle>
                <CardDescription>Your competency radar</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-muted-foreground">Placement Readiness</p>
                  <p className="text-2xl font-bold text-primary">{user.scores?.placementReadiness || 78}%</p>
                  <Progress value={user.scores?.placementReadiness || 78} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Growth Analytics</CardTitle>
                    <CardDescription>Monthly activity trends</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="w-3 h-3" /> +24%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={mockAnalytics.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="projects" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} name="Projects" />
                    <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Projects & Events Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" /> Recent Projects
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/projects')}>View All <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No projects found.</p>
                ) : (
                  projects.map((p) => (
                    <div key={p._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer group" onClick={() => navigate(`/projects/${p._id}`)}>
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary"><FolderOpen className="w-6 h-6" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.shortDescription}</p>
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {p.technologies.slice(0, 3).map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Upcoming Events
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/events')}>View All <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No upcoming events found.</p>
                ) : (
                  events.map((e) => (
                    <div key={e._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer group" onClick={() => navigate(`/events/${e._id}`)}>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary uppercase">{new Date(e.startDate).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-primary leading-none">{new Date(e.startDate).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.mode} • {e.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={e.isRegistered ? 'default' : 'secondary'} className="text-[10px]">
                            {e.isRegistered ? 'Registered' : 'Open'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{e.currentParticipants}/{e.maxParticipants}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Innovation Leaderboard
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/leaderboard')}>View Full <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Leaderboard empty.</p>
                ) : (
                  leaderboard.map((entry, i) => (
                    <div key={entry.userId._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        i === 0 ? 'bg-amber-500/20 text-amber-500' : i === 1 ? 'bg-slate-400/20 text-slate-400' : i === 2 ? 'bg-orange-600/20 text-orange-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <img src={entry.userId.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.userId.firstName}`} alt="" className="w-9 h-9 rounded-full bg-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.userId.firstName} {entry.userId.lastName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{entry.totalScore.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">pts</p>
                      </div>
                      <Star className={`w-4 h-4 ${i < 3 ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
              <CardDescription>Track and manage your technical skills</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No skills added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3 p-3 border rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{skill.name}</p>
                          <Badge variant={skill.verified ? 'default' : 'secondary'} className="text-[10px]">
                            {skill.verified ? 'Verified' : 'Unverified'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress
                            value={skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 75 : skill.level === 'intermediate' ? 50 : 25}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-muted-foreground capitalize w-20 text-right">{skill.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'Submitted solution to', target: 'Two Sum', time: '2 hours ago', icon: Code2, color: 'text-emerald-500' },
                { action: 'Joined team', target: 'Neural Ninjas', time: '5 hours ago', icon: Users, color: 'text-blue-500' },
                { action: 'Created project', target: 'AI Study Assistant', time: '1 day ago', icon: FolderOpen, color: 'text-purple-500' },
                { action: 'Earned badge', target: 'Hackathon Winner', time: '2 days ago', icon: Trophy, color: 'text-amber-500' },
                { action: 'Completed challenge', target: 'Daily Coding Challenge', time: '3 days ago', icon: Star, color: 'text-orange-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
                  <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
