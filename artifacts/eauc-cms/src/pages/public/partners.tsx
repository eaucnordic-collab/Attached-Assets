import { useListPartners } from '@workspace/api-client-react';
import { PublicLayout } from '@/components/public-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

export default function PublicPartners() {
  const { data: partners, isLoading } = useListPartners();

  const byCategory = partners
    ? partners.filter(p => p.visible).reduce<Record<string, typeof partners>>((acc, p) => {
        const cat = p.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
      }, {})
    : {};

  return (
    <PublicLayout>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            A growing network of institutions and organisations committed to sustainability in higher education.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : Object.keys(byCategory).length > 0 ? (
            Object.entries(byCategory).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground border-b pb-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((partner) => (
                    <div key={partner.id} className="border rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow bg-secondary/10">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-14 object-contain mb-3" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold mb-3">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="font-semibold text-sm mb-1">{partner.name}</h3>
                      {partner.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{partner.description}</p>
                      )}
                      {partner.url && (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs flex items-center gap-1 hover:underline mt-auto"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">No partners listed yet.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Become a Partner</h2>
          <p className="text-muted-foreground mb-6">
            Join EAUC Nordic's growing network and accelerate sustainability in your institution.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
