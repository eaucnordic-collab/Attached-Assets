import { useParams, Link } from 'wouter';
import { useGetNewsPost } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User } from 'lucide-react';

function getArticleParagraphs(content: string): string[] {
  if (typeof DOMParser !== 'undefined' && /<[^>]+>/.test(content)) {
    const document = new DOMParser().parseFromString(content, 'text/html');
    const blocks = Array.from(document.body.children)
      .map((element) => element.textContent?.trim() ?? '')
      .filter(Boolean);
    if (blocks.length > 0) return blocks;
  }

  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function NewsDetail() {
  const params = useParams();
  const id = Number(params.slug);
  const { data: article, isLoading, isError } = useGetNewsPost(id, {
    query: {
      enabled: Number.isInteger(id) && id > 0,
      queryKey: ['/api/news', id],
    },
  });

  if (isLoading) {
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

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <Button asChild><Link href="/news">Back to News</Link></Button>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-12 pb-8 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-8 -ml-3 gap-2" asChild>
          <Link href="/news"><ArrowLeft className="w-4 h-4" /> All News</Link>
        </Button>
        
        <div className="flex items-center gap-3 mb-6">
          {article.category && <Badge variant="secondary">{article.category}</Badge>}
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar className="w-4 h-4" />
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-gray-900 leading-tight">
          {article.title}
        </h1>
        
        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8">
            {article.excerpt}
          </p>
        )}

        {article.author && (
          <div className="flex items-center gap-3 py-6 border-y mb-12">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{article.author}</div>
              <div className="text-sm text-gray-500">Author</div>
            </div>
          </div>
        )}
      </div>

      {article.coverImage && (
        <div className="container mx-auto px-4 max-w-5xl mb-16">
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-lg bg-gray-100">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl">
          {article.content ? (
            getArticleParagraphs(article.content).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>No content provided.</p>
          )}
        </div>
      </div>
    </article>
  );
}
