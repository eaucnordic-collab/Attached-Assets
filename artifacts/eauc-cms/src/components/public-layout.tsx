import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useListNavigation, useGetSettings } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: navItems } = useListNavigation();
  const { data: settings } = useGetSettings();

  const mainNav = navItems?.filter((item) => !item.parentId && item.visible).sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-primary">
              {settings?.logo ? (
                <img src={settings.logo} alt={settings.siteName} className="h-8" />
              ) : (
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">
                  EN
                </div>
              )}
              {settings?.siteName || 'EAUC Nordic'}
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.id}
                href={item.url || '/'}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.url ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden md:block">
              <Button size="sm" className="rounded-full px-6">Get Involved</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-xl text-white">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">
                EN
              </div>
              {settings?.siteName || 'EAUC Nordic'}
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              {settings?.siteDescription || 'Advancing sustainability and green energy across the Nordic region through collaboration and innovation.'}
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{settings?.contactEmail || 'contact@eaucnordic.com'}</li>
              <li>{settings?.contactPhone || '+46 8 123 4567'}</li>
              <li>{settings?.address || 'Stockholm, Sweden'}</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
          <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} EAUC Nordic. All rights reserved.`}</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
