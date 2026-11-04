import type { Locale } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hesrun.cz'
).replace(/\/$/, '');

export const PERSON = {
    name: 'Vladyslav Otroshchenko',
    email: 'info@hesrun.cz',
    github: 'https://github.com/hesrun',
    linkedin: 'https://linkedin.com/in/vladyslav-otroshchenko',
};

/** Absolute URL for a path in a given locale (EN has no prefix). */
export function localeUrl(locale: Locale, path = '/') {
    const clean = path === '/' ? '' : path;
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}

/** hreflang map for `alternates.languages` in metadata. */
export function languageAlternates(path = '/') {
    return {
        en: localeUrl('en', path),
        cs: localeUrl('cs', path),
        'x-default': localeUrl('en', path),
    };
}
