import { Shape, SplineCurve, Vector2 } from 'three';

/**
 * Code symbols drawn as centre lines and outlined into flat shapes, so the
 * hero needs no font file. Each glyph is about 2 units tall, centred on 0.
 */

const W = 0.3; // stroke width

const v = (x: number, y: number) => new Vector2(x, y);
const mirror = (pts: Vector2[]) => pts.map((p) => v(-p.x, p.y));

/** Outline a polyline into a closed shape with mitred corners. */
function stroke(pts: Vector2[], width = W): Shape {
    const left: Vector2[] = [];
    const right: Vector2[] = [];
    const half = width / 2;
    for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const prev = pts[i - 1];
        const next = pts[i + 1];
        const d1 = prev ? p.clone().sub(prev).normalize() : next!.clone().sub(p).normalize();
        const d2 = next ? next.clone().sub(p).normalize() : d1.clone();
        const t = d1.clone().add(d2);
        if (t.lengthSq() < 1e-6) t.copy(d1);
        t.normalize();
        const n = v(-t.y, t.x);
        const miter = half / Math.max(0.35, n.dot(v(-d1.y, d1.x)));
        left.push(p.clone().addScaledVector(n, miter));
        right.push(p.clone().addScaledVector(n, -miter));
    }
    return new Shape([...left, ...right.reverse()]);
}

function circle(cx: number, cy: number, r: number): Shape {
    const s = new Shape();
    s.absarc(cx, cy, r, 0, Math.PI * 2, false);
    return s;
}

function arc(cx: number, cy: number, r: number, from: number, to: number, steps = 28) {
    return Array.from({ length: steps + 1 }, (_, i) => {
        const a = from + ((to - from) * i) / steps;
        return v(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    });
}

function smooth(points: Vector2[], divisions = 64) {
    return new SplineCurve(points).getPoints(divisions);
}

const braceL = smooth([v(0.45, 1), v(0.08, 0.86), v(0.05, 0.25), v(-0.38, 0), v(0.05, -0.25), v(0.08, -0.86), v(0.45, -1)]);
const parenL = arc(1.05, 0, 1.2, (Math.PI * 5) / 6, (Math.PI * 7) / 6);
const chevronL = [v(0.55, 0.75), v(-0.5, 0), v(0.55, -0.75)];
const bracketL = [v(0.4, 1), v(-0.25, 1), v(-0.25, -1), v(0.4, -1)];

export const GLYPHS: Record<string, () => Shape[]> = {
    '{': () => [stroke(braceL)],
    '}': () => [stroke(mirror(braceL))],
    '(': () => [stroke(parenL)],
    ')': () => [stroke(mirror(parenL))],
    '<': () => [stroke(chevronL)],
    '>': () => [stroke(mirror(chevronL))],
    '[': () => [stroke(bracketL)],
    ']': () => [stroke(mirror(bracketL))],
    '/': () => [stroke([v(-0.42, -1), v(0.42, 1)])],
    '=': () => [stroke([v(-0.6, 0.27), v(0.6, 0.27)]), stroke([v(-0.6, -0.27), v(0.6, -0.27)])],
    '#': () => [
        stroke([v(-0.3, -0.9), v(-0.1, 0.9)], 0.24),
        stroke([v(0.2, -0.9), v(0.4, 0.9)], 0.24),
        stroke([v(-0.65, 0.3), v(0.75, 0.3)], 0.24),
        stroke([v(-0.75, -0.3), v(0.65, -0.3)], 0.24),
    ],
    ';': () => [circle(0.05, 0.45, 0.19), stroke([v(0.1, -0.12), v(0.08, -0.45), v(-0.15, -0.85)], 0.26)],
    '*': () =>
        [90, 30, 150].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const dx = Math.cos(a) * 0.72;
            const dy = Math.sin(a) * 0.72;
            return stroke([v(-dx, -dy), v(dx, dy)], 0.24);
        }),
};

export const GLYPH_KEYS = Object.keys(GLYPHS);
