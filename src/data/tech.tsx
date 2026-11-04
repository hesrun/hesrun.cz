import type { IconType } from 'react-icons';
import {
    SiAngular,
    SiAppwrite,
    SiAstro,
    SiBootstrap,
    SiClaude,
    SiContentful,
    SiCss,
    SiCssmodules,
    SiCursor,
    SiFigma,
    SiGit,
    SiGithub,
    SiGithubactions,
    SiGithubcopilot,
    SiGreensock,
    SiGulp,
    SiHtml5,
    SiIonic,
    SiJavascript,
    SiJquery,
    SiMeteor,
    SiMobx,
    SiNetlify,
    SiNextdotjs,
    SiNpm,
    SiReact,
    SiReacthookform,
    SiReactquery,
    SiSass,
    SiSupabase,
    SiTailwindcss,
    SiThreedotjs,
    SiTypescript,
    SiVercel,
    SiVite,
    SiZod,
} from 'react-icons/si';

type Tech = { name: string; icon: IconType | null };

/** Ids are also used by the `tech` field of projects in Contentful. */
export const tech = {
    // Core
    html: { name: 'Semantic HTML', icon: SiHtml5 },
    css: { name: 'CSS', icon: SiCss },
    js: { name: 'JavaScript (ES6+)', icon: SiJavascript },
    ts: { name: 'TypeScript', icon: SiTypescript },
    react: { name: 'React', icon: SiReact },
    nextjs: { name: 'Next.js (App Router, Server Actions)', icon: SiNextdotjs },
    astro: { name: 'Astro', icon: SiAstro },
    // UI and styling
    sass: { name: 'SCSS (BEM)', icon: SiSass },
    cssmodules: { name: 'CSS Modules', icon: SiCssmodules },
    tailwind: { name: 'Tailwind CSS', icon: SiTailwindcss },
    tokens: { name: 'Design systems and tokens', icon: null },
    fluid: { name: 'Fluid typography', icon: null },
    gsap: { name: 'GSAP', icon: SiGreensock },
    three: { name: 'Three.js', icon: SiThreedotjs },
    // State and data
    zustand: { name: 'Zustand', icon: null },
    mobx: { name: 'MobX', icon: SiMobx },
    reactquery: { name: 'TanStack Query', icon: SiReactquery },
    rhf: { name: 'React Hook Form', icon: SiReacthookform },
    zod: { name: 'Zod', icon: SiZod },
    // Backend and services
    supabase: { name: 'Supabase (SQL migrations, RLS, Auth, type generation)', icon: SiSupabase },
    rest: { name: 'REST APIs', icon: null },
    contentful: { name: 'Contentful CMS', icon: SiContentful },
    appwrite: { name: 'Appwrite', icon: SiAppwrite },
    // Tooling and quality
    git: { name: 'Git', icon: SiGit },
    github: { name: 'GitHub', icon: SiGithub },
    actions: { name: 'GitHub Actions', icon: SiGithubactions },
    vite: { name: 'Vite', icon: SiVite },
    vercel: { name: 'Vercel', icon: SiVercel },
    netlify: { name: 'Netlify', icon: SiNetlify },
    cwv: { name: 'Core Web Vitals', icon: null },
    seo: { name: 'Technical SEO', icon: null },
    figma: { name: 'Figma', icon: SiFigma },
    npm: { name: 'npm', icon: SiNpm },
    // AI-assisted workflow
    claude: { name: 'Claude', icon: SiClaude },
    cursor: { name: 'Cursor', icon: SiCursor },
    copilot: { name: 'GitHub Copilot', icon: SiGithubcopilot },
    // Earlier stack
    angular: { name: 'Angular', icon: SiAngular },
    ionic: { name: 'Ionic', icon: SiIonic },
    meteor: { name: 'Meteor.js', icon: SiMeteor },
    jquery: { name: 'jQuery', icon: SiJquery },
    bootstrap: { name: 'Bootstrap', icon: SiBootstrap },
    gulp: { name: 'Gulp', icon: SiGulp },
    twig: { name: 'Twig and XSLT', icon: null },
} satisfies Record<string, Tech>;

export type TechId = keyof typeof tech;

export function isTechId(id: string): id is TechId {
    return id in tech;
}

/** Short names for compact lists (project stacks), where the long labels are too much. */
const SHORT: Partial<Record<TechId, string>> = {
    html: 'HTML5',
    js: 'JavaScript',
    nextjs: 'Next.js',
    sass: 'Sass',
    supabase: 'Supabase',
    reactquery: 'React Query',
};

export function techLabel(id: TechId) {
    return SHORT[id] ?? tech[id].name;
}

/**
 * Skill groups on the home page, in the order of the CV.
 * Labels and the optional one-line note live in messages (skills.groups.*).
 */
export const skillGroups: { key: string; items: TechId[]; note?: boolean }[] = [
    { key: 'core', items: ['js', 'ts', 'react', 'nextjs', 'astro', 'html'] },
    { key: 'ui', items: ['sass', 'cssmodules', 'tailwind', 'tokens', 'fluid', 'gsap', 'three'] },
    { key: 'data', items: ['zustand', 'mobx', 'reactquery', 'rhf', 'zod'] },
    { key: 'backend', items: ['supabase', 'rest', 'contentful', 'appwrite'] },
    { key: 'tooling', items: ['git', 'actions', 'vite', 'vercel', 'netlify', 'cwv', 'seo', 'figma'] },
    { key: 'ai', items: ['claude', 'cursor', 'copilot'], note: true },
    { key: 'earlier', items: ['angular', 'ionic', 'meteor', 'jquery', 'bootstrap', 'gulp', 'twig'] },
];
