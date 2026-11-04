'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { jumpToHashOrTop, lockScroll } from '@/lib/scroll';
import Mark from '../layout/Mark';

gsap.registerPlugin(ScrollTrigger);

/** Squares across the screen; rows follow so tiles stay square. */
const COLS = 20;
/** Random start offset per tile, as a share of the timeline. */
const JITTER = 0.35;
const DURATION = 0.8;

type Tile = { x: number; y: number; delay: number };

const easeTile = gsap.parseEase('power2.inOut');

/** Near-black, slightly lighter while the tile is edge-on, like it catches the light. */
function tileColor(edge: number) {
    const v = Math.round(13 + edge * 34);
    return `rgb(${v},${v},${v})`;
}

/**
 * Mosaic between pages: on an internal link click every square of a 20-wide
 * grid flips over around its own diagonal (at slightly different moments) until the
 * screen is closed, the next page loads underneath, then the squares flip
 * back the same way to open it. Drawn on one canvas. Works for every same-site <a>, so links need no wrapper.
 */
export default function PageTransition() {
    const router = useRouter();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const markRef = useRef<HTMLDivElement>(null);
    const pending = useRef<{ path: string; timer: number } | null>(null);
    const busy = useRef(false);
    const revealRef = useRef<() => void>(() => {});

    useEffect(() => {
        const canvas = canvasRef.current;
        const mark = markRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !mark || !ctx) return;

        let tiles: Tile[] = [];
        let cw = 0;
        let ch = 0;
        const state = { p: 0, cover: true };

        const layout = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const cols = COLS;
            const rows = Math.max(1, Math.round(h / (w / COLS)));
            cw = w / cols;
            ch = h / rows;
            tiles = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    tiles.push({ x: c * cw, y: r * ch, delay: Math.random() });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const t of tiles) {
                const local = Math.min(1, Math.max(0, (state.p - t.delay * JITTER) / (1 - JITTER)));
                const turned = easeTile(local);
                // Closing: from edge-on (90°) to flat. Opening: from flat back to edge-on.
                const angle = state.cover ? (1 - turned) * Math.PI * 0.5 : -turned * Math.PI * 0.5;
                const face = Math.cos(angle);
                if (face <= 0.01) continue;
                if (face >= 0.999) {
                    ctx.fillStyle = tileColor(0);
                    ctx.fillRect(t.x - 0.5, t.y - 0.5, cw + 1, ch + 1);
                    continue;
                }
                // Flip around the tile's diagonal (top-left → bottom-right): the part
                // along the diagonal stays, the part across it shrinks by cos(angle).
                // Matrix = a·aᵀ + face·(I − a·aᵀ), with a the unit diagonal.
                const along = 0.5 + 0.5 * face;
                const across = 0.5 - 0.5 * face;
                ctx.save();
                ctx.translate(t.x + cw / 2, t.y + ch / 2);
                ctx.transform(along, across, across, along, 0, 0);
                ctx.fillStyle = tileColor(1 - face);
                ctx.fillRect(-cw / 2 - 0.5, -ch / 2 - 0.5, cw + 1, ch + 1);
                ctx.restore();
            }
        };

        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as Element | null)?.closest?.('a');
            if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            // Same page (hash jumps, re-clicks): let Lenis/Next handle it.
            if (url.pathname === window.location.pathname) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            e.preventDefault();
            if (busy.current) return;
            busy.current = true;
            const href = url.pathname + url.search + url.hash;

            layout();
            state.p = 0;
            state.cover = true;
            gsap.killTweensOf([state, mark]);
            gsap.set(canvas, { visibility: 'visible' });
            lockScroll(true);
            gsap.timeline({
                onComplete: () => {
                    pending.current = {
                        path: url.pathname,
                        // If the route never reports back, uncover anyway.
                        timer: window.setTimeout(() => reveal(), 4000),
                    };
                    router.push(href, { scroll: false });
                },
            })
                .to(state, { p: 1, duration: DURATION, ease: 'none', onUpdate: draw })
                .fromTo(mark, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, '-=0.3');
        };

        const reveal = () => {
            if (pending.current) window.clearTimeout(pending.current.timer);
            pending.current = null;
            lockScroll(false);
            jumpToHashOrTop();
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                jumpToHashOrTop();
            });
            state.p = 0;
            state.cover = false;
            gsap.timeline({
                delay: 0.1,
                onComplete: () => {
                    gsap.set(canvas, { visibility: 'hidden' });
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    busy.current = false;
                },
            })
                .to(mark, { autoAlpha: 0, duration: 0.2 })
                .to(state, { p: 1, duration: DURATION, ease: 'none', onUpdate: draw }, '<');
        };
        revealRef.current = reveal;

        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, [router]);

    // New page rendered: uncover it.
    useEffect(() => {
        if (pending.current && pending.current.path === pathname) {
            const id = requestAnimationFrame(() => revealRef.current());
            return () => cancelAnimationFrame(id);
        }
    }, [pathname]);

    return (
        <>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="invisible fixed inset-0 z-[60]"
            />
            <div
                ref={markRef}
                aria-hidden="true"
                className="pointer-events-none invisible fixed inset-0 z-[61] flex items-center justify-center opacity-0"
            >
                <Mark className="h-10 w-12" />
            </div>
        </>
    );
}
