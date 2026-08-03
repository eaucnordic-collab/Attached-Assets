import { Block, useListNews, useListProjects, useListEvents, useListPartners, useListTeamMembers } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col">
      {blocks.filter(b => b.visible).map(block => (
        <BlockComponent key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockComponent({ block }: { block: Block }) {
  const content = (block.content || {}) as Record<string, unknown>;

  switch (block.type) {
    case 'hero':
      return <HeroBlock content={content} />;
    case 'text':
      return <TextBlock content={content} />;
    case 'image_text':
      return <ImageTextBlock content={content} />;
    case 'cards':
      return <CardsBlock content={content} />;
    case 'news':
      return <NewsBlock content={content} />;
    case 'projects':
      return <ProjectsBlock content={content} />;
    case 'events':
      return <EventsBlock content={content} />;
    case 'partners':
      return <PartnersBlock content={content} />;
    case 'team':
      return <TeamBlock content={content} />;
    case 'cta':
      return <CtaBlock content={content} />;
    default:
      return (
        <section className="py-12 border-y bg-gray-50 border-dashed text-center">
          <p className="text-muted-foreground">Block: {block.type}</p>
        </section>
      );
  }
}

function HeroBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="bg-primary text-white py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {content.heading as string || 'Welcome'}
          </h1>
          {content.subheading && (
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl leading-relaxed">
              {content.subheading as string}
            </p>
          )}
          {content.text && (
            <p className="text-lg opacity-85 mb-8">{content.text as string}</p>
          )}
          {content.ctaLabel && (
            <Button size="lg" variant="secondary" className="text-primary rounded-full px-8 font-semibold" asChild>
              <Link href={(content.ctaUrl as string) || '/about'}>
                {content.ctaLabel as string}
              </Link>
            </Button>
          )}
          {content.buttonLabel && !content.ctaLabel && (
            <Button size="lg" variant="secondary" className="text-primary rounded-full px-8 font-semibold" asChild>
              <Link href={(content.buttonUrl as string) || '/about'}>
                {content.buttonLabel as string}
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-overlay" />
    </section>
  );
}

function TextBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl font-bold mb-6 text-primary">{content.heading as string}</h2>
        )}
        <div className="prose prose-lg max-w-none text-muted-foreground">
          {(content.text as string)?.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageTextBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="py-16 md:py-24 bg-secondary/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-5">
            {content.heading && (
              <h2 className="text-3xl font-bold text-foreground">{content.heading as string}</h2>
            )}
            {content.text && (
              <p className="text-lg text-muted-foreground leading-relaxed">{content.text as string}</p>
            )}
            {content.buttonLabel && (
              <Button variant="outline" className="rounded-full" asChild>
                <Link href={(content.buttonUrl as string) || '/about'}>
                  {content.buttonLabel as string}
                </Link>
              </Button>
            )}
          </div>
          <div className="flex-1 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
            <img
              src={(content.imageUrl as string) || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CardsBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ title: string; text: string }>) || [];
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {content.heading && (
          <h2 className="text-3xl font-bold mb-10 text-center text-foreground">{content.heading as string}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.length > 0 ? items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-5">{i + 1}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.text}</p>
            </div>
          )) : [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border p-7 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-5">{i}</div>
              <h3 className="text-xl font-bold mb-2">Initiative {i}</h3>
              <p className="text-muted-foreground">Driving sustainable outcomes across our region with targeted focus and collaboration.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsBlock({ content }: { content: Record<string, unknown> }) {
  const limit = (content.limit as number) || 3;
  const { data: newsData } = useListNews();
  const posts = (newsData?.items || []).filter(n => n.status === 'published').slice(0, limit);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{content.heading as string || 'Latest News'}</h2>
            {content.subheading && <p className="text-muted-foreground mt-1">{content.subheading as string}</p>}
          </div>
          <Link href="/news" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-secondary/10">
              <div className="p-6">
                {post.category && (
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">{post.category}</span>
                )}
                <h3 className="font-semibold text-lg mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>}
                <p className="text-xs text-muted-foreground mt-3">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsBlock({ content }: { content: Record<string, unknown> }) {
  const { data: projects } = useListProjects();
  const featured = (projects || []).filter(p => p.featured).slice(0, 3);

  return (
    <section className="py-16 bg-secondary/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{content.heading as string || 'Featured Projects'}</h2>
            {content.subheading && <p className="text-muted-foreground mt-1">{content.subheading as string}</p>}
          </div>
          <Link href="/projects" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="h-2 w-12 bg-primary rounded-full mb-4" />
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3">{project.shortDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsBlock({ content }: { content: Record<string, unknown> }) {
  const { data: events } = useListEvents();
  const now = new Date().toISOString().split('T')[0];
  const upcoming = (events || []).filter(e => e.startDate >= (now || '')).slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{content.heading as string || 'Upcoming Events'}</h2>
            {content.subheading && <p className="text-muted-foreground mt-1">{content.subheading as string}</p>}
          </div>
          <Link href="/events" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {upcoming.map(event => (
            <Link key={event.id} href={`/events/${event.id}`} className="flex gap-6 p-5 border rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors group">
              <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                <span className="text-xs font-medium uppercase">
                  {new Date(event.startDate).toLocaleDateString('en', { month: 'short' })}
                </span>
                <span className="text-xl font-bold leading-none">
                  {new Date(event.startDate).getDate()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </span>
                  )}
                  {event.time && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {event.time}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersBlock({ content }: { content: Record<string, unknown> }) {
  const { data: partners } = useListPartners();
  const visible = (partners || []).filter(p => p.visible).slice(0, 8);

  return (
    <section className="py-16 bg-secondary/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">{content.heading as string || 'Our Partners'}</h2>
          {content.subheading && <p className="text-muted-foreground mt-2">{content.subheading as string}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visible.map(partner => (
            <div key={partner.id} className="bg-white border rounded-xl p-5 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-10 object-contain mb-2" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-2">
                  {partner.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/partners" className="text-primary hover:underline text-sm font-medium">
            View all partners →
          </Link>
        </div>
      </div>
    </section>
  );
}

function TeamBlock({ content }: { content: Record<string, unknown> }) {
  const { data: members } = useListTeamMembers();
  const visible = (members || []).filter(m => m.visible).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">{content.heading as string || 'Our Team'}</h2>
          {content.subheading && <p className="text-muted-foreground mt-2">{content.subheading as string}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {visible.map(member => (
            <div key={member.id} className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-3">
                {member.photo
                  ? <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  : member.name.charAt(0)}
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              {member.position && <p className="text-sm text-primary">{member.position}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {content.heading && <h2 className="text-3xl font-bold mb-4">{content.heading as string}</h2>}
        {content.text && <p className="text-lg opacity-90 mb-8">{content.text as string}</p>}
        {content.buttonLabel && (
          <Button size="lg" variant="secondary" className="text-primary rounded-full px-8 font-semibold" asChild>
            <Link href={(content.buttonUrl as string) || '/contact'}>
              {content.buttonLabel as string}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
