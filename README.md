<div align="center">

<img src="public/assets/icon.svg" alt="Kivixa Logo" width="96" height="96">

# Kivixa — Landing Page

**Production landing page for [Kivixa](https://github.com/990aa/kivixa) — a privacy-first, on-device AI workspace.**

[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)

</div>

---

## Stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | Astro 5 (islands architecture, static)  |
| Interactivity| React 19 islands (clipboard, FAQ, menu) |
| Styling      | Tailwind CSS v4 with CSS `@theme` tokens|
| Type system  | TypeScript strict                       |
| Animation    | CSS scroll-reveal + minimal Motion One  |
| E2E          | Playwright + axe-core a11y              |

## Develop

```bash
bun install
bun run dev          # http://localhost:4321
bun run check        # typecheck
bun run build        # static build → ./dist
bun run preview      # serve ./dist
bun run test:e2e     # Playwright smoke + axe
```

Requires Bun 1.3+ and a recent Node.js for Playwright browsers. Install Playwright browsers once with `bunx playwright install chromium`.

## Dynamic release data

`src/lib/github.ts` fetches the latest Kivixa release from the GitHub Releases API at build time. The version, Windows .exe, MSIX, and Android ARM64 .apk URLs all derive from it. If the API is unreachable, hardcoded fallback URLs are used so the page never breaks.

## Layout

```
src/
├─ components/
│  ├─ icons/           inline SVG icons
│  ├─ nav/             Header
│  ├─ sections/        Hero, LogoCloud, Features, Models, Privacy, Downloads, FAQ, CTAFooter
│  └─ ui/              SectionHeading, Disclosure, CopyButton, FDroidSteps, MobileMenu, RevealOnScroll
├─ lib/
│  ├─ content.ts       typed copy: features, models, pillars, platforms, faqs
│  └─ github.ts        release fetcher
├─ pages/
│  ├─ index.astro
│  └─ 404.astro
└─ styles/global.css   Tailwind v4 entrypoint + design tokens
```

## License

MIT. Kivixa is a separate project; see [kivixa repo](https://github.com/990aa/kivixa) for product details.