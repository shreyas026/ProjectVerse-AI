import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Network, GraduationCap, Briefcase, MessageSquare, Award, Sparkles } from 'lucide-react';

const mockAlumni = [
  { id: '1', name: 'Rajesh Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh', graduationYear: 2020, currentCompany: 'Google', role: 'Senior Software Engineer', yearsOfExperience: 4, isMentoring: true, topics: ['System Design', 'Career Growth', 'Interview Prep'] },
  { id: '2', name: 'Lisa Wang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', graduationYear: 2019, currentCompany: 'Microsoft', role: 'Product Manager', yearsOfExperience: 5, isMentoring: true, topics: ['Product Management', 'MBA', 'Leadership'] },
  { id: '3', name: 'Arun Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arun', graduationYear: 2021, currentCompany: 'Amazon', role: 'SDE II', yearsOfExperience: 3, isMentoring: false, topics: ['Backend Development', 'AWS'] },
  { id: '4', name: 'Emily Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily2', graduationYear: 2018, currentCompany: 'Meta', role: 'Engineering Manager', yearsOfExperience: 6, isMentoring: true, topics: ['Management', 'AI/ML', 'Career Switch'] },
];

export function AlumniNetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Network className="w-6 h-6 text-primary" /> Alumni Network</h1>
        <p className="text-muted-foreground">Connect with alumni mentors and explore opportunities</p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Find a Mentor</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Get guidance from experienced alumni in your field of interest</p>
          </div>
          <Button>Request Mentorship</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAlumni.map((alum) => (
          <Card key={alum.id} className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={alum.avatar} />
                  <AvatarFallback>{alum.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{alum.name}</h3>
                    {alum.isMentoring && <Badge variant="default" className="text-[10px] gap-1"><Award className="w-3 h-3" /> Mentor</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{alum.role} at {alum.currentCompany}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Class of {alum.graduationYear}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {alum.yearsOfExperience} years exp</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {alum.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="gap-1 flex-1"><MessageSquare className="w-3.5 h-3.5" /> Connect</Button>
                    {alum.isMentoring && <Button size="sm" variant="outline" className="gap-1"><Award className="w-3.5 h-3.5" /> Request Mentor</Button>}
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
