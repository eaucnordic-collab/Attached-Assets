import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Briefcase,
  Users,
  Handshake,
  Inbox,
  Image as ImageIcon,
  Palette,
  Settings,
  LogOut,
  Globe,
  FormInput,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Контент',
    links: [
      { href: '/admin', label: 'Главная', icon: LayoutDashboard },
      { href: '/admin/news', label: 'Новости', icon: FileText },
      { href: '/admin/events', label: 'События', icon: Calendar },
      { href: '/admin/projects', label: 'Проекты', icon: Briefcase },
      { href: '/admin/team', label: 'Команда', icon: Users },
      { href: '/admin/partners', label: 'Партнёры', icon: Handshake },
    ],
  },
  {
    label: 'Сайт',
    links: [
      { href: '/admin/design', label: 'Редактор сайта', icon: Palette },
      { href: '/admin/media', label: 'Медиафайлы', icon: ImageIcon },
    ],
  },
  {
    label: 'Система',
    links: [
      { href: '/admin/submissions', label: 'Заявки', icon: Inbox },
      { href: '/admin/forms', label: 'Формы', icon: FormInput },
      { href: '/admin/settings', label: 'Настройки', icon: Settings },
    ],
  },
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
      },
    });
  };

  const isActive = (href: string) =>
    href === '/admin'
      ? location === '/admin'
      : location === href || location.startsWith(href + '/');

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border h-screen sticky top-0">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="EAUC Nordic"
            style={{ height: 26, width: 'auto', objectFit: 'contain', background: '#0f1523', borderRadius: 5, padding: '2px 5px' }}
          />
          <span className="font-semibold text-sm tracking-tight leading-tight">EAUC Nordic</span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
                {group.label}
              </div>
              <nav className="mt-0.5 space-y-0.5 px-2">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                      data-testid={`link-admin-${link.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium truncate">{user?.name}</span>
              <span className="text-[10px] text-sidebar-foreground/50 truncate">{user?.email}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 text-[11px] py-1.5 bg-sidebar-accent/30 hover:bg-sidebar-accent/50 rounded-md transition-colors text-sidebar-foreground"
            >
              <Globe className="w-3 h-3" />
              Сайт
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 flex items-center justify-center gap-1.5 text-[11px] h-auto py-1.5 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-3 h-3" />
              Выйти
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
