import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCompanies } from '@/services/mockData';
import { Search, Building2, MapPin, Briefcase, Globe, Users, Verified } from 'lucide-react';

export function CompaniesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = mockCompanies.filter((c) => !searchQuery || c.companyDetails.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> Companies</h1>
          <p className="text-muted-foreground">Discover top companies hiring from your campus</p>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search companies..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((company) => (
          <Card key={company._id} className="hover:shadow-lg transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 rounded-xl">
                  <AvatarImage src={company.companyDetails.logo} />
                  <AvatarFallback><Building2 className="w-6 h-6" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{company.companyDetails.name}</h3>
                    {company.verified && <Verified className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{company.companyDetails.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {company.locations[0]?.city}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {company.openPositions} open roles</span>
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {company.companyDetails.industry}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="gap-1"><Briefcase className="w-3.5 h-3.5" /> View Jobs</Button>
                    <Button size="sm" className="gap-1"><Users className="w-3.5 h-3.5" /> Follow</Button>
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
