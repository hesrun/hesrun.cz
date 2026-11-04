'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The page's one orchestrated entrance: headline lines rise out of their
 * masks, then the supporting lines settle in. CSS keeps everything visible
 * when JS is off or motion is reduced.
 */
export default function HeroIntro({ children }: { children: React.ReactNode }) {
    const scope = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const lines = gsap.utils.toArray<HTMLElement>('.hero-line');
            const reveals = gsap.utils.toArray<HTMLElement>('.hero-reveal');
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set([...lines, ...reveals], { opacity: 1 });
                return;
            }
            gsap.timeline({ delay: 0.15 })
                .fromTo(
                    lines,
                    { opacity: 1, yPercent: 110 },
                    { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12 },
                )
                .fromTo(
                    reveals,
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08 },
                    '-=0.75',
                );

            // Scrolling away: the copy sinks back and fades, the ghost word drifts slower.
            const section = scope.current?.closest('section');
            gsap.to('.hero-content', {
                yPercent: -18,
                scale: 0.92,
                opacity: 0,
                ease: 'none',
                scrollTrigger: { trigger: section, start: 'top top', end: 'bottom 20%', scrub: true },
            });
            gsap.to(section?.querySelector('.hero-ghost') ?? [], {
                yPercent: 40,
                ease: 'none',
                scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
            });
        },
        { scope },
    );

    return <div ref={scope}>{children}</div>;
}
