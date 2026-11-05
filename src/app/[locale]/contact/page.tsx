import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CollabForm from '@/components/contact/CollabForm';
import { Envelope, GitHub, LinkedIn } from '@/components/icons/social';
import type { Locale } from '@/i18n/routing';
import { PERSON, languageAlternates, localeUrl } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
    const { locale } = (await params) as { locale: Locale };
    const t = await getTranslations({ locale, namespace: 'meta' });
    return {
        title: t('contactTitle'),
        description: t('contactDescription'),
        alternates: { canonical: localeUrl(locale, '/contact'), languages: languageAlternates('/contact') },
        openGraph: {
            title: t('contactTitle'),
            description: t('contactDescription'),
            url: localeUrl(locale, '/contact'),
        },
    };
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
    const { locale } = (await params) as { locale: Locale };
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'contact' });

    const links = [
        { href: `mailto:${PERSON.email}`, label: PERSON.email, icon: Envelope },
        { href: PERSON.linkedin, label: 'LinkedIn', icon: LinkedIn },
        { href: PERSON.github, label: 'GitHub', icon: GitHub },
    ];

    return (
        <div className="wrap grid gap-16 pb-28 pt-36 md:pt-44 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
            <div>
                <h1 className="display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.92]">{t('title')}</h1>
                <p className="prose-measure mt-8 text-lead text-mist">{t('intro')}</p>

                <h2 className="mt-14 text-small text-mist">{t('direct')}</h2>
                <ul className="mt-4 grid gap-3">
                    {links.map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                            <a
                                href={href}
                                {...(href.startsWith('http') ? { target: '_blank', rel: 'me noopener' } : {})}
                                className="inline-flex items-center gap-3 text-lead transition-colors hover:text-accent"
                            >
                                <Icon className="size-4 text-accent" />
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <p className="mt-10 text-small text-mist">{t('location')}</p>
            </div>
            <CollabForm />
        </div>
    );
}
