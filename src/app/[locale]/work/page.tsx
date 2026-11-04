import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/layout/JsonLd';
import StackCards from '@/components/work/StackCards';
import { techLabel } from '@/data/tech';
import type { Locale } from '@/i18n/routing';
import { getWorks } from '@/lib/contentful';
import { languageAlternates, localeUrl } from '@/lib/site';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[locale]/work'>): Promise<Metadata> {
    const { locale } = (await params) as { locale: Locale };
    const t = await getTranslations({ locale, namespace: 'meta' });
    return {
        title: t('workTitle'),
        description: t('workDescription'),
        alternates: { canonical: localeUrl(locale, '/work'), languages: languageAlternates('/work') },
        openGraph: { title: t('workTitle'), description: t('workDescription'), url: localeUrl(locale, '/work') },
    };
}

export default async function WorkPage({ params }: PageProps<'/[locale]/work'>) {
    const { locale } = (await params) as { locale: Locale };
    setRequestLocale(locale);
    const [t, works] = await Promise.all([getTranslations({ locale, namespace: 'work' }), getWorks()]);

    const list = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: works.map((w, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'CreativeWork',
                name: w.title,
                url: w.url || undefined,
                description: w.summary || undefined,
                image: w.image?.src,
                keywords: w.tech.map((id) => techLabel(id)).join(', '),
            },
        })),
    };

    return (
        <>
            <header className="wrap pb-12 pt-36 md:pb-20 md:pt-44">
                <h1 className="display text-[clamp(3rem,10vw,9rem)] leading-[0.9]">{t('title')}</h1>
                <p className="prose-measure mt-8 text-lead text-mist">{t('intro')}</p>
            </header>

            {works.length === 0 ? (
                <p className="wrap pb-32 text-lead text-mist">{t('empty')}</p>
            ) : (
                    <StackCards className="wrap pb-[30vh]">
                        {works.map((w, i) => (
                            <li
                                key={w.id}
                                id={w.slug}
                                className="stack-item sticky top-[10rem] mb-[12vh] scroll-mt-40 last:mb-0"
                            >
                                <article className="stack-card relative grid origin-top will-change-transform overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 md:h-[min(calc(100svh-13rem),40rem)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                                    <div className="flex flex-col p-6 sm:p-8 md:p-12">
                                        <p className="num text-small text-accent">
                                            {String(i + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
                                        </p>
                                        <h2 className="mt-4 text-[clamp(1.9rem,3.4vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                                            {w.title}
                                        </h2>
                                        {w.description && (
                                            <div className="work-desc mt-5 line-clamp-4 text-mist md:line-clamp-6">
                                                {documentToReactComponents(w.description)}
                                            </div>
                                        )}
                                        <p className="mt-5 text-small text-paper">
                                            {w.tech.map((id) => techLabel(id)).join(', ')}
                                        </p>
                                        {w.url && (
                                            <a
                                                href={w.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost mt-8 self-start text-paper md:mt-auto"
                                            >
                                                {t('visit')}
                                                <span className="sr-only">: {w.title}</span>
                                            </a>
                                        )}
                                    </div>
                                    <div className="stack-media relative -order-1 aspect-[16/10] overflow-hidden md:order-none md:aspect-auto md:h-full">
                                        {w.image && (
                                            <Image
                                                src={w.image.src}
                                                alt={t('screenshot', { title: w.title })}
                                                fill
                                                sizes="(min-width: 48rem) 58vw, 100vw"
                                                priority={i === 0}
                                                className="object-cover object-top"
                                            />
                                        )}
                                    </div>
                                    <div aria-hidden="true" className="stack-shade pointer-events-none absolute inset-0 bg-black opacity-0" />
                                </article>
                            </li>
                        ))}
                    </StackCards>
            )}
            <JsonLd data={list} />
        </>
    );
}
