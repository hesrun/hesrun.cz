import { ImageResponse } from 'next/og';

export const alt = 'Vladyslav Otroshchenko, frontend engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const cs = locale === 'cs';
    const greeting = cs ? 'Ahoj, jsem Vladyslav,' : 'Hi, I’m Vladyslav,';
    const before = cs ? '' : 'a ';
    const after = cs ? ' vývojář' : ' engineer';
    const stack = 'React, Next.js, TypeScript, GSAP, Three.js';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000000',
                    backgroundImage:
                        'radial-gradient(circle at 88% 8%, rgba(92,201,167,0.35), transparent 45%), radial-gradient(circle at 8% 100%, rgba(92,201,167,0.25), transparent 45%)',
                    color: '#f2f2f2',
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05 }}>{greeting}</div>
                <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.05, display: 'flex', gap: 22 }}>
                    {before.trim() && <span>{before.trim()}</span>}
                    <span style={{ color: '#5cc9a7' }}>frontend</span>
                    <span>{after.trim()}</span>
                </div>
                <div style={{ marginTop: 36, fontSize: 28, color: '#a3a3a3' }}>{stack}</div>
            </div>
        ),
        size,
    );
}
