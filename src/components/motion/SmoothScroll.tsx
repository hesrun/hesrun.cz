'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { jumpToHashOrTop, setLenis } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const lenis = new Lenis({ autoRaf: false, anchors: { offset: -72 }, lerp: 0.11 });
        lenisRef.current = lenis;
        setLenis(lenis);
        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            lenisRef.current = null;
            setLenis(null);
        };
    }, []);

    // New page: jump to the top (or the hash target) and re-measure triggers.
    useEffect(() => {
        jumpToHashOrTop();
        const id = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            jumpToHashOrTop();
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return null;
}
