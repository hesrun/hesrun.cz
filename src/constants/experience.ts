interface Experience {
    id: number;
    year: string;
    position: string;
    company: string;
    text: string;
}
const experience: Experience[] = [
    {
        id: 1,
        year: 'Jan 2022 – Present',
        position: 'Frontend Engineer (Contract / Part-Time)',
        company: 'Tehmart & Independent Projects',
        text: 'Architected high-end UI systems and non-standard responsive layouts for luxury brands and high-traffic platforms (Konstantin Chaykin Watches, Ineichen Auctioneers). Engineered complex visual animations and micro-interactions using React, GSAP, and Three.js, maintaining 60 FPS performance and sub-second load times. Built dynamic web applications from scratch leveraging React, Next.js (App Router), and TypeScript with scalable component architectures and modular SCSS/Tailwind styling. Implemented fullstack features integrating Supabase and runtime schema validation with Zod.',
    },
    {
        id: 2,
        year: 'Feb 2019 – Jan 2025',
        position: 'Frontend Developer',
        company: 'stmaria.cz',
        text: 'Engineered a comprehensive frontend overhaul for an active e-commerce platform (OpenCart/PHP), modernizing the responsive user interface. Drove direct business and traffic growth, successfully scaling simultaneous active users from ~30-40 to 400-500 and increasing daily orders. Optimized mobile performance, integrated robust marketing and analytics pipelines (Google, Seznam, Heureka), and refactored legacy UI codebase to improve page load speeds and technical SEO compliance.',
    },
    {
        id: 3,
        year: '2013 – 2019',
        position: 'Frontend Developer',
        company: 'Helpmed / Call2Doc',
        text: 'Engineered hybrid mobile application interfaces and responsive web views leveraging Angular and Ionic Framework. Architected real-time dynamic UI components and client-side data flows using Meteor.js and JavaScript (ES6+), handling live data synchronization for telemedicine services. Developed scalable templates using Twig and XSLT, translating complex XML/REST API structures into maintainable web layouts.',
    },
];

export default experience;
