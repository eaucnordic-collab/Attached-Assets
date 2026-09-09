import { useParams, Link } from 'wouter';
import { useGetNewsPost, useListNews } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Home, User } from 'lucide-react';
import { Lang, loadLang } from '@/lib/i18n';
import { articleContentToHtml } from '@/lib/sanitize-article-html';

const ARTICLE_UI: Record<Lang, {
  home: string;
  allNews: string;
  notFound: string;
  author: string;
  noContent: string;
}> = {
  da: {
    home: 'Til forsiden',
    allNews: 'Alle artikler',
    notFound: 'Artiklen blev ikke fundet',
    author: 'Forfatter',
    noContent: 'Intet indhold.',
  },
  uk: {
    home: 'На головну',
    allNews: 'Усі статті',
    notFound: 'Статтю не знайдено',
    author: 'Автор',
    noContent: 'Вміст відсутній.',
  },
  en: {
    home: 'Back to home',
    allNews: 'All articles',
    notFound: 'Article not found',
    author: 'Author',
    noContent: 'No content provided.',
  },
};

export default function NewsDetail() {
  const lang = loadLang();
  const ui = ARTICLE_UI[lang];
  const params = useParams();
  const id = Number(params.slug);
  const { data: article, isLoading, isError } = useGetNewsPost(id, {
    query: {
      enabled: Number.isInteger(id) && id > 0,
      queryKey: ['/api/news', id],
    },
  });
  const { data: translatedNews, isLoading: isTranslationLoading } = useListNews(
    {
      status: 'published',
      language: lang,
      translationGroup: article?.translationGroup,
      limit: 1,
    },
    {
      query: {
        enabled: Boolean(article?.translationGroup && article.language !== lang),
      },
    },
  );
  const displayedArticle = article?.language === lang
    ? article
    : translatedNews?.items[0];

  if (isLoading || (article?.language !== lang && isTranslationLoading)) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Skeleton className="h-8 w-24 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-1/3 mb-12" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-12" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !displayedArticle) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">{ui.notFound}</h1>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" asChild><Link href="/"><Home className="w-4 h-4 mr-2" />{ui.home}</Link></Button>
          <Button asChild><Link href="/news">{ui.allNews}</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-12 pb-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-8 -ml-3">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/"><Home className="w-4 h-4" /> {ui.home}</Link>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/news"><ArrowLeft className="w-4 h-4" /> {ui.allNews}</Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          {displayedArticle.category && <Badge variant="secondary">{displayedArticle.category}</Badge>}
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4" />
            {new Date(displayedArticle.publishedAt || displayedArticle.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-gray-900 leading-tight">
          {displayedArticle.title}
        </h1>
        
        {displayedArticle.excerpt && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-8">
            {displayedArticle.excerpt}
          </p>
        )}

        {displayedArticle.author && (
          <div className="flex items-center gap-3 py-6 border-y mb-12">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{displayedArticle.author}</div>
              <div className="text-sm text-gray-500">{ui.author}</div>
            </div>
          </div>
        )}
      </div>

      {displayedArticle.coverImage && (
        <div className="container mx-auto px-4 max-w-5xl mb-16">
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-lg bg-gray-100">
            <img src={displayedArticle.coverImage} alt={displayedArticle.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose max-w-none text-[16px] md:text-[18px] leading-[1.8] text-gray-800 prose-headings:text-gray-900 prose-h2:text-3xl prose-h3:text-2xl prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-blockquote:text-gray-600">
          {displayedArticle.content ? (
            <div dangerouslySetInnerHTML={{ __html: articleContentToHtml(displayedArticle.content) }} />
          ) : (
            <p>{ui.noContent}</p>
          )}
        </div>
      </div>
    </article>
  );
}
