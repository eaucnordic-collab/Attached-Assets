import { PublicLayout } from '@/components/public-layout';
import { getPublicLang } from '@/lib/public-language';
import { usePublicSeo } from '@/lib/public-seo';

const COPY = {
  privacy: {
    da: ['Privatlivspolitik', 'Vi behandler kun personoplysninger, som du frivilligt sender via vores kontaktformular eller i forbindelse med en donation.', 'Oplysninger bruges til at besvare din henvendelse, administrere donationer og opfylde lovkrav. Vi videregiver ikke oplysninger til markedsføring.', 'Du kan kontakte os på eaucnordic@gmail.com for indsigt, rettelse eller sletning af dine oplysninger.'],
    uk: ['Політика конфіденційності', 'Ми обробляємо лише персональні дані, які ви добровільно надсилаєте через контактну форму або під час пожертвування.', 'Дані використовуються для відповіді на звернення, адміністрування пожертв і виконання вимог законодавства. Ми не передаємо їх для маркетингу.', 'Щоб отримати доступ, виправити або видалити свої дані, напишіть на eaucnordic@gmail.com.'],
    en: ['Privacy Policy', 'We process only the personal information you voluntarily provide through our contact form or when making a donation.', 'Information is used to respond to enquiries, administer donations and meet legal obligations. We do not share it for marketing.', 'Contact eaucnordic@gmail.com to request access, correction or deletion of your information.'],
  },
  cookies: {
    da: ['Cookiepolitik', 'Webstedet bruger kun nødvendige tekniske cookies og lokal lagring, som får sprogvalg og grundlæggende funktioner til at virke.', 'Betalingssiden leveres af Stripe, som kan anvende egne nødvendige sikkerheds- og betalingscookies.'],
    uk: ['Політика використання cookies', 'Сайт використовує лише необхідні технічні cookies і локальне сховище для вибору мови та базових функцій.', 'Платіжну сторінку надає Stripe, який може використовувати власні необхідні cookies для безпеки та оплати.'],
    en: ['Cookie Policy', 'This website uses only necessary technical cookies and local storage for language preferences and core functionality.', 'The payment page is provided by Stripe, which may use its own necessary security and payment cookies.'],
  },
} as const;

export function LegalPage({ type }: { type: 'privacy' | 'cookies' }) {
  const lang = getPublicLang();
  const [title, ...paragraphs] = COPY[type][lang];
  usePublicSeo(lang, `${title} | EAUC Nordic`, paragraphs[0]);
  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-5 py-20 md:py-28">
        <h1 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl">{title}</h1>
        <div className="space-y-5 text-base leading-8 text-slate-700">
          {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </PublicLayout>
  );
}