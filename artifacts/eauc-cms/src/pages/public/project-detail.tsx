import { useParams, Link } from 'wouter';
import { useGetProject } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { PublicLayout } from '@/components/public-layout';
import { formatPublicDate, getPublicLang, localizedHref } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';

export default function ProjectDetail() {
  const lang = getPublicLang();
  const params = useParams();
  const id = Number(params.id);
  const { data: project, isLoading } = useGetProject(id, { query: { enabled: !!id, queryKey: ['/api/projects', id] } });
  usePublicSeo(
    lang,
    project ? `${project.title} | EAUC Nordic` : 'Project details | EAUC Nordic',
    project?.shortDescription || 'Project details and opportunities to support EAUC Nordic sustainability initiatives.',
  );

  if (isLoading) {
    return (
      <PublicLayout><div className="container mx-auto px-4 py-16">
        <Skeleton className="h-8 w-24 mb-8" />
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-12" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-12" />
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div></PublicLayout>
    );
  }

  if (!project) {
    return (
      <PublicLayout><div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <Button asChild><Link href={localizedHref('/projects', lang)}>Back to Projects</Link></Button>
      </div></PublicLayout>
    );
  }

  return (
    <PublicLayout><article className="pb-24">
      <div className="bg-gray-50 py-12 md:py-16 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" size="sm" className="mb-8 -ml-3 gap-2" asChild>
            <Link href={localizedHref('/projects', lang)}><ArrowLeft className="w-4 h-4" /> All Projects</Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize">
              {project.status}
            </Badge>
            {project.featured && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Featured</Badge>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">{project.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">{project.shortDescription}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {project.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                   {formatPublicDate(project.startDate, lang)}
                   {project.endDate ? ` - ${formatPublicDate(project.endDate, lang)}` : ' - Present'}
                </span>
              </div>
            )}
            {project.partners && project.partners.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{project.partners.length} Partners</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {project.images && project.images.length > 0 && (
          <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden mb-16 shadow-lg bg-gray-100">
            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 prose prose-lg max-w-none text-gray-700">
            {project.fullDescription ? (
              project.fullDescription.split('\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>No full description provided.</p>
            )}
          </div>
          
          <div className="space-y-8">
            {project.buttonLabel && project.buttonUrl && (
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-bold text-gray-900 mb-4">Get Involved</h3>
                <Button className="w-full rounded-full" size="lg" asChild>
                  <a href={project.buttonUrl} target="_blank" rel="noopener noreferrer">{project.buttonLabel}</a>
                </Button>
              </div>
            )}
            
            {project.partners && project.partners.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Project Partners</h3>
                <ul className="space-y-3">
                  {project.partners.map((partner, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article></PublicLayout>
  );
}
