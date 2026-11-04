import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import JsonLd from '@/components/layout/JsonLd';
import PageTransition from '@/components/motion/PageTransition';
import SmoothScroll from '@/components/motion/SmoothScroll';
import { routing } from '@/i18n/routing';
import { PERSON, SITE_URL, localeUrl } from '@/lib/site';
import '../globals.css';

const archivo = Archivo({
    subsets: ['latin', 'latin-ext'],
    axes: ['wdth'],
    variable: '--font-archivo',
    display: 'swap',
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
    themeColor: '#000000',
    colorScheme: 'dark',
};

export async function generateMetadata({
    params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'meta' });

    return {
        metadataBase: new URL(SITE_URL),
        title: t('homeTitle'),
        description: t('homeDescription'),
        applicationName: 'Hesrun',
        authors: [{ name: PERSON.name, url: SITE_URL }],
        creator: PERSON.name,
        openGraph: {
            siteName: 'Hesrun',
            type: 'website',
            locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
            alternateLocale: locale === 'cs' ? 'en_US' : 'cs_CZ',
        },
        twitter: { card: 'summary_large_image' },
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
                { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            ],
            apple: '/apple-touch-icon.png',
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: LayoutProps<'/[locale]'>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'meta' });
    const tNav = await getTranslations({ locale, namespace: 'nav' });

    const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: PERSON.name,
        jobTitle: t('jobTitle'),
        url: localeUrl(locale),
        image: `${SITE_URL}/my-self.jpeg`,
        email: `mailto:${PERSON.email}`,
        sameAs: [PERSON.github, PERSON.linkedin],
        knowsAbout: [
            'React',
            'Next.js',
            'TypeScript',
            'GSAP',
            'Three.js',
            'Web performance',
            'Technical SEO',
            'AI-assisted development',
        ],
    };

    return (
        <html lang={locale} className={archivo.variable} suppressHydrationWarning>
            <head>
                {/* Lets CSS hide the hero before its load animation, without a flash. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "document.documentElement.classList.add('js')",
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                    <a
                        href="#main"
                        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink-2"
                    >
                        {tNav('skip')}
                    </a>
                    <Header />
                    <main id="main">{children}</main>
                    <Footer />
                    <SmoothScroll />
                    <PageTransition />
                </NextIntlClientProvider>
                <JsonLd data={person} />
            </body>
        </html>
    );
}
