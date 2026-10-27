import type { ReactElement } from 'react';
import {
    SiBootstrap,
    SiCss3,
    SiFigma,
    SiGit,
    SiGithub,
    SiGreensock,
    SiGulp,
    SiHtml5,
    SiJavascript,
    SiJquery,
    SiMobx,
    SiNpm,
    SiReact,
    SiSass,
    SiTailwindcss,
    SiTypescript,
    SiVite,
    SiSupabase,
    SiAppwrite,
    SiNextdotjs,
    SiReactquery,
    SiZod,
    SiAstro,
} from 'react-icons/si';

type TechNames =
    | 'html'
    | 'css'
    | 'sass'
    | 'tailwind'
    | 'js'
    | 'ts'
    | 'react'
    | 'mobx'
    | 'jquery'
    | 'bootstrap'
    | 'vite'
    | 'gulp'
    | 'gsap'
    | 'npm'
    | 'figma'
    | 'github'
    | 'git'
    | 'supabase'
    | 'appwrite'
    | 'nextjs'
    | 'zustand'
    | 'reactquery'
    | 'zod'
    | 'astro';
interface Technology {
    id: TechNames;
    name: string;
    icon: ReactElement | null;
    color: string;
}

const techArr: Technology[] = [
    { id: 'html', name: 'HTML5', icon: <SiHtml5 />, color: '#E34F26' },
    { id: 'css', name: 'CSS3', icon: <SiCss3 />, color: '#1572B6' },
    { id: 'sass', name: 'SASS', icon: <SiSass />, color: '#CC6699' },
    {
        id: 'tailwind',
        name: 'TailWindCss',
        icon: <SiTailwindcss />,
        color: '#06B6D4',
    },
    { id: 'js', name: 'JS', icon: <SiJavascript />, color: '#F7DF1E' },
    { id: 'ts', name: 'TS', icon: <SiTypescript />, color: '#3178C6' },
    { id: 'react', name: 'React', icon: <SiReact />, color: '#61DAFB' },
    {
        id: 'nextjs',
        name: 'Next.js',
        icon: <SiNextdotjs />,
        color: 'white',
    },
    {
        id: 'astro',
        name: 'Astro',
        icon: <SiAstro />,
        color: '#fff',
    },
    { id: 'mobx', name: 'MobX', icon: <SiMobx />, color: '#FF9955' },
    {
        id: 'zustand',
        name: 'Zustand',
        icon: null,
        color: 'white',
    },
    { id: 'jquery', name: 'jQuery', icon: <SiJquery />, color: '#0769AD' },
    { id: 'gsap', name: 'GSAP', icon: <SiGreensock />, color: '#88CE02' },
    {
        id: 'bootstrap',
        name: 'Bootstrap',
        icon: <SiBootstrap />,
        color: '#7952B3',
    },
    { id: 'vite', name: 'Vite', icon: <SiVite />, color: '#646CFF' },
    { id: 'npm', name: 'NPM', icon: <SiNpm />, color: '#CB3837' },
    { id: 'gulp', name: 'Gulp', icon: <SiGulp />, color: '#CF4647' },
    { id: 'figma', name: 'Figma', icon: <SiFigma />, color: '#F24E1E' },
    { id: 'git', name: 'Git', icon: <SiGit />, color: '#F05033' },
    { id: 'github', name: 'GitHub', icon: <SiGithub />, color: '#fff' },
    {
        id: 'supabase',
        name: 'Supabase',
        icon: <SiSupabase />,
        color: '#3ECF8E',
    },
    {
        id: 'appwrite',
        name: 'Appwrite',
        icon: <SiAppwrite />,
        color: '#FF5F5F',
    },
    {
        id: 'reactquery',
        name: 'React Query',
        icon: <SiReactquery />,
        color: '#FF4154',
    },
    {
        id: 'zod',
        name: 'Zod',
        icon: <SiZod />,
        color: '#408CFF',
    },
];

const TechList = ({
    list,
    className,
}: {
    list?: TechNames[];
    className?: string;
}) => {
    const filtered = list
        ? techArr.filter((item) => list.includes(item.id))
        : techArr;
    return (
        <div className={`flex flex-wrap gap-2 md:gap-4 ${className}`}>
            {filtered.map(({ id, name, color, icon }) => (
                <div
                    key={id}
                    className="flex gap-2 items-center border border-white/10 py-2 px-3 md:px-4 rounded-4xl "
                >
                    <span className="text-xs md:text-sm">{name}</span>
                    {icon && (
                        <span className="text-md md:text-xl" style={{ color }}>
                            {icon}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TechList;
