import { useState } from 'react';
import { useGetSettings, useListForms, useSubmitForm } from '@workspace/api-client-react';
import { PublicLayout } from '@/components/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { getPublicLang, localizedHref } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';

export default function PublicContact() {
  const lang = getPublicLang();
  usePublicSeo(lang, 'Contact EAUC Nordic', 'Contact EAUC Nordic about volunteering, partnerships and support for Ukraine.');
  const { data: settings } = useGetSettings();
  const { data: forms } = useListForms();
  const contactForm = forms && forms.length > 0 ? forms[0] : null;
  const submitMutation = useSubmitForm();

  const [formData, setFormData] = useState<Record<string, string>>({
    name: '', email: '', organization: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm) return;
    submitMutation.mutate(
      { id: contactForm.id, data: { data: { ...formData, privacyConsent: 'accepted', consentedAt: new Date().toISOString() } } },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success('Message sent!');
        },
        onError: () => toast.error('Failed to send message. Please try again.'),
      }
    );
  };

  return (
    <PublicLayout>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90">We'd love to hear from you. Reach out to the EAUC Nordic team.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-semibold">Message Received</h3>
                <p className="text-muted-foreground">
                  {contactForm?.successMessage || 'Thank you for your message. We will get back to you soon.'}
                </p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setPrivacyConsent(false); setFormData({ name: '', email: '', organization: '', message: '' }); }}>
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" autoComplete="name" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} required placeholder="Your name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" autoComplete="email" type="email" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} required placeholder="your@email.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" name="organization" autoComplete="organization" value={formData.organization} onChange={e => setFormData(d => ({ ...d, organization: e.target.value }))} placeholder="Your institution" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))} required placeholder="How can we help?" rows={5} />
                </div>
                <div className="flex items-start gap-3">
                  <input id="privacy-consent" name="privacyConsent" type="checkbox" checked={privacyConsent} onChange={event => setPrivacyConsent(event.target.checked)} required className="mt-1 h-4 w-4" />
                  <Label htmlFor="privacy-consent" className="text-sm font-normal leading-6">
                    I agree to the processing of my personal data as described in the{' '}
                    <Link href={localizedHref('/privacy', lang)} className="font-medium text-primary underline">Privacy Policy</Link>.
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={submitMutation.isPending || !contactForm}>
                  {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <div className="space-y-5">
              {settings?.contactEmail && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-0.5">Email</div>
                    <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline text-sm">{settings.contactEmail}</a>
                  </div>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-0.5">Phone</div>
                    <a href={`tel:${settings.contactPhone}`} className="text-muted-foreground text-sm">{settings.contactPhone}</a>
                  </div>
                </div>
              )}
              {settings?.address && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-0.5">Address</div>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-secondary/20 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Membership Enquiries</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interested in joining EAUC Nordic? We welcome applications from universities and colleges across the Nordic region. Please reach out with a brief description of your institution and sustainability goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
