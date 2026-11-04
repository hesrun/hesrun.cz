'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** How many cards stay visible behind the front one. */
const VISIBLE_BEHIND = 5;
/** Per step back: how much a card shrinks, rises, blurs and darkens. */
const STEP = { scale: 0.05, rise: 17, blur: 1.1, shade: 0.1 };
/** Where cards stick, in px from the top of the viewport (matches `top` in the markup). */
const STICK = 160;

/**
 * Stacking cards: every card sticks at the same spot, and each card that
 * slides over it pushes it one step back: smaller, higher (so its top edge
 * shows as a step), blurrier and darker. Only the last few steps stay
 * visible; deeper cards fade out. Stickiness is plain CSS; GSAP drives depth.
 */
export default function StackCards({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const root = useRef<HTMLOListElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const items = gsap.utils.toArray<HTMLElement>('.stack-item', root.current);
                const cards = items.map((item) => item.querySelector<HTMLElement>('.stack-card')!);
                const shades = items.map((item) => item.querySelector<HTMLElement>('.stack-shade')!);
                // progress[j]: how far card j has slid over the stack (0 → 1).
                const progress = items.map(() => 0);

                const apply = () => {
                    let depth = 0;
                    // Walk from the last card back: each card's depth is the sum of
                    // the progress of every card that came after it.
                    for (let i = items.length - 1; i >= 0; i--) {
                        const d = Math.min(depth, VISIBLE_BEHIND + 1);
                        const fade = d > VISIBLE_BEHIND ? 1 - (d - VISIBLE_BEHIND) : 1;
                        gsap.set(cards[i], {
                            scale: 1 - d * STEP.scale,
                            y: -d * STEP.rise,
                            filter: d > 0.01 ? `blur(${(d * STEP.blur).toFixed(2)}px)` : 'none',
                            autoAlpha: Math.max(0, fade),
                        });
                        gsap.set(shades[i], { opacity: Math.min(0.85, d * STEP.shade) });
                        depth += progress[i];
                    }
                };

                items.forEach((item, j) => {
                    if (j === 0) return;
                    ScrollTrigger.create({
                        trigger: item,
                        start: 'top bottom',
                        end: `top top+=${STICK}`,
                        onUpdate: (self) => {
                            progress[j] = self.progress;
                            apply();
                        },
                        onRefresh: (self) => {
                            progress[j] = self.progress;
                            apply();
                        },
                    });
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
