# Veyra Sounds — Website

The marketing site for [Veyra Sounds](https://github.com/NextGenDev-KSK/veyra), a
free and open-source system-wide audio enhancer for Windows.

**Live:** https://nextgendev-ksk.github.io/veyra-website/

Built with Next.js 14 (static export), React Three Fiber for the 3D hero, GSAP
for scroll animation, and Tailwind CSS. It ships as a fully static site — no
server, no tracking, no analytics.

## Develop locally

```bash
npm install
npm run dev        # http://localhost:9002
```

## Build

```bash
npm run build      # static export to ./out
npm run preview    # serve ./out locally
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
static export and publishes it to GitHub Pages.

Because a GitHub Pages **project site** is served from a subpath
(`/veyra-website`), the workflow sets `NEXT_PUBLIC_BASE_PATH=/veyra-website`.
Next.js prefixes its own assets automatically; raw `public/` asset URLs are
prefixed via the `asset()` helper in [`src/lib/asset.ts`](src/lib/asset.ts). If
you fork this or move to a custom domain, update `NEXT_PUBLIC_BASE_PATH` (set it
empty for a root domain) and `SITE_URL` in [`src/app/layout.tsx`](src/app/layout.tsx).

## Assets

- `public/models/headphone.stl` — the 3D hero model
- `public/audio/theme.mp3` — optional background track (user-triggered, off by default)
- `public/screenshots/*.png` — real app screens shown in the gallery

## Licence

Site code is under the same GPLv3 licence as the Veyra Sounds project.
