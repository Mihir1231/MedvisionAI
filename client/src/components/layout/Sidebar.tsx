import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Upload,
  Newspaper,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  Activity,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/diagnose', label: 'Upload & Diagnose', icon: Upload },
  { path: '/news', label: 'Medical News', icon: Newspaper },
  { path: '/research', label: 'Research Papers', icon: BookOpen },
];

const adminItems = [
  { path: '/admin', label: 'Admin Panel', icon: Shield },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="relative">
            <Activity className="h-8 w-8 text-primary" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">MedVision AI</h1>
            <p className="text-xs text-sidebar-foreground/60">Medical Imaging</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <p className="px-4 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'nav-link',
                isActive(item.path) && 'nav-link-active'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          {isAdmin && (
            <>
              <Separator className="my-4 bg-sidebar-border" />
              <p className="px-4 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                Administration
              </p>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'nav-link',
                    isActive(item.path) && 'nav-link-active'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
