'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const CodeSymbols = dynamic(() => import('./CodeSymbols'), { ssr: false });

/**
 * The 3D symbols load once the browser is idle and fade in after their first
 * frame. Without WebGL or with reduced motion only the CSS glows remain.
 */
export default function HeroVisual() {
    const [live, setLive] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const start = () => setLive(true);
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(start, { timeout: 1200 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(start, 300);
        return () => clearTimeout(id);
    }, []);

    const onReady = useCallback(() => setReady(true), []);

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
                ready ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {live && <CodeSymbols onReady={onReady} />}
        </div>
    );
}
