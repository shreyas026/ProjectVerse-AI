import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { useSidebarStore } from '@/store';

export function MainLayout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="pb-20 lg:pb-8 px-4 lg:px-8 pt-4">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
