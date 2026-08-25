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
        year: 'Jan 2022 – Jan 2025',
        position: 'Frontend Developer',
        company: 'Tehmart',
        text: 'Developed responsive and accessible frontend pages for international clients. Built layouts based on design specifications, implemented animations with GSAP, and improved performance and cross‑browser stability. Worked closely with designers and PMs in a remote workflow.',
    },
    {
        id: 2,
        year: 'Feb 2024 – Dec 2024',
        position: 'Frontend Developer',
        company: 'Konstantin Chaykin Watches',
        text: 'Created visually rich, animation‑heavy pages for a luxury watch brand. Implemented complex layouts, GSAP animations, and ensured high‑quality presentation across devices while collaborating closely with designers.',
    },
    {
        id: 3,
        year: 'Apr 2022 – Apr 2023',
        position: 'Frontend Developer',
        company: 'Ineichen Auctioneers',
        text: 'Developed and maintained complex frontend pages and reusable UI components for a high‑traffic auction platform. Improved performance, implemented responsive layouts, and collaborated with backend developers on new features.',
    },
    {
        id: 4,
        year: 'Feb 2019 – Jan 2025',
        position: 'Frontend Developer',
        company: 'stmaria.cz',
        text: 'Maintained and improved the frontend of an e‑commerce platform. Delivered new UI features, optimized performance and responsiveness, applied SEO best practices, and collaborated with backend developers on PHP/SQL integrations.',
    },
    {
        id: 5,
        year: '2013 – 2019',
        position: 'Frontend Developer',
        company: 'Helpmed / Call2Doc',
        text: 'Developed responsive interfaces for telemedicine platforms using modern UI frameworks. Built hybrid mobile app templates with Ionic, integrated frontend with backend systems, and collaborated with designers and product teams in a startup environment.',
    },
];

export default experience;
