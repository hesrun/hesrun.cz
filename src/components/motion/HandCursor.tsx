'use client';

import { useEffect, useRef } from 'react';

/** Things you can click: the middle finger folds and the index finger points. */
const CLICKABLE = 'a[href], button, [role="button"], label, summary, select, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"]';
/** Text fields keep the native caret. */
const TEXT = 'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

/** Palm outline, open along the top where the fingers come out. */
const PALM = 'M9 20 L9 27 L5 23 A2.5 2.5 0 0 0 1.5 26.5 L9 34 Q11 38 15.5 38 L22 38 Q28.5 38 28.5 31 L28.5 20';

/**
 * Custom cursor: a hand showing the middle finger, which folds while the index
 * finger straightens over anything clickable. Only on devices with a real mouse;
 * touch screens keep their default behaviour. The fingertip that is up is the
 * hotspot, so clicks land exactly where it points.
 */
export default function HandCursor() {
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!media.matches) return;
        const node = el.current;
        if (!node) return;
        const root = document.documentElement;
        root.classList.add('hand-cursor');

        const move = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            const target = e.target instanceof Element ? e.target : null;
            node.dataset.point = String(Boolean(target?.closest(CLICKABLE)));
            node.dataset.hidden = String(Boolean(target?.closest(TEXT)));
        };
        const down = () => (node.dataset.down = 'true');
        const up = () => (node.dataset.down = 'false');
        const leave = () => (node.dataset.hidden = 'true');

        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerdown', down);
        window.addEventListener('pointerup', up);
        document.addEventListener('pointerleave', leave);
        return () => {
            root.classList.remove('hand-cursor');
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerdown', down);
            window.removeEventListener('pointerup', up);
            document.removeEventListener('pointerleave', leave);
        };
    }, []);

    return (
        <div ref={el} aria-hidden="true" className="hand" data-hidden="true" data-point="false" data-down="false">
            <svg viewBox="0 0 32 40" width="32" height="40">
                {/* Fingers sit behind the palm; folding just slides them down. */}
                <rect className="hand-finger hand-index" x="9" y="2" width="5" height="22" rx="2.5" />
                <rect className="hand-finger hand-middle" x="14" y="2" width="5" height="22" rx="2.5" />
                <rect className="hand-finger" x="19" y="12" width="5" height="22" rx="2.5" />
                <rect className="hand-finger" x="24" y="14" width="4.5" height="22" rx="2.25" />
                {/* Palm with the thumb out to the side: filled, then outlined without its top edge. */}
                <path className="hand-palm" d={`${PALM} Z`} />
                <path className="hand-outline" d={PALM} />
            </svg>
        </div>
    );
}
