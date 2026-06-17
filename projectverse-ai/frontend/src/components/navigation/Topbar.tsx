import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarStore, useNotificationStore, useAuthStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Search, Bell, Menu, Moon, Sun, TrendingUp,
  Zap, MessageSquare, Calendar, Trophy
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { authService } from '@/services/auth.service';

export function Topbar() {
  const navigate = useNavigate();
  const { toggleMobile } = useSidebarStore();
  const { theme, setTheme } = useThemeStore();
  const { notifications, unreadCount } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const quickActions = [
    { icon: Zap, label: 'New Project', color: 'text-yellow-500', path: '/projects/new' },
    { icon: MessageSquare, label: 'New Message', color: 'text-blue-500', path: '/messages' },
    { icon: Calendar, label: 'New Event', color: 'text-green-500', path: '/events' },
    { icon: Trophy, label: 'Coding Arena', color: 'text-purple-500', path: '/coding' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobile}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, people, events..."
              className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl shadow-xl p-4 z-50">
                <p className="text-xs text-muted-foreground mb-2">QUICK ACTIONS</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-left transition-colors"
                      onClick={() => navigate(action.path)}
                    >
                      <action.icon className={cn('w-4 h-4', action.color)} />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 mb-2">TRENDING</p>
                <div className="space-y-1">
                  {['AI/ML Projects', 'Hackathon Teams', 'Web Dev Internships'].map((t) => (
                    <div key={t} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={cn(
                      'p-3 rounded-xl border transition-colors',
                      !n.isRead ? 'bg-primary/5 border-primary/20' : 'bg-card'
                    )}
                  >
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Quick Create */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="hidden sm:flex gap-2 h-10">
                <Zap className="w-4 h-4" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/projects/new')} className="cursor-pointer">New Project</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/teams')} className="cursor-pointer">Create Team</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/events')} className="cursor-pointer">Post Event</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ai/mentor')} className="cursor-pointer">Ask AI Mentor</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
