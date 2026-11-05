/**
 * Phone and touch replacement for the 3D hero symbols: the same code glyphs
 * as flat vector strokes plus a few soft dots, floating on pure CSS
 * keyframes (transform and opacity only, so the compositor does the work).
 * No JavaScript, no WebGL. Shown by CSS only where the 3D scene is not.
 */

/** Centre lines in a 2.4-unit box centred on 0, like the 3D glyphs. */
const PATHS: Record<string, string> = {
    brace: 'M.4-1C.1-1 .05-.82.05-.5v.22C.05-.07-.08 0-.36 0c.28 0 .41.07.41.28v.22C.05.82.1 1 .4 1',
    chevron: 'M.5-.75-.5 0 .5.75',
    paren: 'M.38-1Q-.45 0 .38 1',
    bracket: 'M.4-1H-.25V1H.4',
    slash: 'M-.42 1 .42-1',
    equals: 'M-.6-.27H.6M-.6.27H.6',
    hash: 'M-.1-.9-.3.9M.4-.9.2.9M-.65-.3H.75M-.75.3H.65',
    semi: 'M.1.12.08.45-.15.85M.05-.45v.01',
    star: 'M0-.72V.72M-.62-.36.62.36M-.62.36.62-.36',
};

type Item = {
    /** Glyph name, or 'dot' for a plain soft dot. */
    g: keyof typeof PATHS | 'dot';
    flip?: boolean;
    /** Position in % of the hero, size in px. */
    x: number;
    y: number;
    s: number;
    /** Rotation at rest, drift distance in px, loop length in s, depth (0 far → 1 near). */
    r: number;
    dx: number;
    dy: number;
    t: number;
    z: number;
    accent?: boolean;
};

// A loose ring around the headline keeps the middle readable.
const ITEMS: Item[] = [
    { g: 'brace', x: 9, y: 16, s: 46, r: -12, dx: 10, dy: 16, t: 14, z: 0.9 },
    { g: 'chevron', flip: true, x: 84, y: 13, s: 38, r: 10, dx: -12, dy: 14, t: 12, z: 0.7, accent: true },
    { g: 'slash', x: 72, y: 28, s: 26, r: 8, dx: 8, dy: -10, t: 10, z: 0.4 },
    { g: 'semi', x: 18, y: 33, s: 22, r: -6, dx: -6, dy: 10, t: 11, z: 0.35 },
    { g: 'bracket', flip: true, x: 90, y: 62, s: 44, r: -8, dx: -10, dy: -14, t: 15, z: 0.85 },
    { g: 'equals', x: 7, y: 70, s: 30, r: 14, dx: 12, dy: -8, t: 13, z: 0.55, accent: true },
    { g: 'hash', x: 24, y: 86, s: 28, r: -10, dx: 8, dy: -12, t: 16, z: 0.5 },
    { g: 'paren', flip: true, x: 78, y: 84, s: 36, r: 12, dx: -8, dy: -10, t: 12, z: 0.65 },
    { g: 'star', x: 55, y: 92, s: 20, r: 0, dx: 6, dy: -8, t: 9, z: 0.3 },
    { g: 'dot', x: 34, y: 12, s: 6, r: 0, dx: 10, dy: 14, t: 11, z: 0.5, accent: true },
    { g: 'dot', x: 63, y: 9, s: 4, r: 0, dx: -8, dy: 12, t: 9, z: 0.3 },
    { g: 'dot', x: 93, y: 40, s: 5, r: 0, dx: -10, dy: 8, t: 13, z: 0.4 },
    { g: 'dot', x: 4, y: 48, s: 7, r: 0, dx: 8, dy: -12, t: 12, z: 0.6, accent: true },
    { g: 'dot', x: 45, y: 78, s: 4, r: 0, dx: -6, dy: -10, t: 10, z: 0.3 },
    { g: 'dot', x: 88, y: 92, s: 6, r: 0, dx: -8, dy: -6, t: 14, z: 0.5 },
];

export default function FloatingGlyphs() {
    return (
        <div aria-hidden="true" className="hero-particles pointer-events-none absolute inset-0">
            {ITEMS.map((it, i) => (
                <span
                    key={i}
                    className="particle"
                    style={
                        {
                            left: `${it.x}%`,
                            top: `${it.y}%`,
                            width: it.s,
                            height: it.s,
                            '--r': `${it.r}deg`,
                            '--dx': `${it.dx}px`,
                            '--dy': `${it.dy}px`,
                            '--t': `${it.t}s`,
                            '--o': (0.25 + it.z * 0.55).toFixed(2),
                            animationDelay: `${0.3 + i * 0.06}s, ${-i * 1.7}s`,
                            color: it.accent ? 'var(--color-accent)' : 'var(--color-paper)',
                        } as React.CSSProperties
                    }
                >
                    {it.g === 'dot' ? (
                        <span className="block size-full rounded-full bg-current" />
                    ) : (
                        <svg
                            viewBox="-1.2 -1.2 2.4 2.4"
                            className="size-full"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={0.16}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={it.flip ? { transform: 'scaleX(-1)' } : undefined}
                        >
                            <path d={PATHS[it.g]} />
                        </svg>
                    )}
                </span>
            ))}
        </div>
    );
}
