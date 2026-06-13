import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockEvents } from '@/services/mockData';
import { Calendar, MapPin, Clock, Users, Trophy, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e._id === id) || mockEvents[0];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hackathon: 'bg-purple-500/10 text-purple-500',
      workshop: 'bg-blue-500/10 text-blue-500',
      coding_contest: 'bg-emerald-500/10 text-emerald-500',
      webinar: 'bg-orange-500/10 text-orange-500',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" className="gap-2" onClick={() => navigate('/events')}>
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Button>

      {event.banner && (
        <div className="relative h-56 rounded-2xl overflow-hidden">
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className={`${getTypeColor(event.type)} border-0 mb-2`}>{event.type.replace('_', ' ')}</Badge>
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.startDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.mode}{event.venue ? ` • ${event.venue}` : ''}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.currentParticipants}/{event.maxParticipants} registered</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><Share2 className="w-4 h-4" /> Share</Button>
          <Button variant="outline" size="sm" className="gap-1"><Bookmark className="w-4 h-4" /> Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>About this Event</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground leading-relaxed">{event.description}</p></CardContent>
          </Card>

          {event.agenda && event.agenda.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Agenda</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {event.agenda.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-accent transition-colors">
                    <div className="text-sm font-medium text-primary w-16 shrink-0">{item.time}</div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.speaker && <p className="text-xs text-muted-foreground mt-1">Speaker: {item.speaker}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Registration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Registration Deadline</p>
                <p className="font-medium">{new Date(event.registrationDeadline).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spots Available</p>
                <p className="font-medium">{event.maxParticipants - event.currentParticipants} of {event.maxParticipants}</p>
              </div>
              <Button className="w-full" variant={event.isRegistered ? 'secondary' : 'default'}>
                {event.isRegistered ? 'Registered' : 'Register Now'}
              </Button>
            </CardContent>
          </Card>

          {event.prizes && event.prizes.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Prizes</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {event.prizes.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="font-medium">{p.position}</span>
                    <span className="text-primary font-bold">{p.reward}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Organizer</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar><AvatarImage src={event.organizer?.avatar} /><AvatarFallback>{event.organizer?.firstName?.[0]}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium">{event.organizer?.firstName} {event.organizer?.lastName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{event.organizerType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
