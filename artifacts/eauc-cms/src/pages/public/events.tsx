import { useListEvents } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/public-layout';
import { getPublicLang, localizedHref, DATE_LOCALE } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';
import type { Lang } from '@/lib/i18n';

const SEO_BY_LANG: Record<Lang, { title: string; description: string }> = {
  da: { title: 'Arrangementer | EAUC Nordic', description: 'Se kommende konferencer, webinarer og workshops om bæredygtighed i Norden.' },
  uk: { title: 'Події | EAUC Nordic', description: 'Дізнайтеся про майбутні конференції, вебінари та семінари зі сталого розвитку в країнах Північної Європи.' },
  en: { title: 'Events | EAUC Nordic', description: 'Upcoming conferences, webinars and workshops focused on sustainability in the Nordics.' },
};

export default function Events() {
  const lang = getPublicLang();
  usePublicSeo(lang, SEO_BY_LANG[lang].title, SEO_BY_LANG[lang].description);
  const { data: events, isLoading } = useListEvents();
  
  const upcoming = events?.filter(e => new Date(e.startDate) >= new Date() && e.status === 'published') || [];
  const past = events?.filter(e => new Date(e.startDate) < new Date() && e.status === 'published') || [];

  return (
    <PublicLayout><div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Events</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Join us for upcoming conferences, webinars, and workshops focused on sustainability in the Nordics.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-[-40px] relative z-10 max-w-5xl">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-sm border h-12 p-1">
              <TabsTrigger value="upcoming" className="rounded-md px-8 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past" className="rounded-md px-8 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">Past Events</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="space-y-6">
            {isLoading ? (
              <Skeleton className="h-[200px] w-full rounded-2xl" />
            ) : upcoming.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-0">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-500">Check back later for new events.</p>
              </div>
            ) : (
              upcoming.map((event) => (
                <EventCard key={event.id} event={event} lang={lang} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            {past.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border-0">
                <p className="text-gray-500">No past events to show.</p>
              </div>
            ) : (
              past.map((event) => (
                <EventCard key={event.id} event={event} past lang={lang} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div></PublicLayout>
  );
}

function EventCard({ event, past = false, lang }: { event: any, past?: boolean; lang: import('@/lib/i18n').Lang }) {
  const date = new Date(event.startDate);
  
  return (
    <Card className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group ${past ? 'opacity-80' : ''}`}>
      <div className="md:w-64 bg-primary/5 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
        <div className="text-primary font-bold text-sm uppercase tracking-wider mb-1">
          {date.toLocaleString(DATE_LOCALE[lang], { month: 'short' })}
        </div>
        <div className="text-5xl font-black text-gray-900 mb-1 leading-none">
          {date.getDate()}
        </div>
        <div className="text-gray-500 font-medium">
          {date.getFullYear()}
        </div>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
        <div className="flex flex-wrap gap-2 mb-3">
          {event.location && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 gap-1 font-medium">
              <MapPin className="w-3 h-3" /> {event.location}
            </Badge>
          )}
          {event.time && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 gap-1 font-medium">
              <Clock className="w-3 h-3" /> {event.time}
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
           <Link href={localizedHref(`/events/${event.id}`, lang)}>{event.title}</Link>
        </h3>
        {event.description && <p className="text-gray-600 line-clamp-2 mb-6">{event.description}</p>}
        <div className="mt-auto">
          <Button variant={past ? "outline" : "default"} className="rounded-full px-6" asChild>
             <Link href={localizedHref(`/events/${event.id}`, lang)}>
              {past ? 'View Recap' : 'Event Details'} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
