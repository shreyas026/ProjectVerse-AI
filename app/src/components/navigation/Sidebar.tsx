import { NavLink, useLocation } from 'react-router';
import { useSidebarStore } from '@/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FolderOpen, Users, Calendar,
  MessageSquare, Code2, Bot, Building2, GraduationCap,
  Lightbulb, Trophy, Settings, HelpCircle, ChevronLeft,
  ChevronRight, Rocket, Briefcase, Network, FlaskConical,
  LineChart, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockUser } from '@/services/mockData';

const navSections = [
  {
    title: 'Main',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/projects', label: 'Projects', icon: FolderOpen },
      { path: '/teams', label: 'Teams', icon: Users },
      { path: '/events', label: 'Events', icon: Calendar },
      { path: '/messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Skills & Coding',
    items: [
      { path: '/coding', label: 'Coding Arena', icon: Code2 },
      { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
  },
  {
    title: 'AI Assistants',
    items: [
      { path: '/ai/mentor', label: 'AI Mentor', icon: Bot },
      { path: '/ai/cofounder', label: 'AI Co-Founder', icon: Rocket },
      { path: '/ai/chatbot', label: 'AI Chatbot', icon: HelpCircle },
    ],
  },
  {
    title: 'Opportunities',
    items: [
      { path: '/companies', label: 'Companies', icon: Building2 },
      { path: '/jobs', label: 'Jobs & Internships', icon: Briefcase },
      { path: '/research', label: 'Research Hub', icon: FlaskConical },
      { path: '/startups', label: 'Startup Hub', icon: Lightbulb },
      { path: '/alumni', label: 'Alumni Network', icon: Network },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { path: '/analytics', label: 'Analytics', icon: LineChart },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse, closeMobile, isMobileOpen } = useSidebarStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border',
          'flex flex-col transition-all duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full',
          isCollapsed && !isMobileOpen ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <NavLink to="/" className="flex items-center gap-3 min-w-0" onClick={closeMobile}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-bold text-lg truncate">
                ProjectVerse
              </span>
            )}
          </NavLink>

          {/* Collapse Toggle (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8 shrink-0"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Mobile Close */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 shrink-0"
            onClick={closeMobile}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              {(!isCollapsed || isMobileOpen) && (
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </p>
              )}
              {isCollapsed && !isMobileOpen && (
                <div className="mx-auto w-8 h-px bg-border mb-2" />
              )}
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobile}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        'hover:bg-accent group relative',
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground'
                      )}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    >
                      <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                      {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
                      {isCollapsed && !isMobileOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t border-border p-3 shrink-0">
          <div className={cn(
            'flex items-center gap-3 rounded-xl p-2 hover:bg-accent transition-colors cursor-pointer',
            isCollapsed && !isMobileOpen && 'justify-center'
          )}>
            <img
              src={mockUser.avatar}
              alt={mockUser.firstName}
              className="w-9 h-9 rounded-full bg-muted shrink-0"
            />
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {mockUser.college?.department} • {mockUser.role}
                </p>
              </div>
            )}
            {(!isCollapsed || isMobileOpen) && (
              <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors shrink-0" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
