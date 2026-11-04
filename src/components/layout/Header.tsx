'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import Mark from './Mark';
import MobileMenu from './MobileMenu';

export default function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const other = locale === 'en' ? 'cs' : 'en';

    // Only links that lead to another page; sections are reached by scrolling.
    const links = [
        { href: '/work', label: t('work') },
        { href: '/contact', label: t('contact') },
    ].map((l) => ({ ...l, active: pathname.startsWith(l.href) }));
    const menuLinks = [{ href: '/', label: t('home'), active: pathname === '/' }, ...links];

    // Transparent over the hero; the blurred bar fades in once the page scrolls.
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        const id = requestAnimationFrame(onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
                    scrolled ? 'border-line/60 bg-ink/70 backdrop-blur-md' : 'border-transparent bg-transparent backdrop-blur-none'
                }`}
            >
                <div className="wrap flex h-16 items-center gap-4">
                    <Link
                        href="/"
                        className="mr-auto flex items-center gap-2.5 text-paper"
                        aria-label={`Hesrun, ${t('home')}`}
                    >
                        <Mark className="size-7 text-accent" />
                        <span className="font-semibold tracking-tight [font-stretch:125%]">Hesrun</span>
                    </Link>
                    <nav aria-label={t('label')} className="hidden sm:block">
                        <ul className="flex items-center gap-7 text-[0.9375rem]">
                            {links.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        aria-current={l.active ? 'page' : undefined}
                                        className={`py-2 transition-colors hover:text-accent ${
                                            l.active ? 'text-accent' : 'text-paper'
                                        }`}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <Link
                        href={pathname}
                        locale={other}
                        hrefLang={other}
                        aria-label={t('switchLabel')}
                        className="ml-3 hidden border-l border-line pl-4 text-[0.9375rem] text-mist transition-colors hover:text-accent sm:block"
                    >
                        {other === 'cs' ? 'CZ' : 'EN'}
                    </Link>
                    <MobileMenu links={menuLinks} pathname={pathname} otherLocale={other} />
                </div>
            </header>
        </>
    );
}
