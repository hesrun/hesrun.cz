'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** How far the card underneath shrinks and darkens once the next one covers it. */
const BACK = { scale: 0.9, shade: 0.6 };
/** Where cards stick, in px from the top of the viewport (matches `top` in the markup). */
const STICK = 160;

/**
 * Cards stick at the same spot and slide over each other. While a card
 * arrives, the one underneath scales down a little and darkens. Only
 * transform and opacity are animated (no blur), so it stays cheap on phones.
 * Stickiness is plain CSS; GSAP scrubs the card underneath.
 */
export default function StackCards({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const root = useRef<HTMLOListElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const items = gsap.utils.toArray<HTMLElement>('.stack-item', root.current);

                items.forEach((item, j) => {
                    if (j === 0) return;
                    const under = items[j - 1];
                    gsap.timeline({
                        scrollTrigger: { trigger: item, start: 'top bottom', end: `top top+=${STICK}`, scrub: true },
                        defaults: { ease: 'none' },
                    })
                        .to(under.querySelector('.stack-card'), { scale: BACK.scale }, 0)
                        .to(under.querySelector('.stack-shade'), { opacity: BACK.shade }, 0);
                });

                // Each card's image settles in as the card arrives.
                gsap.utils.toArray<HTMLElement>('.stack-media img', root.current).forEach((img) => {
                    gsap.fromTo(
                        img,
                        { scale: 1.15 },
                        {
                            scale: 1,
                            ease: 'none',
                            scrollTrigger: { trigger: img, start: 'top bottom', end: 'top 30%', scrub: true },
                        },
                    );
                });
            });
            return () => mm.revert();
        },
        { scope: root },
    );

    return (
        <ol ref={root} className={className}>
            {children}
        </ol>
    );
}
