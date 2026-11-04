import type { MetadataRoute } from 'next';
import { languageAlternates, localeUrl } from '@/lib/site';

const PAGES = [
    { path: '/', priority: 1 },
    { path: '/work', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return PAGES.flatMap(({ path, priority }) =>
        (['en', 'cs'] as const).map((locale) => ({
            url: localeUrl(locale, path),
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: locale === 'en' ? priority : priority - 0.1,
            alternates: { languages: languageAlternates(path) },
        })),
    );
}
