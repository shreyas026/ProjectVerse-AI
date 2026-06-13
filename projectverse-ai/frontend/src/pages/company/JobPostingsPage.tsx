import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockJobs } from '@/services/mockData';
import { Search, Briefcase, MapPin, DollarSign, Clock, Sparkles } from 'lucide-react';

export function JobPostingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = mockJobs.filter((j) => {
    const matchSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || j.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Jobs & Internships</h1>
          <p className="text-muted-foreground">Find your dream role from top companies</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="full_time">Full-time</SelectItem>
            <SelectItem value="part_time">Part-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">AI Job Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Get personalized job matches based on your skills and preferences</p>
          </div>
          <Button>Find Matches</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((job) => (
          <Card key={job._id} className="hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                    <Badge variant="outline" className="capitalize text-[10px]">{job.type.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{job.companyId.companyDetails.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skillsRequired.map((s) => (
                      <Badge key={s.skill} variant="secondary" className="text-[10px]">{s.skill}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location.city}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary?.min?.toLocaleString()}-{job.salary?.max?.toLocaleString()} {job.salary?.currency}/{job.salary?.period}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button size="sm" className="shrink-0">Apply Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
