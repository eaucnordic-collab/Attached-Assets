import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/contexts/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';

// Public pages
import PublicHome from '@/pages/public/home';
import PublicNews from '@/pages/public/news';
import PublicNewsDetail from '@/pages/public/news-detail';
import PublicEvents from '@/pages/public/events';
import PublicEventDetail from '@/pages/public/event-detail';
import PublicProjects from '@/pages/public/projects';
import PublicProjectDetail from '@/pages/public/project-detail';
import PublicAbout from '@/pages/public/about';
import PublicPartners from '@/pages/public/partners';
import PublicContact from '@/pages/public/contact';
import { LegalPage } from '@/pages/public/legal';

// Admin pages
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/index';
import AdminPages from '@/pages/admin/pages';
import AdminBuilder from '@/pages/admin/builder';
import AdminNews from '@/pages/admin/news';
import AdminNewsEdit from '@/pages/admin/news-edit';
import AdminEvents from '@/pages/admin/events';
import AdminEventEdit from '@/pages/admin/event-edit';
import AdminProjects from '@/pages/admin/projects';
import AdminProjectEdit from '@/pages/admin/project-edit';
import AdminTeam from '@/pages/admin/team';
import AdminPartners from '@/pages/admin/partners';
import AdminForms from '@/pages/admin/forms';
import AdminSubmissions from '@/pages/admin/submissions';
import AdminMedia from '@/pages/admin/media';
import AdminNavigation from '@/pages/admin/navigation';
import AdminSettings from '@/pages/admin/settings';
import AdminSiteEditor from '@/pages/admin/site-editor';

import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={PublicHome} />
      <Route path="/news" component={PublicNews} />
      <Route path="/news/:slug" component={PublicNewsDetail} />
      <Route path="/events" component={PublicEvents} />
      <Route path="/events/:id" component={PublicEventDetail} />
      <Route path="/projects" component={PublicProjects} />
      <Route path="/projects/:id" component={PublicProjectDetail} />
      <Route path="/about" component={PublicAbout} />
      <Route path="/partners" component={PublicPartners} />
      <Route path="/contact" component={PublicContact} />
      <Route path="/privacy"><LegalPage type="privacy" /></Route>
      <Route path="/cookies"><LegalPage type="cookies" /></Route>

      {/* Admin auth */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin protected routes */}
      <Route path="/admin">
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/pages">
        <ProtectedRoute><AdminPages /></ProtectedRoute>
      </Route>
      <Route path="/admin/pages/:id/builder">
        <ProtectedRoute><AdminBuilder /></ProtectedRoute>
      </Route>
      <Route path="/admin/news">
        <ProtectedRoute><AdminNews /></ProtectedRoute>
      </Route>
      <Route path="/admin/news/new">
        <ProtectedRoute><AdminNewsEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/news/:id">
        <ProtectedRoute><AdminNewsEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute><AdminEvents /></ProtectedRoute>
      </Route>
      <Route path="/admin/events/new">
        <ProtectedRoute><AdminEventEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/events/:id">
        <ProtectedRoute><AdminEventEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute><AdminProjects /></ProtectedRoute>
      </Route>
      <Route path="/admin/projects/new">
        <ProtectedRoute><AdminProjectEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/projects/:id">
        <ProtectedRoute><AdminProjectEdit /></ProtectedRoute>
      </Route>
      <Route path="/admin/team">
        <ProtectedRoute><AdminTeam /></ProtectedRoute>
      </Route>
      <Route path="/admin/partners">
        <ProtectedRoute><AdminPartners /></ProtectedRoute>
      </Route>
      <Route path="/admin/forms">
        <ProtectedRoute><AdminForms /></ProtectedRoute>
      </Route>
      <Route path="/admin/submissions">
        <ProtectedRoute><AdminSubmissions /></ProtectedRoute>
      </Route>
      <Route path="/admin/media">
        <ProtectedRoute><AdminMedia /></ProtectedRoute>
      </Route>
      <Route path="/admin/navigation">
        <ProtectedRoute><AdminNavigation /></ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute><AdminSettings /></ProtectedRoute>
      </Route>
      <Route path="/admin/design">
        <ProtectedRoute><AdminSiteEditor /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
