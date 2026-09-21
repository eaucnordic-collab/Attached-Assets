import { useListProjects } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PublicLayout } from '@/components/public-layout';
import { getPublicLang, localizedHref } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';
import type { Lang } from '@/lib/i18n';

const SEO_BY_LANG: Record<Lang, { title: string; description: string }> = {
  da: { title: 'Projekter | EAUC Nordic', description: 'Se EAUC Nordics projekter, der fremmer bæredygtighed og grøn energi i Norden.' },
  uk: { title: 'Проєкти | EAUC Nordic', description: 'Дізнайтеся про проєкти EAUC Nordic, що розвивають сталий розвиток і зелену енергетику в країнах Північної Європи.' },
  en: { title: 'Projects | EAUC Nordic', description: 'Discover EAUC Nordic projects advancing sustainability and green energy across the Nordic region.' },
};

export default function Projects() {
  const lang = getPublicLang();
  usePublicSeo(lang, SEO_BY_LANG[lang].title, SEO_BY_LANG[lang].description);
  const { data: projects, isLoading } = useListProjects();

  return (
    <PublicLayout><div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Projects</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Discover how we're advancing sustainability and green energy through targeted initiatives across the Nordic region.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-[-40px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
              </Card>
            ))
          ) : projects?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-white rounded-xl shadow-sm">
              No projects found.
            </div>
          ) : (
            projects?.map((project) => (
              <Card key={project.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow flex flex-col group">
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {project.images && project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40 font-medium">No Image</div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'} className="capitalize bg-white/90 text-primary hover:bg-white">
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{project.title}</h3>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600 line-clamp-3 text-sm">{project.shortDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5" asChild>
                     <Link href={localizedHref(`/projects/${project.id}`, lang)}>
                      View Project <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div></PublicLayout>
  );
}
