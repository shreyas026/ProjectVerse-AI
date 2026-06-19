import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';
import {
  Zap, Bell, ChevronDown, LogOut, User, Settings,
  Menu, X, Sun, Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps { onMenuToggle: () => void; sidebarOpen: boolean; }

export default function Navbar({ onMenuToggle, sidebarOpen }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const activeTheme = localStorage.getItem('theme') || 'dark';
    if (activeTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="btn-ghost p-2 lg:hidden">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">
              <span className="text-gradient">ProjectVerse</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              const newTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(newTheme);
              localStorage.setItem('theme', newTheme);
              if (newTheme === 'light') {
                document.documentElement.classList.add('light');
              } else {
                document.documentElement.classList.remove('light');
              }
            }}
            className="btn-ghost p-2 text-slate-300 hover:text-white"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-ghost p-2 relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 btn-ghost px-3 py-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  : getInitials(user?.name || 'U')}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-white/10 shadow-glass p-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-all">
                  <User size={14} /> Profile
                </Link>
                <Link to="/settings" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-all">
                  <Settings size={14} /> Settings
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all w-full mt-1">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
