import { useGSAP } from '@gsap/react';
import TechList from '../../components/TechList';
import PhotoParallax from '../PhotoParallax';
import Title from '../Title';
import gsap from 'gsap';
import { useMediaQuery } from '@uidotdev/usehooks';

const Home = () => {
    const isXl = useMediaQuery('(min-width: 80rem)');

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1 });
        tl.from('.home-text', {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power2.out',
        });
        tl.from(
            '.home-skills',
            {
                opacity: 0,
                y: 50,
                duration: 0.6,
                ease: 'power2.out',
            },
            '-=0.3',
        );
    });
    return (
        <div className="xl:flex justify-between gap-30">
            <div className="max-w-250">
                <Title type="h1" className="mb-6 xl:text-left">
                    Vladyslav <br />
                    Otroshchenko
                </Title>
                <div className="home-text mb-6">
                    I’m a{' '}
                    <b className="text-teal-500">
                        Frontend Engineer with 10+ years of experience
                    </b>
                    , architecting high-performance web applications and
                    design-intensive UI systems from scratch[cite: 1]. Over the
                    past decade, I’ve contributed to{' '}
                    <b className="text-teal-500">30+ projects</b> — from landing
                    pages to full multi‑page applications — building clean
                    layouts, crafting polished UI components, and implementing
                    smooth animations that elevate the user experience. In
                    recent years, I’ve specialized in modern frontend
                    development with React, Next.js (App Router), and
                    TypeScript[cite: 1]. I work with state management tools,
                    build fast and scalable interfaces using SSR/ISR, integrate
                    APIs, implement fullstack features and end-to-end type
                    safety with Supabase (SQL migrations, CLI type generation)
                    and runtime schema validation with Zod[cite: 1], and style
                    applications with Tailwind and modular SCSS[cite: 1]. I
                    enjoy combining strong UI engineering with modern
                    architecture to create interfaces that feel fast, intuitive
                    and refined[cite: 1].
                </div>
                <div className="home-skills">
                    <h3 className="mb-4">Some of my tech skills:</h3>
                    <TechList />
                </div>
            </div>
            {isXl && <PhotoParallax />}
        </div>
    );
};

export default Home;
