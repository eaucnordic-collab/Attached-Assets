import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Files, 
  FileText, 
  Calendar, 
  Briefcase, 
  Users, 
  Handshake, 
  FormInput, 
  Inbox, 
  Image as ImageIcon, 
  Navigation, 
  Palette, 
  Settings,
  LogOut,
  Globe
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: Files },
  { href: '/admin/news', label: 'News', icon: FileText },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/forms', label: 'Forms', icon: FormInput },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { href: '/admin/design', label: 'Sidedesigner', icon: Palette },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logout();
        setLocation('/admin/login');
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border h-screen sticky top-0">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EAUC Nordic" className="h-9 w-9 rounded-md object-contain bg-black" />
            <span className="font-semibold text-base tracking-tight">EAUC Nordic</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href || (location.startsWith(link.href + '/') && link.href !== '/admin');
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                  data-testid={`link-admin-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full text-xs py-2 bg-sidebar-accent/30 hover:bg-sidebar-accent/50 rounded-md transition-colors text-sidebar-foreground"
            >
              <Globe className="w-3 h-3" />
              View Public Site
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors h-8"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-3 h-3" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
