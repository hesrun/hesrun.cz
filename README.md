# Hesrun

Portfolio of Vladyslav Otroshchenko, frontend engineer. English and Czech.

## Tech stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl, GSAP (ScrollTrigger, DrawSVG, SplitText), Lenis, React Three Fiber. Projects come from Contentful; the contact form sends through EmailJS.

## Run locally

```bash
cp .env.example .env.local   # fill in the tokens
npm install
npm run dev
```

## Structure

- `src/app/[locale]`: pages (home, `/work`, `/contact`), metadata, OG image
- `messages/en.json`, `messages/cs.json`: all site copy
- `src/components/hero`: the centered hero intro and the floating 3D code symbols (React Three Fiber, shapes drawn in `glyphs.ts`, no font file)
- `src/components/motion`: Lenis smooth scroll, mosaic page transitions (canvas), scroll effects (`data-fx` attributes) and the scroll-drawn spine line
- `src/components/work/StackCards.tsx`: stacking cards on /work
- `src/lib/contentful.ts`: projects, cached for one hour (ISR)

