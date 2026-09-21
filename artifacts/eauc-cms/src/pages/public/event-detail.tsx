import { useParams, Link } from 'wouter';
import { useGetEvent } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Building } from 'lucide-react';
import { PublicLayout } from '@/components/public-layout';
import { formatPublicDate, getPublicLang, localizedHref } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';

export default function EventDetail() {
  const lang = getPublicLang();
  const params = useParams();
  const id = Number(params.id);
  const { data: event, isLoading } = useGetEvent(id, { query: { enabled: !!id, queryKey: ['/api/events', id] } });
  usePublicSeo(
    lang,
    event ? `${event.title} | EAUC Nordic` : 'Event details | EAUC Nordic',
    event?.description || 'Event details and registration information from EAUC Nordic.',
  );

  if (isLoading) {
    return (
      <PublicLayout><div className="container mx-auto px-4 py-16 max-w-4xl">
        <Skeleton className="h-8 w-24 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div></PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout><div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Button asChild><Link href={localizedHref('/events', lang)}>Back to Events</Link></Button>
      </div></PublicLayout>
    );
  }

  const isPast = new Date(event.startDate) < new Date();

  return (
    <PublicLayout><div className="bg-gray-50 min-h-screen pb-24">
      {event.image && (
        <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-gray-900">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
      )}
      
      <div className={`container mx-auto px-4 max-w-5xl ${event.image ? 'mt-[-100px] relative z-10' : 'pt-16'}`}>
        <Button variant={event.image ? "secondary" : "ghost"} size="sm" className="mb-8 gap-2" asChild>
          <Link href={localizedHref('/events', lang)}><ArrowLeft className="w-4 h-4" /> All Events</Link>
        </Button>
        
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight ${event.image ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
          {event.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border-0 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">About this event</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {event.description ? (
                  event.description.split('\n').map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p>No description provided.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">Event Details</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">Date</div>
                    <div className="text-gray-600">
                      {formatPublicDate(event.startDate, lang)}
                      {event.endDate && ` - ${formatPublicDate(event.endDate, lang)}`}
                    </div>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Time</div>
                      <div className="text-gray-600">{event.time}</div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Location</div>
                      <div className="text-gray-600">
                        {event.location}
                        {event.address && <div className="text-sm mt-1">{event.address}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Capacity</div>
                      <div className="text-gray-600">{event.capacity} attendees</div>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Organizer</div>
                      <div className="text-gray-600">{event.organizer}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {!isPast && (
                <div className="p-6 pt-0">
                  <Button className="w-full rounded-full py-6 text-lg font-medium shadow-md" size="lg" disabled={!event.registrationUrl} asChild={!!event.registrationUrl}>
                    {event.registrationUrl ? (
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Register Now</a>
                    ) : (
                      <span>Registration Closed</span>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div></PublicLayout>
  );
}
