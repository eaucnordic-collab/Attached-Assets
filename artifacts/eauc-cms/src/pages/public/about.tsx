import { useListTeamMembers } from '@workspace/api-client-react';
import { PublicLayout } from '@/components/public-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Linkedin, Facebook, Instagram } from 'lucide-react';
import { getPublicLang } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';
import type { Lang } from '@/lib/i18n';

const SEO_BY_LANG: Record<Lang, { title: string; description: string }> = {
  da: { title: 'Om EAUC Nordic', description: 'Læs om EAUC Nordic, vores mission, værdier og team, der støtter en bæredygtig fremtid.' },
  uk: { title: 'Про EAUC Nordic', description: 'Дізнайтеся про EAUC Nordic, нашу місію, цінності та команду, яка підтримує сталий розвиток.' },
  en: { title: 'About EAUC Nordic', description: 'Learn about EAUC Nordic, our mission, values and team supporting sustainable higher education.' },
};

export default function PublicAbout() {
  const lang = getPublicLang();
  usePublicSeo(lang, SEO_BY_LANG[lang].title, SEO_BY_LANG[lang].description);
  const { data: members, isLoading } = useListTeamMembers();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EAUC Nordic</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            We support universities and colleges across the Nordic region in building a more sustainable future through education, research, and collaboration.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                EAUC Nordic is the Nordic branch of the European Alliance of Universities and Colleges for Sustainability. We work to embed sustainability at the heart of higher education — from curriculum design and campus operations to student culture and community partnerships.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our network spans Denmark, Norway, Sweden, Finland, and Iceland, connecting over 40 institutions committed to making higher education a driver of positive environmental and social change.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Member Institutions', value: '40+' },
                { label: 'Countries', value: '5' },
                { label: 'Active Projects', value: '12' },
                { label: 'Years Operating', value: '8' },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/30 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Collaboration', desc: 'We believe sustainable change happens through partnerships — across institutions, sectors, and borders.' },
              { title: 'Evidence-Based', desc: 'Our programmes are grounded in research and measured through rigorous impact assessment.' },
              { title: 'Inclusivity', desc: 'We champion sustainability solutions that are just, equitable, and accessible to all.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-lg mb-2 text-primary">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Our Team</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {members.filter(m => m.visible && m.name.trim() && m.position?.trim() && !/^(navn kommer|name pending|name coming|ім['’ʼ`´]?я (буде|буде пізніше|згодом))([\s.,!-].*)?$/iu.test(m.name.trim())).map((member) => (
                <div key={member.id} className="bg-secondary/10 rounded-xl overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="h-48 bg-primary/10 flex items-center justify-center">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    {member.position && <p className="text-primary text-sm font-medium mb-2">{member.position}</p>}
                    {member.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>}
                    <div className="flex gap-2">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                      {member.facebook && (
                        <a href={member.facebook} aria-label={`Facebook: ${member.name}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Facebook className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                      {member.instagram && (
                        <a href={member.instagram} aria-label={`Instagram: ${member.name}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Instagram className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No team members yet.</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
