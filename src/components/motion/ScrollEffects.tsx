'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Scroll-driven motion for server-rendered sections, declared with data
 * attributes so the markup stays plain HTML for search engines:
 *
 * - `data-fx="title"`   characters rise out of a mask as the heading scrolls in
 * - `data-fx="words"`   words light up one by one while the paragraph passes
 * - `data-fx="rise"`    block drifts up and fades in, tied to scroll
 * - `data-fx="marquee"` row slides sideways with scroll (`data-dir="1|-1"`)
 * - `data-fx="focus"`   full opacity only while near the middle of the screen
 * - `data-fx="grow"`    scales up to full size as it enters
 * - `data-count`        number counts up from 0 when it comes into view
 *
 * Nothing runs with reduced motion; content is visible by default.
 */
export default function ScrollEffects({ children }: { children: React.ReactNode }) {
    const scope = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const q = gsap.utils.selector(scope);
                const splits: SplitText[] = [];

                q('[data-fx="title"]').forEach((el: HTMLElement) => {
                    const split = SplitText.create(el, { type: 'lines,chars', mask: 'lines' });
                    splits.push(split);
                    gsap.from(split.chars, {
                        yPercent: 110,
                        stagger: 0.015,
                        ease: 'none',
                        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 60%', scrub: 0.6 },
                    });
                });

                q('[data-fx="words"]').forEach((el: HTMLElement) => {
                    const split = SplitText.create(el, { type: 'words' });
                    splits.push(split);
                    gsap.fromTo(
                        split.words,
                        { opacity: 0.14 },
                        {
                            opacity: 1,
                            stagger: 0.1,
                            ease: 'none',
                            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
                        },
                    );
                });

                q('[data-fx="rise"]').forEach((el: HTMLElement) => {
                    gsap.fromTo(
                        el,
                        { y: 90, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            ease: 'none',
                            scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 62%', scrub: 0.6 },
                        },
                    );
                });

                q('[data-fx="marquee"]').forEach((el: HTMLElement) => {
                    const dir = Number(el.dataset.dir ?? 1);
                    gsap.fromTo(
                        el,
                        { xPercent: dir > 0 ? -22 : 0 },
                        {
                            xPercent: dir > 0 ? 0 : -22,
                            ease: 'none',
                            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
                        },
                    );
                });

                q('[data-fx="focus"]').forEach((el: HTMLElement) => {
                    gsap.set(el, { opacity: 0.22 });
                    ScrollTrigger.create({
                        trigger: el,
                        start: 'top 62%',
                        end: 'bottom 38%',
                        onToggle: ({ isActive }) =>
                            gsap.to(el, { opacity: isActive ? 1 : 0.22, duration: 0.5, ease: 'power2.out' }),
                    });
                });

                q('[data-fx="grow"]').forEach((el: HTMLElement) => {
                    gsap.fromTo(
                        el,
                        { scale: 0.82, opacity: 0.3 },
                        {
                            scale: 1,
                            opacity: 1,
                            ease: 'none',
                            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
                        },
                    );
                });

                q('[data-count]').forEach((el: HTMLElement) => {
                    const to = Number(el.dataset.count);
                    const state = { v: 0 };
                    el.textContent = '0';
                    gsap.to(state, {
                        v: to,
                        duration: 1.6,
                        ease: 'power3.out',
                        onUpdate: () => (el.textContent = String(Math.round(state.v))),
                        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                    });
                });

                return () => splits.forEach((s) => s.revert());
            });

            // Fonts change line breaks; measure again once they are in.
            document.fonts?.ready.then(() => ScrollTrigger.refresh());
            return () => mm.revert();
        },
        { scope },
    );

    return <div ref={scope}>{children}</div>;
}
