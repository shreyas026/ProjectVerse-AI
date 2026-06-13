import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser, mockProjects } from '@/services/mockData';
import {
  Github, Linkedin, Globe, Mail, BookOpen,
  Award, FileText, Sparkles, Code2, Target, Star, Edit3,
  ExternalLink
} from 'lucide-react';

export function MyProfilePage() {
  const user = mockUser;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-background rounded-2xl">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                  <p className="text-muted-foreground">{user.college?.department} • {user.college?.name} • Class of {user.college?.graduationYear}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2"><Edit3 className="w-4 h-4" /> Edit</Button>
                  <Button size="sm" className="gap-2"><Sparkles className="w-4 h-4" /> AI Resume</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {user.social?.github && (
                  <a href={`https://${user.social.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {user.social?.linkedin && (
                  <a href={`https://${user.social.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {user.social?.portfolio && (
                  <a href={`https://${user.social.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" /> Portfolio
                  </a>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> {user.email}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Coding Rating', value: user.scores?.codingRating, max: 3000, icon: Code2, color: 'text-emerald-500' },
          { label: 'Innovation', value: user.scores?.innovationScore, max: 10000, icon: Sparkles, color: 'text-amber-500' },
          { label: 'Contribution', value: user.scores?.contributionScore, max: 10000, icon: Target, color: 'text-blue-500' },
          { label: 'Placement Ready', value: `${(user.scores?.placementReadiness || 0)}%`, raw: user.scores?.placementReadiness || 0, max: 100, icon: Star, color: 'text-purple-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold">{stat.value?.toLocaleString()}</p>
              <Progress value={((stat.raw ?? stat.value ?? 0) / stat.max) * 100} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="skills">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="skills" className="gap-2"><Code2 className="w-4 h-4" /> Skills</TabsTrigger>
          <TabsTrigger value="projects" className="gap-2"><BookOpen className="w-4 h-4" /> Projects</TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2"><Award className="w-4 h-4" /> Achievements</TabsTrigger>
          <TabsTrigger value="certs" className="gap-2"><FileText className="w-4 h-4" /> Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
              <CardDescription>Your verified and self-reported skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-3 border rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{skill.name}</p>
                        <Badge variant={skill.verified ? 'default' : 'secondary'} className="text-[10px]">{skill.verified ? 'Verified' : 'Self-reported'}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Progress value={skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 75 : skill.level === 'intermediate' ? 50 : 25} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground capitalize w-16 text-right">{skill.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProjects.map((p) => (
              <Card key={p._id} className="hover:shadow-md transition-all cursor-pointer overflow-hidden">
                {p.thumbnail && <img src={p.thumbnail} alt="" className="w-full h-36 object-cover" />}
                <CardContent className="p-4">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.technologies.slice(0, 4).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.achievements.map((a, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.date).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certs" className="mt-6">
          <div className="space-y-3">
            {user.certifications.map((c, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.issuer} • {new Date(c.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {c.credentialUrl && (
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => window.open(c.credentialUrl, '_blank')}>
                      <ExternalLink className="w-3.5 h-3.5" /> Verify
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Resume Generator */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">AI-Powered Tools</h3>
            <p className="text-sm text-muted-foreground mt-1">Generate ATS-friendly resume and portfolio website with AI</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Resume</Button>
            <Button className="gap-2"><Globe className="w-4 h-4" /> Portfolio</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
