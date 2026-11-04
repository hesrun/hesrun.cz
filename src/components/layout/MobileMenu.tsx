'use client';

import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { lockScroll } from '@/lib/scroll';
import { PERSON } from '@/lib/site';

const noopSubscribe = () => () => {};

type NavLink = { href: string; label: string; active: boolean };

/**
 * Below 640px the navigation lives behind a burger. The panel opens as a
 * circle that grows out of the button until it covers the screen, and
 * closes back into it.
 */
export default function MobileMenu({
    links,
    pathname,
    otherLocale,
}: {
    links: NavLink[];
    pathname: string;
    otherLocale: 'en' | 'cs';
}) {
    const t = useTranslations('nav');
    const [open, setOpen] = useState(false);
    // The header uses backdrop-filter, which would trap a fixed child; render the panel in <body>.
    const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
    const host = mounted ? document.body : null;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const origin = () => {
        const r = buttonRef.current!.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        return { x, y, radius };
    };

    const animate = useCallback((toOpen: boolean) => {
        const panel = panelRef.current;
        if (!panel) return;
        const { x, y, radius } = origin();
        const items = panel.querySelectorAll('.menu-item');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const closed = `circle(0px at ${x}px ${y}px)`;
        const full = `circle(${radius}px at ${x}px ${y}px)`;

        tlRef.current?.kill();
        if (reduce) {
            gsap.set(panel, { clipPath: toOpen ? 'none' : closed, autoAlpha: toOpen ? 1 : 0 });
            gsap.set(items, { autoAlpha: 1, y: 0 });
            return;
        }

        const tl = gsap.timeline();
        if (toOpen) {
            tl.set(panel, { autoAlpha: 1, clipPath: closed })
                .to(panel, { clipPath: full, duration: 0.75, ease: 'power3.inOut' })
                .fromTo(
                    items,
                    { autoAlpha: 0, y: 28 },
                    { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 },
                    0.35,
                )
                .set(panel, { clipPath: 'none' });
        } else {
            tl.set(panel, { clipPath: full })
                .to(items, { autoAlpha: 0, duration: 0.18, ease: 'power1.in' })
                .to(panel, { clipPath: closed, duration: 0.55, ease: 'power3.inOut' }, 0.08)
                .set(panel, { autoAlpha: 0 });
        }
        tlRef.current = tl;
    }, []);

    const openRef = useRef(false);
    const setMenu = useCallback(
        (next: boolean) => {
            if (openRef.current === next) return;
            openRef.current = next;
            setOpen(next);
            animate(next);
            lockScroll(next);
        },
        [animate],
    );

    // Keep focus inside: the rest of the page is inert while the menu is open.
    useEffect(() => {
        const outside = [document.getElementById('main'), document.querySelector('footer')];
        outside.forEach((el) => el && (el.inert = open));
        if (open) panelRef.current?.querySelector<HTMLElement>('a')?.focus();
        return () => outside.forEach((el) => el && (el.inert = false));
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenu(false);
                buttonRef.current?.focus();
            }
        };
        const mq = window.matchMedia('(min-width: 40rem)');
        const onWide = () => mq.matches && setMenu(false);
        window.addEventListener('keydown', onKey);
        mq.addEventListener('change', onWide);
        return () => {
            window.removeEventListener('keydown', onKey);
            mq.removeEventListener('change', onWide);
        };
    }, [open, setMenu]);

    // Navigating to another page closes the menu.
    useEffect(() => {
        setMenu(false);
    }, [pathname, setMenu]);

    useEffect(() => () => lockScroll(false), []);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setMenu(!open)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t('close') : t('open')}
                className="relative -mr-2 flex size-11 cursor-pointer items-center justify-center rounded-full sm:hidden"
            >
                <span aria-hidden="true" className="relative block h-3 w-6">
                    <span
                        className={`absolute left-0 h-[1.5px] w-full bg-paper transition-transform duration-300 ${
                            open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                        }`}
                    />
                    <span
                        className={`absolute left-0 h-[1.5px] bg-paper transition-all duration-300 ${
                            open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-4'
                        }`}
                    />
                </span>
            </button>

            {host &&
                createPortal(
            <div
                ref={panelRef}
                id="mobile-menu"
                inert={!open}
                className="invisible fixed inset-0 z-30 overflow-hidden bg-ink-2 opacity-0 sm:hidden"
            >
                <div aria-hidden="true" className="glow -bottom-[20vh] -right-[40vw] h-[60vh] w-[110vw] opacity-50" />
                <nav aria-label={t('label')} className="wrap relative flex h-full flex-col pb-10 pt-24">
                    <ul>
                        {links.map((l) => (
                            <li key={l.href} className="menu-item border-b border-line">
                                <Link
                                    href={l.href}
                                    onClick={() => setMenu(false)}
                                    aria-current={l.active ? 'page' : undefined}
                                    className={`display block py-4 text-[clamp(2rem,10vw,2.75rem)] ${
                                        l.active ? 'text-accent' : 'text-paper'
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="menu-item mt-auto flex flex-col gap-5 text-mist">
                        <Link
                            href={pathname}
                            locale={otherLocale}
                            hrefLang={otherLocale}
                            onClick={() => setMenu(false)}
                            className="self-start text-lead text-paper"
                        >
                            {t('switchTo')}
                        </Link>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-small">
                            <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                            <a href={PERSON.github} target="_blank" rel="me noopener">
                                GitHub
                            </a>
                            <a href={PERSON.linkedin} target="_blank" rel="me noopener">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </nav>
            </div>,
                    host,
                )}
        </>
    );
}
