import type Lenis from 'lenis';

/** The page's Lenis instance, shared so overlays can pause smooth scrolling. */
let current: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
    current = lenis;
}

export function getLenis() {
    return current;
}

/** Locks page scroll (Lenis and native) while an overlay is open. */
export function lockScroll(locked: boolean) {
    if (locked) current?.stop();
    else current?.start();
    document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/**
 * Jump instantly to the URL hash target (or the top) on a freshly rendered
 * page. Positions come from the real layout, then Lenis is synced to them,
 * so a stale Lenis position from the previous page can't throw it off.
 */
export function jumpToHashOrTop(offset = 72) {
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(decodeURIComponent(hash)) : null;
    const top = target ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset) : 0;
    window.scrollTo(0, top);
    current?.resize();
    current?.scrollTo(top, { immediate: true, force: true });
}
