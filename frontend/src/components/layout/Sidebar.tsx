import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard, User, Trophy, Bot, FolderKanban,
  Shield, Search, FileCheck, Users, Telescope,
  GraduationCap, ShieldCheck, BarChart3, Zap, Settings
} from 'lucide-react';

interface SidebarProps { open: boolean; onClose: () => void; }

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/edu-ai', icon: Bot, label: 'Edu AI' },
  { to: '/projects', icon: FolderKanban, label: 'My Projects' },
  { to: '/validate', icon: Shield, label: 'Project Validator' },
  { to: '/quality-checker', icon: FileCheck, label: 'Quality Checker' },
  { to: '/originality', icon: Search, label: 'Originality Checker' },
  { to: '/teams', icon: Users, label: 'Teams' },
  { to: '/showcase', icon: Telescope, label: 'Showcase' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const facultyLinks = [
  { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/faculty/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/faculty/students', icon: GraduationCap, label: 'Students' },
  { to: '/faculty/analyze', icon: BarChart3, label: 'Class Analyzer' },
  { to: '/showcase', icon: Telescope, label: 'Showcase' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: ShieldCheck, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const links = user?.role === 'faculty' ? facultyLinks
    : user?.role === 'admin' ? adminLinks
    : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed left-0 top-16 bottom-0 z-40 w-64 glass border-r border-white/10 flex flex-col transition-transform duration-300 overflow-y-auto',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Role Badge */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary-600/30 flex items-center justify-center">
              <Zap size={12} className="text-primary-400" />
            </div>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider capitalize">
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => cn(
                'nav-link text-sm',
                isActive && 'active'
              )}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom version */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center">ProjectVerse AI v1.0</p>
        </div>
      </aside>
    </>
  );
}
