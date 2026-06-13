import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAnalytics } from '@/services/mockData';
import {
  Users, FolderOpen, Calendar, TrendingUp, BarChart3, PieChart,
  GraduationCap, Code2, Activity
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsPage() {
  const deptData = mockAnalytics.departmentStats.map((d) => ({
    name: d.department,
    users: d.userCount,
    projects: d.projectCount,
    coding: d.avgCodingScore,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Activity className="w-6 h-6 text-primary" /> Analytics Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide insights and statistics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Users', value: mockAnalytics.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Total Projects', value: mockAnalytics.totalProjects.toLocaleString(), icon: FolderOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Events Hosted', value: mockAnalytics.totalEvents.toLocaleString(), icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'Active Now', value: mockAnalytics.activeUsers.toLocaleString(), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Monthly Growth</CardTitle>
            <CardDescription>User and project growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockAnalytics.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projects" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><PieChart className="w-4 h-4" /> Department Distribution</CardTitle>
            <CardDescription>Users across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RePieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="users" nameKey="name">
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium">Department</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Users</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Projects</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Avg Coding Score</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Activity</th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.departmentStats.map((dept) => (
                  <tr key={dept.department} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{dept.department}</td>
                    <td className="py-3 px-4 text-right">{dept.userCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{dept.projectCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={dept.avgCodingScore > 1500 ? 'default' : 'secondary'}>{dept.avgCodingScore}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="w-24 h-2 bg-muted rounded-full ml-auto overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (dept.avgCodingScore / 2000) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coding Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="w-5 h-5" /> Coding Arena Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Problems Solved', value: '45,230', change: '+12%' },
              { label: 'Active Contestants', value: '1,240', change: '+8%' },
              { label: 'Avg Rating', value: '1,680', change: '+5%' },
              { label: 'Contests Held', value: '156', change: '+15%' },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                <Badge variant="secondary" className="mt-2 text-[10px]">{s.change}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
