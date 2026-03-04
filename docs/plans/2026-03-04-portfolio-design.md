# Bryan Zandi Portfolio — Design Document
Date: 2026-03-04

## Overview
Rebuild of bryanzandi.wixsite.com/mysite as a modern static site.
Stack: Astro + Tailwind CSS. Hosting: GitHub Pages.

## Visual Theme: "Modern Flight Deck"
Aviation-inspired dark theme with clean airline-grade typography.

### Color Palette
- Background: `#0a0f1e` (midnight navy — cockpit darkness)
- Surface: `#111827` (slightly lighter navy for cards)
- Accent blue: `#38bdf8` (instrument panel / sky)
- Accent gold: `#f59e0b` (wing tip lights / active nav)
- Text: `#f1f5f9` (white), `#94a3b8` (muted gray)
- Border: `#1e3a5f` (subtle panel lines)

### Typography
- Headlines + UI: `Inter` (Google Fonts)
- Monospace callouts: `JetBrains Mono` (credentials, stats, callsigns)
- Body: `Inter` regular

### Visual Language
- Dark glass-morphism nav bar with amber active-tab highlight
- Thin horizontal rule dividers (instrument panel feel)
- Blue glow on card hover
- Subtle slow-drift gradient animation on hero
- Aviation badge-style tags for blog categories

---

## Pages & Content

### 1. Home (`/`)
- Full-bleed hero: airplane/cockpit photo, HUD-style overlay text
  - "Welcome to the Professional Portfolio of"
  - "Bryan Zandi" (large serif or stencil headline)
  - Credentials as monospace badges: `ATP · CFI · AP · MBAA`
- Section: 3 favorite quotes (Denzel Washington, Coco Chanel, John H. Secondari)
- Section: Portrait photo with brief intro blurb
- Social links: LinkedIn, X, Facebook

### 2. About Me (`/about`)
- Section heading: "ABOUT ME"
- Bio text (4 paragraphs from Wix site)
- 2 photos (cockpit selfie, small plane cockpit)
- Stats bar: `Embraer 175 · ORD Hub · ATP Certified · MBAA · CFI`

### 3. My Story (`/my-story`)
- B&W portrait photo
- Full narrative essay (multiple paragraphs from Wix site)
- PDF download button: "Read My Story Published by Green River College"

### 4. Photos (`/photos`)
- CSS grid masonry gallery
- All photos from Wix site (sourced by downloading from Wix)
- Dark background, photos pop with hover scale effect

### 5. Blogs (`/blog`)
- Astro Content Collections for blog posts
- Category filter: All Posts / Egoism / Leadership
- Cards with: cover image, title, date, read time, excerpt
- Posts (6 total):
  - Practice Coaching (Apr 8, 2023) — Leadership
  - Compassion as Power (Apr 8, 2023) — Leadership
  - Rise and Fall of SpiceJet (Apr 8, 2023) — Egoism
  - Leadership Gap (Oct 15, 2022) — Leadership
  - The Train Dilemma (May 18, 2022) — Egoism
  - Theories of Ethics (May 18, 2022) — Egoism

### 6. Articles (`/articles`)
- External link redirect to: https://erau.academia.edu/BryanZandi
- Or: simple page with a "View on Academia.edu" button

### 7. Contact Me (`/contact`)
- Left column (boarding-pass styled):
  - Phone: +1 (206) 602-5067
  - Email: Bryan@Zandi.vip / Bryan.Zandi33@gmail.com
  - Social icons: LinkedIn, X, Facebook
  - "Download Resume" button
- Right column: Contact form (Name, Email, Phone, Subject, Message)
  - Form handled via Formspree (free, static-friendly)

---

## Technical Architecture

### Stack
- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS v3
- **Blog**: Astro Content Collections (Markdown files)
- **Forms**: Formspree (static form handler)
- **Fonts**: Google Fonts (Inter + JetBrains Mono)
- **Deployment**: GitHub Pages via GitHub Actions

### File Structure
```
bryan-zandi-portfolio/
├── src/
│   ├── content/
│   │   └── blog/           # .md files for each post
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── my-story.astro
│   │   ├── photos.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── articles.astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── BlogCard.astro
│   │   └── Footer.astro
│   └── layouts/
│       └── BaseLayout.astro
├── public/
│   └── images/             # Downloaded from Wix
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── docs/plans/
```

### Deployment
- GitHub Actions workflow builds Astro on push to `main`
- Deploys to `gh-pages` branch
- Custom domain optional

---

## Content Migration Notes
- All text content to be manually transcribed from Wix screenshots/pages
- Photos: download directly from Wix (right-click save or use browser dev tools)
- Blog post content: visit each post URL and copy text
- PDF (My Story): download from Wix and add to `public/`
- Resume PDF: download from Wix and add to `public/`
