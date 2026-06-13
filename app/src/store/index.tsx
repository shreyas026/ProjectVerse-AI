import { createContext, useContext, useState } from 'react';
import type { User, Notification, Conversation } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<{
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({ auth: { user: null, isAuthenticated: false, isLoading: true }, setAuth: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
  });
  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuthStore = () => {
  const { auth, setAuth } = useContext(AuthContext);
  return {
    ...auth,
    setUser: (user: User | null) => setAuth((prev) => ({ ...prev, user, isAuthenticated: !!user })),
    setAuthenticated: (value: boolean) => setAuth((prev) => ({ ...prev, isAuthenticated: value })),
    setLoading: (value: boolean) => setAuth((prev) => ({ ...prev, isLoading: value })),
    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
    },
  };
};

// Theme Store
const ThemeContext = createContext<{
  theme: string;
  setTheme: (t: string) => void;
}>({ theme: 'dark', setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useThemeStore = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return {
    theme: theme as 'light' | 'dark' | 'system',
    setTheme: (t: string) => {
      setTheme(t);
      localStorage.setItem('theme', t);
    },
  };
};

// Notification Store
const NotificationContext = createContext<{
  notifications: Notification[];
  unreadCount: number;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}>({ notifications: [], unreadCount: 0, setNotifications: () => {} });

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStore = () => {
  const { notifications, unreadCount, setNotifications } = useContext(NotificationContext);
  return {
    notifications,
    unreadCount,
    setNotifications,
    addNotification: (n: Notification) => setNotifications((prev) => [n, ...prev]),
    markAsRead: (id: string) => setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))),
    markAllAsRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true }))),
  };
};

// Sidebar Store
const SidebarContext = createContext<{
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isCollapsed: false, isMobileOpen: false, setCollapsed: () => {}, setMobileOpen: () => {} });

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, setCollapsed, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarStore = () => {
  const { isCollapsed, isMobileOpen, setCollapsed, setMobileOpen } = useContext(SidebarContext);
  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapse: () => setCollapsed((p) => !p),
    toggleMobile: () => setMobileOpen((p) => !p),
    closeMobile: () => setMobileOpen(false),
  };
};

// Chat Store
const ChatContext = createContext<{
  conversations: Conversation[];
  activeConversation: string | null;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<string | null>>;
}>({ conversations: [], activeConversation: null, setConversations: () => {}, setActiveConversation: () => {} });

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  return (
    <ChatContext.Provider value={{ conversations, activeConversation, setConversations, setActiveConversation }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatStore = () => {
  const { conversations, activeConversation, setConversations, setActiveConversation } = useContext(ChatContext);
  return {
    conversations,
    activeConversation,
    isTyping: false,
    setConversations,
    setActiveConversation,
    setIsTyping: () => {},
    updateLastMessage: (conversationId: string, content: string, sender: User) =>
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, lastMessage: { content, sender, timestamp: new Date().toISOString() } }
            : c
        )
      ),
  };
};

// Export all providers wrapper
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);
