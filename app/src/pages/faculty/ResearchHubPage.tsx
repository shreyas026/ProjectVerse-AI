import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockResearch } from '@/services/mockData';
import { FlaskConical, DollarSign, Clock, Users, Sparkles, BookOpen } from 'lucide-react';

export function ResearchHubPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FlaskConical className="w-6 h-6 text-primary" /> Research Hub</h1>
          <p className="text-muted-foreground">Explore research opportunities with faculty mentors</p>
        </div>
        <Button className="gap-2"><BookOpen className="w-4 h-4" /> Browse All</Button>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">AI Research Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Find research projects matching your skills and interests</p>
          </div>
          <Button>Discover</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockResearch.map((r) => (
          <Card key={r._id} className="hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={r.facultyId.avatar} />
                  <AvatarFallback>{r.facultyId.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="mb-2">{r.domain}</Badge>
                  <h3 className="font-semibold text-lg">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Mentor: </span>
                    <span className="font-medium">{r.facultyId.firstName} {r.facultyId.lastName}</span>
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {r.positionsAvailable} positions</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {r.duration}</span>
                    {r.stipend && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${r.stipend.amount}/{r.stipend.period}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {r.skillsRequired.map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">Apply</Button>
                    <Button size="sm" variant="outline">Learn More</Button>
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
