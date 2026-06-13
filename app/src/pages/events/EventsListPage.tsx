import { useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEvents } from '@/services/mockData';
import { Search, Calendar, MapPin, Users, Clock, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';

const eventTypes = ['All', 'hackathon', 'workshop', 'coding_contest', 'webinar', 'conference'];

export function EventsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockEvents.filter((e) => {
    const matchSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || e.type === activeTab;
    return matchSearch && matchTab;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hackathon: 'bg-purple-500/10 text-purple-500',
      workshop: 'bg-blue-500/10 text-blue-500',
      coding_contest: 'bg-emerald-500/10 text-emerald-500',
      webinar: 'bg-orange-500/10 text-orange-500',
      conference: 'bg-pink-500/10 text-pink-500',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Event Corner</h1>
          <p className="text-muted-foreground">Discover hackathons, workshops, and coding contests</p>
        </div>
        <Button className="gap-2"><Calendar className="w-4 h-4" /> Host Event</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search events..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {eventTypes.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize text-xs">{t.replace('_', ' ')}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((event) => (
          <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
            {event.banner && (
              <div className="relative h-40 overflow-hidden">
                <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getTypeColor(event.type)} border-0`}>{event.type.replace('_', ' ')}</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                    {event.isRegistered ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                </div>
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.mode}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {event.currentParticipants}/{event.maxParticipants}</span>
              </div>
              {event.prizes && event.prizes.length > 0 && (
                <div className="flex gap-2">
                  {event.prizes.slice(0, 3).map((p, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] gap-1">
                      {p.position}: {p.reward}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1" variant={event.isRegistered ? 'secondary' : 'default'}>
                  {event.isRegistered ? 'Registered' : 'Register Now'}
                </Button>
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">AI Event Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Get personalized event suggestions based on your skills and interests</p>
          </div>
          <Button>Discover Events</Button>
        </CardContent>
      </Card>
    </div>
  );
}
