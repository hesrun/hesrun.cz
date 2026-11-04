'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

type Geometry = {
    w: number;
    h: number;
    top: string;
    line: string;
    bottom: string;
    topY: number;
    firstY: number;
    lineEndY: number;
    bottomY: number;
    dots: { x: number; y: number }[];
};

/**
 * A bracket-shaped line around one section, like "[": it comes in from the
 * left edge of the screen, turns down along the left margin, and at the end
 * of the section turns back and leaves to the left edge. It is drawn as you
 * scroll; elements marked `data-spine-node` get a dot that fills when the
 * line reaches them. Also draws `.rule[data-draw]` hairlines inside.
 */
export default function Spine({ children }: { children: React.ReactNode }) {
    const root = useRef<HTMLDivElement>(null);
    const [geo, setGeo] = useState<Geometry | null>(null);

    useEffect(() => {
        const el = root.current;
        if (!el) return;
        const measure = () => {
            const box = el.getBoundingClientRect();
            const anchor = el.querySelector<HTMLElement>('[data-spine-x]');
            const ax = anchor ? anchor.getBoundingClientRect().left - box.left : 24;
            const x = Math.round(ax + 6);
            const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-spine-node]'));
            const dots = nodes.map((n) => {
                const r = n.getBoundingClientRect();
                return { x, y: Math.round(r.top - box.top + Math.min(24, r.height / 2)) };
            });
            const w = Math.round(box.width);
            const h = Math.round(box.height);
            const firstY = dots[0]?.y ?? 200;
            const r = Math.min(56, Math.max(12, x));
            const topY = Math.max(8, firstY - 140);
            const bottomY = h - 40;
            const lineEndY = bottomY - r;
            const top = `M0 ${topY} L${Math.max(0, x - r)} ${topY} Q${x} ${topY} ${x} ${topY + r} L${x} ${firstY}`;
            const line = `M${x} ${firstY} L${x} ${lineEndY}`;
            const bottom = `M${x} ${lineEndY} Q${x} ${bottomY} ${Math.max(0, x - r)} ${bottomY} L0 ${bottomY}`;
            setGeo((prev) =>
                prev && prev.top === top && prev.bottom === bottom && prev.line === line && prev.dots.length === dots.length && prev.dots.every((p, i) => p.y === dots[i].y)
                    ? prev
                    : { w, h, top, line, bottom, topY, firstY, lineEndY, bottomY, dots },
            );
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        document.fonts?.ready.then(measure);
        return () => ro.disconnect();
    }, []);

    useGSAP(
        () => {
            if (!geo) return;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const el = root.current!;
            const dots = Array.from(el.querySelectorAll<SVGCircleElement>('.spine-dot'));
            const rules = Array.from(el.querySelectorAll<HTMLElement>('.rule[data-draw]'));

            if (reduce) {
                gsap.set(el.querySelectorAll('.spine-ink'), { drawSVG: '100%' });
                dots.forEach((d) => d.classList.add('is-on'));
                return;
            }

            const draw = (selector: string, start: string, end: string) =>
                gsap.fromTo(
                    el.querySelector(selector),
                    { drawSVG: '0%' },
                    {
                        drawSVG: '100%',
                        ease: 'none',
                        scrollTrigger: { trigger: root.current, start, end, scrub: 0.5 },
                    },
                );
            // Top arm comes in from the left edge, the long stroke keeps its tip on
            // the 70% viewport line, the bottom arm turns back out to the left edge.
            draw('.spine-top', `top+=${geo.topY} 85%`, `top+=${geo.firstY} 70%`);
            draw('.spine-line', `top+=${geo.firstY} 70%`, `top+=${geo.lineEndY} 70%`);
            draw('.spine-bottom', `top+=${geo.lineEndY} 70%`, `top+=${geo.bottomY} 55%`);

            dots.forEach((dot, i) => {
                ScrollTrigger.create({
                    trigger: root.current,
                    start: `top+=${geo.dots[i].y} 70%`,
                    toggleClass: { targets: dot, className: 'is-on' },
                });
            });

            rules.forEach((rule) => {
                gsap.fromTo(
                    rule,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: 'none',
                        scrollTrigger: { trigger: rule, start: 'top 88%', end: 'top 55%', scrub: 0.5 },
                    },
                );
            });
        },
        { scope: root, dependencies: [geo], revertOnUpdate: true },
    );

    return (
        <div ref={root} className="relative">
            {geo && (
                <svg
                    className="pointer-events-none absolute left-0 top-0 -z-0"
                    width={geo.w}
                    height={geo.h}
                    viewBox={`0 0 ${geo.w} ${geo.h}`}
                    fill="none"
                    aria-hidden="true"
                >
                    <path d={`${geo.top} ${geo.line} ${geo.bottom}`} stroke="var(--color-line)" strokeWidth="1" />
                    <path className="spine-ink spine-top" d={geo.top} stroke="var(--color-accent)" strokeWidth="1.5" />
                    <path className="spine-ink spine-line" d={geo.line} stroke="var(--color-accent)" strokeWidth="1.5" />
                    <path className="spine-ink spine-bottom" d={geo.bottom} stroke="var(--color-accent)" strokeWidth="1.5" />
                    {geo.dots.map((p, i) => (
                        <circle key={i} className="spine-dot" cx={p.x} cy={p.y} r="5" />
                    ))}
                </svg>
            )}
            <div className="wrap" aria-hidden="true">
                <span data-spine-x className="block h-px" />
            </div>
            <div className="relative -mt-px">{children}</div>
        </div>
    );
}
