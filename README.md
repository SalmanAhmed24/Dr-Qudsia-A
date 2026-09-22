# Dr Qudsia Akram — portfolio

Next.js (App Router, TypeScript) portfolio with GSAP motion, a canvas globe and full SEO metadata.

## Run it

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Needs Node.js 20.9 or newer.

## Before you deploy

1. Copy `.env.example` to `.env.local` (or set the variable in Vercel) and put the real address in
   `NEXT_PUBLIC_SITE_URL`. It feeds the canonical URL, sitemap, robots.txt and social preview image.
2. Deploy to Vercel (import the repo, no config needed) or any Node host.
3. Run Lighthouse on the live URL and submit `/sitemap.xml` in Google Search Console.

## Where things live

- `lib/data.ts` holds all CV content: publications, timeline, courses, theses, talks. Edit here to update the site.
- `app/layout.tsx` sets fonts (Bricolage Grotesque for headings, Geist for text), metadata and JSON-LD.
- `app/opengraph-image.tsx` generates the link preview image; `sitemap.ts`, `robots.ts` and `manifest.ts` sit beside it.
- `components/Globe.tsx` is the interactive globe, drawn with d3-geo from Natural Earth country shapes (world-atlas). Research countries per region are listed by ISO code in `lib/data.ts`; `Research.tsx` holds the region filter (GSAP Flip layout animation).
- `components/Journey.tsx` is the pinned horizontal timeline; `Animations.tsx` holds page-wide motion.
- Colours are CSS variables at the top of `app/globals.css`.

All motion respects the reduced-motion setting.
