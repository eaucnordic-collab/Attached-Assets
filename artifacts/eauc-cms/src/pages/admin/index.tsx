import { useListNews, useListEvents } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import {
  Plus,
  Pencil,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Palette,
  ArrowRight,
  Newspaper,
} from 'lucide-react';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: newsData, isLoading: newsLoading } = useListNews();
  const { data: eventsData, isLoading: eventsLoading } = useListEvents();

  const news = newsData?.items || [];
  const events = eventsData?.items || [];
  const recentNews = news.slice(0, 8);
  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Добро пожаловать</h1>
          <p className="text-muted-foreground text-sm mt-0.5">EAUC Nordic — панель управления</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setLocation('/admin/news/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Новая статья
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/admin/news/new', icon: FileText, label: 'Написать статью', color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { href: '/admin/events/new', icon: Calendar, label: 'Добавить событие', color: 'bg-green-50 text-green-700 border-green-100' },
          { href: '/admin/team', icon: CheckCircle2, label: 'Команда', color: 'bg-purple-50 text-purple-700 border-purple-100' },
          { href: '/admin/design', icon: Palette, label: 'Редактор сайта', color: 'bg-orange-50 text-orange-700 border-orange-100' },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center text-sm font-medium transition-all hover:shadow-sm hover:-translate-y-0.5 ${color}`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-base">Новости</h2>
              {news.length > 0 && (
                <Badge variant="secondary" className="text-xs">{news.length}</Badge>
              )}
            </div>
            <Link href="/admin/news" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              Все статьи <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border rounded-xl bg-white overflow-hidden divide-y">
            {newsLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Загрузка...</div>
            ) : recentNews.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Newspaper className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">Статей пока нет</p>
                <Button size="sm" onClick={() => setLocation('/admin/news/new')} className="gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  Написать первую статью
                </Button>
              </div>
            ) : (
              recentNews.map((article) => (
                <div key={article.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {article.category && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-xs text-muted-foreground">{article.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={article.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs gap-1 hidden sm:flex"
                    >
                      {article.status === 'published'
                        ? <><CheckCircle2 className="w-3 h-3" />Опубликовано</>
                        : <><Clock className="w-3 h-3" />Черновик</>
                      }
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLocation(`/admin/news/${article.id}`)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {news.length > 8 && (
            <Link href="/admin/news" className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Показать все {news.length} статей <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Events */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-base">События</h2>
            </div>
            <Link href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              Все <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border rounded-xl bg-white overflow-hidden divide-y">
            {eventsLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Загрузка...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <Calendar className="w-7 h-7 text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">Событий нет</p>
                <Button size="sm" variant="outline" onClick={() => setLocation('/admin/events/new')} className="gap-2 text-xs h-7">
                  <Plus className="w-3 h-3" />
                  Добавить
                </Button>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    {event.startDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLocation(`/admin/events/${event.id}`)}
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Site Editor shortcut */}
          <div
            onClick={() => setLocation('/admin/design')}
            className="border rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 p-4 cursor-pointer hover:shadow-sm transition-all hover:-translate-y-0.5 space-y-1"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Редактор сайта</span>
            </div>
            <p className="text-xs text-orange-700/70">
              Изменить тексты, секции и контент публичной страницы
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
