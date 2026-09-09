import { useListNews } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Home } from 'lucide-react';
import { Lang, loadLang } from '@/lib/i18n';

const NEWS_UI: Record<Lang, {
  home: string;
  title: string;
  subtitle: string;
  empty: string;
  read: string;
}> = {
  da: {
    home: 'Til forsiden',
    title: 'Seneste nyt',
    subtitle: 'Nyheder, pressemeddelelser og indblik fra EAUC Nordic.',
    empty: 'Ingen artikler fundet.',
    read: 'Læs artiklen',
  },
  uk: {
    home: 'На головну',
    title: 'Останні новини',
    subtitle: 'Новини, пресрелізи та матеріали EAUC Nordic.',
    empty: 'Статей не знайдено.',
    read: 'Читати статтю',
  },
  en: {
    home: 'Back to home',
    title: 'Latest News',
    subtitle: 'Updates, press releases, and insights from EAUC Nordic.',
    empty: 'No news articles found.',
    read: 'Read article',
  },
};

export default function News() {
  const lang = loadLang();
  const ui = NEWS_UI[lang];
  const { data: newsData, isLoading } = useListNews({ status: 'published', language: lang });
  const news = newsData?.items || [];

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-gray-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" size="sm" className="mb-10 -ml-3 gap-2" asChild>
            <Link href="/"><Home className="w-4 h-4" /> {ui.home}</Link>
          </Button>
          <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">{ui.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {ui.subtitle}
          </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-none">
                <Skeleton className="h-[240px] w-full rounded-2xl mb-4" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))
          ) : news.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              {ui.empty}
            </div>
          ) : (
            news.map((article) => (
              <article key={article.id} className="group flex flex-col">
                <Link href={`/news/${article.id}`} className="block overflow-hidden rounded-2xl mb-6 bg-gray-100 aspect-[4/3] relative">
                  {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">EAUC Nordic</div>
                  )}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-gray-900 hover:bg-gray-100 border-0">{article.category}</Badge>
                    </div>
                  )}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                  <Link href={`/news/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-1">{article.excerpt}</p>
                <Link href={`/news/${article.id}`} className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  {ui.read} <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
