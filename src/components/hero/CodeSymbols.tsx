'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ExtrudeGeometry, type Group, type Mesh, MeshStandardMaterial, PMREMGenerator, Vector3 } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLYPHS, GLYPH_KEYS } from './glyphs';

const ACCENT = '#5cc9a7';
const backOut = gsap.parseEase('back.out(1.6)');

/** Seeded random so the layout is the same on every visit. */
function rng(seed: number) {
    return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

type Floater = {
    key: string;
    base: [number, number, number];
    rot: [number, number, number];
    scale: number;
    drift: { x: number; y: number; speed: number; phase: number };
    rock: { x: number; y: number; z: number };
};

function layout(small: boolean): Floater[] {
    const rand = rng(7);
    const count = small ? 5 : 8;
    return Array.from({ length: count }, (_, i) => {
        // A loose ring around the headline keeps the middle readable.
        const angle = (i / count) * Math.PI * 2 + 0.4 + rand() * 0.35;
        const rx = (small ? 3.2 : 7.5) + rand() * (small ? 1.5 : 3);
        const ry = (small ? 5 : 4.2) + rand() * 1.4;
        return {
            key: GLYPH_KEYS[i % GLYPH_KEYS.length],
            base: [Math.cos(angle) * rx, Math.sin(angle) * ry, -9 + rand() * 11],
            rot: [rand() * 0.8 - 0.4, rand() * 1.0 - 0.5, rand() * 0.8 - 0.4],
            scale: (small ? 0.6 : 0.9) + rand() * (small ? 0.6 : 0.9),
            drift: { x: 0.25 + rand() * 0.4, y: 0.3 + rand() * 0.5, speed: 0.15 + rand() * 0.25, phase: rand() * 10 },
            rock: { x: 0.25 + rand() * 0.3, y: 0.35 + rand() * 0.45, z: 0.1 + rand() * 0.2 },
        };
    });
}

/** Studio-like reflections for the graphite material, generated locally (no HDR download). */
function RoomLight() {
    const get = useThree((s) => s.get);
    useEffect(() => {
        const { gl, scene } = get();
        const pmrem = new PMREMGenerator(gl);
        const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = env;
        scene.environmentIntensity = 0.5;
        return () => {
            scene.environment = null;
            env.dispose();
            pmrem.dispose();
        };
    }, [get]);
    return null;
}

function Symbols({ small, pointer }: { small: boolean; pointer: React.RefObject<{ x: number; y: number; active: boolean }> }) {
    const floaters = useMemo(() => layout(small), [small]);
    const group = useRef<Group>(null);
    const meshes = useRef<(Mesh | null)[]>([]);
    const clock = useRef(0);
    // Smoothed push away from the cursor, per symbol.
    const offsets = useRef(floaters.map(() => ({ x: 0, y: 0 })));
    const ray = useMemo(() => new Vector3(), []);

    const material = useMemo(
        () => new MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.55, roughness: 0.3 }),
        [],
    );
    const geometries = useMemo(() => {
        const map = new Map<string, ExtrudeGeometry>();
        for (const key of GLYPH_KEYS) {
            const g = new ExtrudeGeometry(GLYPHS[key](), {
                depth: 0.38,
                bevelEnabled: true,
                bevelThickness: 0.07,
                bevelSize: 0.05,
                bevelSegments: 4,
                curveSegments: 10,
            });
            g.center();
            map.set(key, g);
        }
        return map;
    }, []);
    useEffect(
        () => () => {
            geometries.forEach((g) => g.dispose());
            material.dispose();
        },
        [geometries, material],
    );

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.05);
        clock.current += dt;
        const time = clock.current;
        const intro = Math.min(1, Math.max(0, (time - 0.2) / 1.6));

        const cam = state.camera;
        const ease = 1 - Math.pow(0.02, dt);
        cam.position.x += (pointer.current.x * 0.6 - cam.position.x) * ease;
        cam.position.y += (-pointer.current.y * 0.4 - cam.position.y) * ease;
        cam.lookAt(0, 0, 0);

        // Direction of the ray from the camera through the cursor.
        ray.set(pointer.current.x, -pointer.current.y, 0.5).unproject(cam).sub(cam.position).normalize();
        const drift = 1 - Math.pow(0.12, dt); // very soft follow
        const RADIUS = 4.5;

        floaters.forEach((f, i) => {
            const m = meshes.current[i];
            if (!m) return;
            const t = time * f.drift.speed + f.drift.phase;
            const x = f.base[0] + Math.sin(t) * f.drift.x;
            const y = f.base[1] + Math.cos(t * 0.8) * f.drift.y;
            const z = f.base[2];

            // Where the cursor ray crosses this symbol's depth, and a gentle push away from it.
            const o = offsets.current[i];
            let tx = 0;
            let ty = 0;
            if (pointer.current.active && Math.abs(ray.z) > 1e-4) {
                const k = (z - cam.position.z) / ray.z;
                const dx = x - (cam.position.x + ray.x * k);
                const dy = y - (cam.position.y + ray.y * k);
                const dist = Math.hypot(dx, dy) || 1e-4;
                if (dist < RADIUS) {
                    const push = Math.pow(1 - dist / RADIUS, 2) * 2.4;
                    tx = (dx / dist) * push;
                    ty = (dy / dist) * push;
                }
            }
            o.x += (tx - o.x) * drift;
            o.y += (ty - o.y) * drift;
            m.position.set(x + o.x, y + o.y, z);
            // Rock around the starting angle so each symbol's face stays readable.
            m.rotation.set(
                f.rot[0] + Math.sin(t * 0.9) * f.rock.x - o.y * 0.25,
                f.rot[1] + Math.sin(t * 0.7 + 1) * f.rock.y + o.x * 0.25,
                f.rot[2] + Math.cos(t * 0.6) * f.rock.z,
            );
            const local = Math.min(1, Math.max(0, intro * 1.6 - i * 0.04));
            m.scale.setScalar(Math.max(0.001, f.scale * backOut(local)));
        });


        // Leave with the hero: rise over the first viewport of scroll.
        const leave = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        if (group.current) group.current.position.y = leave * 3;
    });

    return (
        <group ref={group}>
            {floaters.map((f, i) => (
                <mesh
                    key={i}
                    ref={(m) => {
                        meshes.current[i] = m;
                    }}
                    geometry={geometries.get(f.key)}
                    material={material}
                    position={f.base}
                    rotation={f.rot}
                    scale={0.001}
                />
            ))}
        </group>
    );
}

/**
 * Extruded code symbols floating behind the hero text (React Three Fiber),
 * lit by a white key light and a green rim. Symbols drift slowly and ease
 * away from the cursor; the camera leans a little toward it; the scene rises and fades as the hero scrolls away.
 */
export default function CodeSymbols({ onReady }: { onReady?: () => void }) {
    const hostRef = useRef<HTMLDivElement>(null);
    const pointer = useRef({ x: 0, y: 0, active: false });
    const [visible, setVisible] = useState(true);
    const [small] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const onPointer = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
            pointer.current.active = true;
        };
        const onScroll = () => {
            const leave = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
            host.style.opacity = String(1 - leave);
        };
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
        io.observe(host);
        window.addEventListener('pointermove', onPointer, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            io.disconnect();
            window.removeEventListener('pointermove', onPointer);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div ref={hostRef} className="absolute inset-0">
            <Canvas
                dpr={[1, 1.75]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 38, position: [0, 0, 16], near: 0.1, far: 60 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                style={{ pointerEvents: 'none' }}
                aria-hidden="true"
                onCreated={() => onReady?.()}
            >
                <fog attach="fog" args={['#000000', 12, 30]} />
                <ambientLight intensity={0.15} />
                <directionalLight position={[-6, 8, 10]} intensity={2.2} />
                <directionalLight position={[7, -2, -6]} color={ACCENT} intensity={3.2} />
                <pointLight position={[5, -3, 6]} color={ACCENT} intensity={60} distance={26} decay={1.6} />
                <RoomLight />
                <Symbols small={small} pointer={pointer} />
            </Canvas>
        </div>
    );
}
