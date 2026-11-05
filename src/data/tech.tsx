import type { IconComponent } from '@/components/icons/Svg';
import {
    Anthropic,
    Appwrite,
    Astro,
    Claude,
    Contentful,
    Copilot,
    CssModules,
    Cursor,
    Figma,
    Gemini,
    Git,
    GitHubActions,
    GoogleAds,
    GoogleAnalytics,
    GoogleSearchConsole,
    GoogleTagManager,
    Gsap,
    Html5,
    JavaScript,
    MobX,
    Netlify,
    NextJs,
    OpenAI,
    ReactHookForm,
    ReactLogo,
    ReactQuery,
    Sass,
    Supabase,
    Tailwind,
    ThreeJs,
    TypeScript,
    Vercel,
    Vite,
    Zod,
} from '@/components/icons/tech';

/** `color` is the brand colour; brands that are black on white use white here (dark site). */
type Tech = { name: string; icon: IconComponent | null; color?: string };

const techMap = {
    // Core
    html: { name: 'Semantic HTML', icon: Html5, color: '#E34F26' },
    js: { name: 'JavaScript', icon: JavaScript, color: '#F7DF1E' },
    ts: { name: 'TypeScript', icon: TypeScript, color: '#3178C6' },
    react: { name: 'React', icon: ReactLogo, color: '#61DAFB' },
    nextjs: { name: 'Next.js', icon: NextJs, color: '#FFFFFF' },
    astro: { name: 'Astro', icon: Astro, color: '#BC52EE' },
    // UI and styling
    sass: { name: 'SCSS (BEM)', icon: Sass, color: '#CC6699' },
    cssmodules: { name: 'CSS Modules', icon: CssModules, color: '#FFFFFF' },
    tailwind: { name: 'Tailwind CSS', icon: Tailwind, color: '#06B6D4' },
    tokens: { name: 'Design systems and tokens', icon: null },
    fluid: { name: 'Fluid typography', icon: null },
    gsap: { name: 'GSAP', icon: Gsap, color: '#88CE02' },
    three: { name: 'Three.js', icon: ThreeJs, color: '#FFFFFF' },
    // State and data
    zustand: { name: 'Zustand', icon: null },
    mobx: { name: 'MobX', icon: MobX, color: '#FF9955' },
    reactquery: { name: 'TanStack Query', icon: ReactQuery, color: '#FF4154' },
    rhf: { name: 'React Hook Form', icon: ReactHookForm, color: '#EC5990' },
    zod: { name: 'Zod', icon: Zod, color: '#3E67B1' },
    // Backend and services
    supabase: { name: 'Supabase', icon: Supabase, color: '#3FCF8E' },
    rest: { name: 'REST APIs', icon: null },
    contentful: { name: 'Contentful', icon: Contentful, color: '#2478CC' },
    appwrite: { name: 'Appwrite', icon: Appwrite, color: '#FD366E' },
    // Tooling and quality
    git: { name: 'Git', icon: Git, color: '#F05032' },
    actions: { name: 'GitHub Actions', icon: GitHubActions, color: '#2088FF' },
    vite: { name: 'Vite', icon: Vite, color: '#646CFF' },
    vercel: { name: 'Vercel', icon: Vercel, color: '#FFFFFF' },
    netlify: { name: 'Netlify', icon: Netlify, color: '#00C7B7' },
    cwv: { name: 'Core Web Vitals', icon: null },
    seo: { name: 'Technical SEO', icon: null },
    figma: { name: 'Figma', icon: Figma, color: '#F24E1E' },
    // Analytics and e-commerce integrations
    ga: { name: 'Google Analytics 4', icon: GoogleAnalytics, color: '#E37400' },
    gtm: { name: 'Google Tag Manager', icon: GoogleTagManager, color: '#246FDB' },
    gads: { name: 'Google Ads', icon: GoogleAds, color: '#4285F4' },
    gsc: { name: 'Search Console', icon: GoogleSearchConsole, color: '#458CF5' },
    merchant: { name: 'Merchant Center', icon: null },
    sklik: { name: 'Sklik', icon: null },
    heureka: { name: 'Heureka', icon: null },
    zbozi: { name: 'Zboží.cz', icon: null },
    // AI integrations
    openai: { name: 'OpenAI API', icon: OpenAI, color: '#FFFFFF' },
    anthropic: { name: 'Claude API', icon: Anthropic, color: '#D97757' },
    gemini: { name: 'Gemini API', icon: Gemini, color: '#8E75B2' },
    aisdk: { name: 'Vercel AI SDK', icon: Vercel, color: '#FFFFFF' },
    rag: { name: 'RAG and vector search', icon: null },
    agents: { name: 'Tool calling and agents', icon: null },
    // AI-assisted workflow
    claude: { name: 'Claude', icon: Claude, color: '#D97757' },
    cursor: { name: 'Cursor', icon: Cursor, color: '#FFFFFF' },
    copilot: { name: 'GitHub Copilot', icon: Copilot, color: '#FFFFFF' },
} satisfies Record<string, Tech>;

export type TechId = keyof typeof techMap;

export const tech: Record<TechId, Tech> = techMap;

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
    { key: 'analytics', items: ['ga', 'gtm', 'gads', 'gsc', 'merchant', 'sklik', 'heureka', 'zbozi'], note: true },
    { key: 'aiapps', items: ['openai', 'anthropic', 'gemini', 'aisdk', 'rag', 'agents'], note: true },
    { key: 'ai', items: ['claude', 'cursor', 'copilot'], note: true },
];
