import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/layout/JsonLd';
import ScrollEffects from '@/components/motion/ScrollEffects';
import Spine from '@/components/motion/Spine';
import Cta from '@/components/sections/Cta';
import Experience from '@/components/sections/Experience';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Skills from '@/components/sections/Skills';
import { SERVICE_KEYS } from '@/data/services';
import type { Locale } from '@/i18n/routing';
import { PERSON, SITE_URL, languageAlternates, localeUrl } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
    const { locale } = (await params) as { locale: Locale };
    const t = await getTranslations({ locale, namespace: 'meta' });
    return {
        title: t('homeTitle'),
        description: t('homeDescription'),
        alternates: { canonical: localeUrl(locale), languages: languageAlternates() },
        openGraph: { title: t('homeTitle'), description: t('homeDescription'), url: localeUrl(locale) },
    };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
    const { locale } = (await params) as { locale: Locale };
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'services' });


    const service = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: `${PERSON.name}, ${t('title')}`,
        url: localeUrl(locale),
        email: PERSON.email,
        provider: { '@id': `${SITE_URL}/#person` },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: t('title'),
            itemListElement: SERVICE_KEYS.map((key) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: t(`items.${key}.title`),
                    description: t(`items.${key}.text`),
                },
            })),
        },
    };

    return (
        <ScrollEffects>
            <Hero />
            <Spine>
                <Experience />
            </Spine>
            <Skills />
            <Spine>
                <Services />
            </Spine>
            <Cta />
            <JsonLd data={service} />
        </ScrollEffects>
    );
}
