# Bryan Zandi Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modern aviation-themed static portfolio site for Bryan Zandi using Astro + Tailwind, deployed to GitHub Pages, replacing his existing Wix site.

**Architecture:** Astro static site with 7 pages (Home, About, My Story, Photos, Blog index+posts, Articles, Contact). Blog posts are Markdown files in Astro Content Collections. Contact form uses Formspree. Images downloaded from Wix and stored in `public/images/`.

**Tech Stack:** Astro 4.x, Tailwind CSS v3, Astro Content Collections, Formspree, Google Fonts (Inter + JetBrains Mono), GitHub Actions for deployment.

---

## Pre-Flight Checklist (Read First)

- Working directory: `C:/Users/andre/bryan-zandi-portfolio/`
- Node.js required (check: `node --version` — needs 18+)
- The Wix site for reference: https://bryanzandi.wixsite.com/mysite
- Formspree account needed for contact form (free at formspree.io) — create one and get the form endpoint URL before Task 12
- All blog post content needs to be scraped from the Wix blog — do this as you build each post

## Color & Design Tokens (Reference for all tasks)

```
Background:   #0a0f1e  (midnight navy)
Surface:      #111827  (card background)
Border:       #1e3a5f  (panel lines)
Accent blue:  #38bdf8  (sky blue / instrument glow)
Accent gold:  #f59e0b  (wing tip / active nav)
Text:         #f1f5f9  (primary white)
Text muted:   #94a3b8  (secondary gray)
```

---

### Task 1: Initialize Astro Project

**Files:**
- Create: all Astro scaffold files (auto-generated)

**Step 1: Create the Astro project**

```bash
cd C:/Users/andre/bryan-zandi-portfolio
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
```

When prompted: choose "An empty project", TypeScript strict, install deps.

**Step 2: Add Tailwind integration**

```bash
npx astro add tailwind --yes
```

**Step 3: Add Google Fonts to base layout**

Open `src/layouts/Layout.astro` (rename it to `BaseLayout.astro` — Astro generated a default, adapt it):

```astro
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = "Professional Portfolio of Bryan Zandi — ATP, CFI, MBAA" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | Bryan Zandi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#0a0f1e] text-[#f1f5f9] font-sans">
    <slot />
  </body>
</html>
```

**Step 4: Update tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#0a0f1e',
          surface: '#111827',
          border: '#1e3a5f',
        },
        sky: {
          glow: '#38bdf8',
        },
        gold: {
          wing: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
```

**Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Astro dev server at http://localhost:4321 — blank dark page, no errors.

**Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Astro + Tailwind project"
```

---

### Task 2: Create Nav Component

**Files:**
- Create: `src/components/Nav.astro`

**Step 1: Create the Nav component**

```astro
---
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'My Story', href: '/my-story' },
  { label: 'Photos', href: '/photos' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Articles', href: 'https://erau.academia.edu/BryanZandi', external: true },
  { label: 'Contact Me', href: '/contact' },
];

const currentPath = Astro.url.pathname;

function isActive(href: string) {
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href);
}
---

<nav class="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-[#1e3a5f]">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="font-mono text-sm text-[#94a3b8] tracking-widest uppercase hover:text-[#38bdf8] transition-colors">
      BZ · ATP
    </a>
    <ul class="flex flex-wrap gap-1">
      {navItems.map((item) => (
        <li>
          <a
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            class={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
              ${isActive(item.href)
                ? 'bg-[#f59e0b] text-[#0a0f1e] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e3a5f]'
              }`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>
```

**Step 2: Add Nav to BaseLayout.astro**

In `src/layouts/BaseLayout.astro`, import and add `<Nav />` before `<slot />`:

```astro
---
import Nav from '../components/Nav.astro';
// ... rest of frontmatter
---
<!doctype html>
<html lang="en">
  <head><!-- ... --></head>
  <body class="bg-[#0a0f1e] text-[#f1f5f9] font-sans">
    <Nav />
    <slot />
  </body>
</html>
```

**Step 3: Verify**

Run `npm run dev`, open http://localhost:4321 — nav bar should be visible, dark with monospace logo text, nav items visible.

**Step 4: Commit**

```bash
git add src/components/Nav.astro src/layouts/BaseLayout.astro
git commit -m "feat: add sticky nav component with active state"
```

---

### Task 3: Download Images from Wix

**Files:**
- Create: `public/images/` directory with all images

**Step 1: Create image directories**

```bash
mkdir -p public/images/hero
mkdir -p public/images/about
mkdir -p public/images/mystory
mkdir -p public/images/photos
mkdir -p public/images/blog
```

**Step 2: Download images**

Visit the Wix site in browser. For each image, right-click → "Save image as" into the appropriate folder:

| Image | Page | Save as |
|-------|------|---------|
| Airplane at sunset (hero) | All pages | `public/images/hero/airplane-hero.jpg` |
| Bryan in pilot uniform at airport (home) | Home | `public/images/about/bryan-airport.jpg` |
| Bryan in cockpit sunglasses selfie | About | `public/images/about/bryan-cockpit-selfie.jpg` |
| Bryan in small plane cockpit (studying) | About | `public/images/about/bryan-small-plane.jpg` |
| Bryan B&W portrait in uniform (seated) | My Story | `public/images/mystory/bryan-bw-portrait.jpg` |
| All gallery photos (10+) | Photos | `public/images/photos/photo-01.jpg` through `photo-N.jpg` |

**Note on Wix image URLs:** Wix serves images from `static.wixstatic.com`. If right-click save doesn't give full res, open DevTools → Network tab → filter by "img" → find the image request → copy URL → open in new tab → save.

**Step 3: Verify**

Check that `public/images/` has all downloaded images. Run `ls public/images/**` to confirm.

**Step 4: Commit**

```bash
git add public/images/
git commit -m "feat: add all portfolio images"
```

---

### Task 4: Build Home Page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace index.astro with Home page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <!-- Hero Section -->
  <section class="relative h-screen min-h-[600px] flex items-center">
    <img
      src="/images/hero/airplane-hero.jpg"
      alt="Commercial airplane on runway at sunset"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/80 via-[#0a0f1e]/50 to-transparent"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <p class="font-mono text-[#38bdf8] text-sm tracking-widest uppercase mb-2">
        Welcome to the Professional Portfolio of
      </p>
      <h1 class="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
        Bryan Zandi
      </h1>
      <div class="flex flex-wrap gap-2 mb-6">
        {['MBA in Aviation', 'ATP', 'CFI', 'Asst. Professor'].map(cred => (
          <span class="font-mono text-xs bg-[#1e3a5f] text-[#38bdf8] border border-[#38bdf8]/30 px-3 py-1 rounded-full">
            {cred}
          </span>
        ))}
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="border-t border-[#1e3a5f] max-w-6xl mx-auto"></div>

  <!-- Quotes Section -->
  <section class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
    <div class="space-y-8">
      <h2 class="font-mono text-[#f59e0b] text-sm tracking-widest uppercase">
        · · · My Three Favorite Quotes · · ·
      </h2>

      <blockquote class="border-l-2 border-[#38bdf8] pl-4">
        <p class="text-[#f1f5f9] leading-relaxed italic">
          "Dreams without goals are just dreams, and they ultimately fuel disappointment! On the road to achieving your dreams, you must apply discipline, but more importantly, consistency. Because without commitment, you will never start, but without consistency, you never finish!"
        </p>
        <footer class="mt-2 font-mono text-[#94a3b8] text-sm">— Denzel Washington</footer>
      </blockquote>

      <blockquote class="border-l-2 border-[#38bdf8] pl-4">
        <p class="text-[#f1f5f9] leading-relaxed italic">
          "If you were born without wings, do nothing to prevent them from growing."
        </p>
        <footer class="mt-2 font-mono text-[#94a3b8] text-sm">— Coco Chanel</footer>
      </blockquote>

      <blockquote class="border-l-2 border-[#38bdf8] pl-4">
        <p class="text-[#f1f5f9] leading-relaxed italic">
          "Once you have tasted flight, you will forever walk the earth with your eyes turned skyward, for there you have been, and there you will always long to return."
        </p>
        <footer class="mt-2 font-mono text-[#94a3b8] text-sm">— John H. Secondari</footer>
      </blockquote>
    </div>

    <div class="flex justify-center">
      <img
        src="/images/about/bryan-airport.jpg"
        alt="Bryan Zandi in pilot uniform"
        class="rounded-lg border border-[#1e3a5f] max-w-sm w-full shadow-lg shadow-[#38bdf8]/10"
      />
    </div>
  </section>

  <!-- Social Links -->
  <footer class="border-t border-[#1e3a5f] py-8">
    <div class="max-w-6xl mx-auto px-6 flex justify-center gap-6">
      <a href="https://www.linkedin.com/in/bryanzandi" target="_blank" rel="noopener noreferrer"
         class="text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-mono text-sm">
        LinkedIn
      </a>
      <span class="text-[#1e3a5f]">·</span>
      <a href="https://twitter.com/bryanzandi" target="_blank" rel="noopener noreferrer"
         class="text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-mono text-sm">
        X / Twitter
      </a>
      <span class="text-[#1e3a5f]">·</span>
      <a href="https://www.facebook.com/bryanzandi" target="_blank" rel="noopener noreferrer"
         class="text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-mono text-sm">
        Facebook
      </a>
    </div>
  </footer>
</BaseLayout>
```

**Note:** Find the exact LinkedIn/Twitter/Facebook URLs by clicking the social icons on the Wix site's home page.

**Step 2: Verify**

`npm run dev` → home page looks good: hero with airplane image, dark overlay, name + credential badges, quotes section, portrait photo.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build home page with hero and quotes"
```

---

### Task 5: Build About Me Page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About Me">
  <!-- Page Hero (same airplane, shorter) -->
  <section class="relative h-64 flex items-end">
    <img
      src="/images/hero/airplane-hero.jpg"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-bottom"
    />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">About Me</h1>
    </div>
  </section>

  <!-- Stats Bar -->
  <div class="bg-[#111827] border-y border-[#1e3a5f]">
    <div class="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6">
      {[
        ['Aircraft', 'Embraer 175'],
        ['Hub', 'Chicago O\'Hare (ORD)'],
        ['Cert', 'ATP · CFI · AP'],
        ['Degree', 'MBAA — ERAU'],
      ].map(([label, value]) => (
        <div class="flex gap-2 items-center">
          <span class="font-mono text-[#94a3b8] text-xs uppercase tracking-wider">{label}</span>
          <span class="font-mono text-[#38bdf8] text-xs">{value}</span>
        </div>
      ))}
    </div>
  </div>

  <!-- Content -->
  <section class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
    <div class="space-y-6 text-[#94a3b8] leading-relaxed">
      <p>
        Hello,
      </p>
      <p>
        I am Bryan Zandi, an aviation enthusiast, Airline Transport Pilot (ATP),
        Certified Flight Instructor (CFI), and Assistant Professor (AP). I hold a
        type rating for the wonderful Embraer 190 Jet and currently serve as a
        First Officer Pilot for one of the nation's leading regional airlines, flying
        the Embraer 175 jet out of Chicago O'Hare (ORD) International Airport.
      </p>
      <p>
        I earned my bachelor's degree in <strong class="text-[#f1f5f9]">Aeronautical Science</strong> with a minor in
        <strong class="text-[#f1f5f9]">Airport Management</strong> from Green River College in Auburn, WA, and
        graduated on June 15, 2018. My associate's degree was in Aviation with a
        focus on Airline Dispatch.
      </p>
      <p>
        On March 12, 2023, I proudly graduated from Embry-Riddle Aeronautical
        University (ERAU) with a <strong class="text-[#f1f5f9]">Master's in Business Administration in
        Aviation (MBAA)</strong> and a minor in Leadership. I plan to pursue a Ph.D. in
        Aviation or Leadership in Aviation at ERAU.
      </p>
      <p>
        For now, I cherish every moment spent flying passengers across the East
        Coast and Midwest. Once I meet the FAA's minimum requirements, my
        next milestone is upgrading to Captain or bringing my passion and
        expertise to a legacy airline, combining my experience in the cockpit with
        my academic background in aviation leadership.
      </p>
    </div>

    <div class="space-y-6">
      <img
        src="/images/about/bryan-cockpit-selfie.jpg"
        alt="Bryan Zandi in the cockpit"
        class="w-full rounded-lg border border-[#1e3a5f] shadow-lg shadow-[#38bdf8]/10"
      />
      <img
        src="/images/about/bryan-small-plane.jpg"
        alt="Bryan Zandi flying a small aircraft"
        class="w-full rounded-lg border border-[#1e3a5f] shadow-lg shadow-[#38bdf8]/10"
      />
    </div>
  </section>
</BaseLayout>
```

**Step 2: Verify**

`npm run dev` → /about loads, stat bar shows, bio text + 2 photos in 2-column layout.

**Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: build About Me page"
```

---

### Task 6: Build My Story Page

**Files:**
- Create: `src/pages/my-story.astro`
- Add: `public/docs/my-story-green-river.pdf` (download the PDF from Wix)

**Step 1: Download the PDF**

On the Wix My Story page, right-click the PDF icon → copy link → open in new tab → save as `public/docs/my-story-green-river.pdf`.

**Step 2: Create my-story.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="My Story">
  <!-- Page Hero -->
  <section class="relative h-64 flex items-end">
    <img src="/images/hero/airplane-hero.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">My Story</h1>
    </div>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-16">
    <!-- Portrait -->
    <div class="flex justify-center mb-12">
      <img
        src="/images/mystory/bryan-bw-portrait.jpg"
        alt="Bryan Zandi"
        class="w-72 rounded-lg border border-[#1e3a5f] grayscale"
      />
    </div>

    <!-- Story Text -->
    <div class="space-y-6 text-[#94a3b8] leading-relaxed text-lg">
      <p>
        My name is Bryan Zandi. I was born in 1982 in Iran when the devastating war between Iran and Iraq,
        which lasted eight years, had just begun. Ironically, growing up through the war and witnessing fighter
        jets flying overhead every day prompted my interest in aviation, and I dreamed of becoming a pilot.
        However, as a religious and political minority in my own country, I never had the opportunity to pursue
        my dream due to the intricate socio-political environment of the state. Therefore, I decided to veer my
        path and pursue a course entirely different field; hospitality. Even though I obtained a Bachelor's degree
        in hotel and tourism management and worked as a professional in hospitality for the next decade, I never
        stopped dreaming of becoming a pilot.
      </p>
      <p>
        In 2012, I was granted a US visa and immigrated to the land of opportunity with my wife and 3-year-old
        son. Initially, I intended to continue my education and get my Ph.D. in Hospitality Management. However,
        after communicating with various colleges and universities, I realized the objective was somewhat
        unachievable. Although most academic institutes validated my degree in hotel and tourism management
        after evaluation, they equated it to an associate's degree in the US. They suggested I study for a couple
        more years to obtain a grade equivalent to the US academic degree.
      </p>
      <p>
        I then decided to pursue a degree and career in aviation instead of redoing hospitality management from
        the beginning. On a late summer day in 2014, I walked into the office of the aviation department manager
        of Green River College and discussed my objective of becoming a pilot. He took the time to explain all the
        criteria to me and assisted me with enrolling in the Aviation program at Green River College. A few weeks
        later, I commenced my education in aviation by attending the first class of the course, Aviation 101! The
        college staff also helped me find a good flight school, and a few weeks later, I conducted my first-ever
        flight lesson on a Cessna 172 out of Crest Airpark (S36) in Kent, WA. It was an unforgettable day!
      </p>
      <p>
        I worked two jobs, one full-time and one part-time, to provide for my wife, son, and newborn baby and
        cover the flight school costs. I attended college classes from 7 a.m. to 1 p.m., worked at a grocery store
        from 1:30 to 3:30 p.m. as a freight crew member (stacking shelves), rested for six hours, and worked a
        graveyard shift as a hotel security officer, which allowed me to do my school assignments during my
        downtime. Four challenging but outstanding and unique years passed, and in June 2018, I graduated from
        Green River College's Aviation program with a bachelor's degree in Aeronautical Science. I continued my
        flight training at the Crest Airpark, and after successfully completing the Private Pilot training and adding
        an Instrument rating, I passed my Commercial Pilot check ride on a breezy Fall day and officially became a
        commercial pilot. However, with only 300 hours of flight time, I was far from getting an airline job. Thus, I
        decided to become a Certified Flight Instructor (CFI) to build flight hours.
      </p>
      <p>
        I graduated from the training and passed my ATP check ride with an Embraer 170-190 Type-Rating in
        November 2023. As a Chicago O'Hare International Airport-based airline pilot who transports passengers
        all over the Midwest and the East Coast, I can tell the years of hard work paid off, and I made my piloting
        dream come true!
      </p>
      <p>
        My next five-year goal is to gain more experience in the Part-121 world and then transition to a legacy air
        career. Initially, I aimed for Delta Airlines since they are based at Sea-Tac International Airport in Seattle.
        However, in January 2025, my family and I decided to change the scenery and move to Queen City,
        Charlotte, North Carolina. Thus, I now plan to apply with American Airlines since Charlotte Douglas
        International Airport is its second-largest hub in the United States.
      </p>
      <p class="text-[#f1f5f9] font-semibold">
        My life journey has taught me that the road to success passes through transparent dreams, thorough
        planning, and proper actions. <span class="font-normal text-[#94a3b8]">I want to finish this narrative with a precious quote from my favorite actor,
        Denzel Washington:</span>
      </p>
      <blockquote class="border-l-2 border-[#f59e0b] pl-4 italic">
        "Dreams without goals are just dreams, and they ultimately fuel disappointment! On the road to achieving
        your dreams, you must apply discipline, but more importantly, consistency. Because without commitment,
        you will never start, but without consistency, you never finish!"
      </blockquote>
    </div>

    <!-- PDF Download -->
    <div class="mt-12 text-center">
      <p class="font-mono text-[#94a3b8] text-sm uppercase tracking-widest mb-4">
        · · · PDF Version · · ·
      </p>
      <a
        href="/docs/my-story-green-river.pdf"
        download
        class="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0f1e] font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download — My Story Published by Green River College
      </a>
    </div>
  </section>
</BaseLayout>
```

**Step 3: Verify**

`npm run dev` → /my-story loads, portrait shows, story text readable, PDF download button visible.

**Step 4: Commit**

```bash
git add src/pages/my-story.astro public/docs/
git commit -m "feat: build My Story page with PDF download"
```

---

### Task 7: Build Photos Page

**Files:**
- Create: `src/pages/photos.astro`

**Step 1: Create photos.astro**

First, list all images you saved in `public/images/photos/`. Replace the array below with your actual filenames.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

// Update this list with all actual filenames in public/images/photos/
const photos = [
  { src: '/images/photos/photo-01.jpg', alt: 'Cockpit selfie in sunglasses' },
  { src: '/images/photos/photo-02.jpg', alt: 'Professional portrait in uniform' },
  { src: '/images/photos/photo-03.jpg', alt: 'In the cockpit on the flight deck' },
  { src: '/images/photos/photo-04.jpg', alt: 'Cockpit instruments close-up' },
  { src: '/images/photos/photo-05.jpg', alt: 'Group photo at American Airlines gate D35' },
  // Add more as needed
];
---

<BaseLayout title="Photos">
  <!-- Page Hero -->
  <section class="relative h-64 flex items-end">
    <img src="/images/hero/airplane-hero.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">Photos</h1>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {photos.map((photo) => (
        <div class="break-inside-avoid group relative overflow-hidden rounded-lg border border-[#1e3a5f] hover:border-[#38bdf8]/50 transition-all duration-300">
          <img
            src={photo.src}
            alt={photo.alt}
            class="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </section>
</BaseLayout>
```

**Step 2: Verify**

`npm run dev` → /photos shows masonry grid, photos load, hover scale works.

**Step 3: Commit**

```bash
git add src/pages/photos.astro
git commit -m "feat: build Photos gallery page"
```

---

### Task 8: Set Up Astro Content Collections for Blog

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/` directory with 6 .md files

**Step 1: Create content collection config**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['Leadership', 'Egoism']),
    excerpt: z.string(),
    coverImage: z.string(),
    readTime: z.string(),
  }),
});

export const collections = { blog };
```

**Step 2: Create blog post Markdown files**

Visit each Wix blog post URL to copy the full content. Create one file per post:

**`src/content/blog/practice-coaching.md`**
```markdown
---
title: "Practice Coaching"
date: 2023-04-08
category: "Leadership"
excerpt: "Bryan Zandi – MBA Master's in leadership (OBLD 641) Resonant Leadership: Leading Change Oct. 2022 Embry-Riddle Aeronautical University..."
coverImage: "/images/blog/practice-coaching.jpg"
readTime: "5 min read"
---

[Visit the Wix blog post and copy the full text here]
```

Create the same structure for all 6 posts:
- `src/content/blog/compassion-as-power.md` — date: 2023-04-08, category: Leadership
- `src/content/blog/rise-and-fall-of-spicejet.md` — date: 2023-04-08, category: Egoism
- `src/content/blog/leadership-gap.md` — date: 2022-10-15, category: Leadership
- `src/content/blog/the-train-dilemma.md` — date: 2022-05-18, category: Egoism
- `src/content/blog/theories-of-ethics.md` — date: 2022-05-18, category: Egoism

Also download each blog post's cover image and save to `public/images/blog/`.

**Step 3: Verify collections are recognized**

```bash
npm run dev
```
No TypeScript errors in the terminal. If Astro shows content collection errors, check that all frontmatter fields match the schema in `config.ts`.

**Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add blog content collection with 6 posts"
```

---

### Task 9: Build Blog Index Page

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/components/BlogCard.astro`

**Step 1: Create BlogCard component**

```astro
---
// src/components/BlogCard.astro
interface Props {
  title: string;
  date: Date;
  category: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  slug: string;
}

const { title, date, category, excerpt, coverImage, readTime, slug } = Astro.props;
const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---

<article class="bg-[#111827] border border-[#1e3a5f] rounded-lg overflow-hidden hover:border-[#38bdf8]/50 transition-all duration-300 group">
  <a href={`/blog/${slug}`} class="block">
    <div class="relative overflow-hidden h-48">
      <img
        src={coverImage}
        alt={title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span class={`absolute top-3 right-3 font-mono text-xs px-2 py-1 rounded
        ${category === 'Leadership'
          ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30'
          : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
        }`}>
        {category}
      </span>
    </div>
    <div class="p-5">
      <div class="flex items-center gap-3 mb-3">
        <span class="font-mono text-[#94a3b8] text-xs">{formattedDate}</span>
        <span class="text-[#1e3a5f]">·</span>
        <span class="font-mono text-[#94a3b8] text-xs">{readTime}</span>
      </div>
      <h3 class="text-[#f1f5f9] font-semibold text-lg mb-2 group-hover:text-[#38bdf8] transition-colors">
        {title}
      </h3>
      <p class="text-[#94a3b8] text-sm leading-relaxed line-clamp-3">{excerpt}</p>
    </div>
  </a>
</article>
```

**Step 2: Create blog index page**

```astro
---
// src/pages/blog/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const sortedPosts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const categories = ['All Posts', 'Leadership', 'Egoism'];
const activeCategory = Astro.url.searchParams.get('category') || 'All Posts';
const filtered = activeCategory === 'All Posts'
  ? sortedPosts
  : sortedPosts.filter(p => p.data.category === activeCategory);
---

<BaseLayout title="Blogs">
  <section class="relative h-64 flex items-end">
    <img src="/images/hero/airplane-hero.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">Blogs</h1>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-16">
    <!-- Category Filter -->
    <div class="flex gap-2 mb-10 flex-wrap">
      {categories.map(cat => (
        <a
          href={cat === 'All Posts' ? '/blog' : `/blog?category=${cat}`}
          class={`px-4 py-2 rounded font-mono text-sm transition-all
            ${activeCategory === cat
              ? 'bg-[#f59e0b] text-[#0a0f1e] font-semibold'
              : 'bg-[#111827] text-[#94a3b8] border border-[#1e3a5f] hover:border-[#38bdf8]/50 hover:text-[#f1f5f9]'
            }`}
        >
          {cat}
        </a>
      ))}
    </div>

    <!-- Blog Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map(post => (
        <BlogCard
          title={post.data.title}
          date={post.data.date}
          category={post.data.category}
          excerpt={post.data.excerpt}
          coverImage={post.data.coverImage}
          readTime={post.data.readTime}
          slug={post.slug}
        />
      ))}
    </div>
  </section>
</BaseLayout>
```

**Step 3: Verify**

`npm run dev` → /blog shows 6 post cards in a grid, category filter buttons work.

**Step 4: Commit**

```bash
git add src/pages/blog/index.astro src/components/BlogCard.astro
git commit -m "feat: build blog index page with category filter"
```

---

### Task 10: Build Blog Post Page

**Files:**
- Create: `src/pages/blog/[slug].astro`

**Step 1: Create dynamic blog post route**

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.slug } }));
}

const { slug } = Astro.params;
const post = await getEntry('blog', slug);
if (!post) return Astro.redirect('/blog');

const { Content } = await post.render();
const formattedDate = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});
---

<BaseLayout title={post.data.title}>
  <!-- Post Hero -->
  <section class="relative h-72 flex items-end">
    <img src={post.data.coverImage} alt={post.data.title} class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-[#0a0f1e]/75"></div>
    <div class="relative z-10 max-w-4xl mx-auto px-6 pb-8 w-full">
      <div class="flex items-center gap-3 mb-3">
        <span class="font-mono text-[#94a3b8] text-xs">{formattedDate}</span>
        <span class="text-[#1e3a5f]">·</span>
        <span class="font-mono text-[#94a3b8] text-xs">{post.data.readTime}</span>
        <span class="text-[#1e3a5f]">·</span>
        <span class={`font-mono text-xs px-2 py-0.5 rounded
          ${post.data.category === 'Leadership'
            ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30'
            : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
          }`}>
          {post.data.category}
        </span>
      </div>
      <h1 class="text-4xl font-bold text-white">{post.data.title}</h1>
    </div>
  </section>

  <!-- Post Content -->
  <article class="max-w-4xl mx-auto px-6 py-16">
    <div class="prose prose-invert prose-lg max-w-none
      prose-headings:text-[#f1f5f9] prose-headings:font-semibold
      prose-p:text-[#94a3b8] prose-p:leading-relaxed
      prose-strong:text-[#f1f5f9]
      prose-blockquote:border-l-[#38bdf8] prose-blockquote:text-[#94a3b8]">
      <Content />
    </div>

    <div class="mt-12 pt-8 border-t border-[#1e3a5f]">
      <a href="/blog" class="font-mono text-sm text-[#38bdf8] hover:text-[#f59e0b] transition-colors">
        ← Back to all posts
      </a>
    </div>
  </article>
</BaseLayout>
```

**Step 2: Install Tailwind Typography plugin**

```bash
npm install -D @tailwindcss/typography
```

Add to `tailwind.config.mjs`:
```js
plugins: [require('@tailwindcss/typography')],
```

**Step 3: Verify**

`npm run dev` → click any blog card → post page loads with hero image, title, content renders.

**Step 4: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: build blog post page with prose styling"
```

---

### Task 11: Build Articles Page

**Files:**
- Create: `src/pages/articles.astro`

**Step 1: Create articles.astro**

This is a simple redirect/link page since Articles just links to Academia.edu.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Articles">
  <section class="relative h-64 flex items-end">
    <img src="/images/hero/airplane-hero.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">Articles</h1>
    </div>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-24 text-center">
    <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-4">· · · Academic Publications · · ·</p>
    <h2 class="text-2xl font-bold text-[#f1f5f9] mb-4">Embry-Riddle Aeronautical University</h2>
    <p class="text-[#94a3b8] mb-10 leading-relaxed">
      Bryan's academic articles and research publications are hosted on Academia.edu through
      Embry-Riddle Aeronautical University.
    </p>
    <a
      href="https://erau.academia.edu/BryanZandi"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0a0f1e] font-semibold px-8 py-4 rounded-lg transition-colors"
    >
      View Articles on Academia.edu
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  </section>
</BaseLayout>
```

**Step 2: Commit**

```bash
git add src/pages/articles.astro
git commit -m "feat: build Articles page linking to Academia.edu"
```

---

### Task 12: Build Contact Page

**Files:**
- Create: `src/pages/contact.astro`
- Add: `public/docs/resume.pdf` (download resume from Wix contact page)

**Pre-requisite:** Create a free account at formspree.io. Create a new form. Copy the form endpoint URL (looks like `https://formspree.io/f/XXXXXXXX`). Replace `YOUR_FORMSPREE_ID` below.

Also download the Resume PDF from the Wix contact page.

**Step 1: Create contact.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Contact Me">
  <section class="relative h-64 flex items-end">
    <img src="/images/hero/airplane-hero.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" />
    <div class="absolute inset-0 bg-[#0a0f1e]/70"></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 pb-8 w-full">
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-1">Portfolio</p>
      <h1 class="text-4xl font-bold text-white">Contact Me</h1>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
    <!-- Left: Contact Info (boarding pass style) -->
    <div class="bg-[#111827] border border-[#1e3a5f] rounded-lg p-8 space-y-8">
      <div>
        <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-4">Contact Information</p>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="font-mono text-[#94a3b8] text-sm w-16">Cell</span>
            <a href="tel:+12066025067" class="text-[#f1f5f9] hover:text-[#38bdf8] transition-colors">
              +1 (206) 602-5067
            </a>
          </div>
          <div class="flex items-start gap-3">
            <span class="font-mono text-[#94a3b8] text-sm w-16">Email</span>
            <div class="space-y-1">
              <a href="mailto:Bryan@Zandi.vip" class="block text-[#f1f5f9] hover:text-[#38bdf8] transition-colors">
                Bryan@Zandi.vip
              </a>
              <a href="mailto:Bryan.Zandi33@gmail.com" class="block text-[#f1f5f9] hover:text-[#38bdf8] transition-colors">
                Bryan.Zandi33@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-[#1e3a5f] pt-6">
        <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-4">Social Media</p>
        <div class="flex gap-4">
          <a href="https://www.linkedin.com/in/bryanzandi" target="_blank" rel="noopener noreferrer"
             class="bg-[#0a0f1e] border border-[#1e3a5f] hover:border-[#38bdf8] text-[#94a3b8] hover:text-[#38bdf8] px-4 py-2 rounded font-mono text-sm transition-all">
            LinkedIn
          </a>
          <a href="https://twitter.com/bryanzandi" target="_blank" rel="noopener noreferrer"
             class="bg-[#0a0f1e] border border-[#1e3a5f] hover:border-[#38bdf8] text-[#94a3b8] hover:text-[#38bdf8] px-4 py-2 rounded font-mono text-sm transition-all">
            X
          </a>
          <a href="https://www.facebook.com/bryanzandi" target="_blank" rel="noopener noreferrer"
             class="bg-[#0a0f1e] border border-[#1e3a5f] hover:border-[#38bdf8] text-[#94a3b8] hover:text-[#38bdf8] px-4 py-2 rounded font-mono text-sm transition-all">
            Facebook
          </a>
        </div>
      </div>

      <div class="border-t border-[#1e3a5f] pt-6">
        <a
          href="/docs/resume.pdf"
          download
          class="inline-flex items-center gap-2 w-full justify-center bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0f1e] font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Resume
        </a>
      </div>
    </div>

    <!-- Right: Contact Form -->
    <div>
      <p class="font-mono text-[#38bdf8] text-xs tracking-widest uppercase mb-6">Send a Message</p>
      <form
        action="https://formspree.io/f/YOUR_FORMSPREE_ID"
        method="POST"
        class="space-y-4"
      >
        <div>
          <label for="name" class="block font-mono text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Name *</label>
          <input type="text" id="name" name="name" required
            class="w-full bg-[#111827] border border-[#1e3a5f] focus:border-[#38bdf8] rounded px-4 py-3 text-[#f1f5f9] outline-none transition-colors" />
        </div>
        <div>
          <label for="email" class="block font-mono text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Email *</label>
          <input type="email" id="email" name="email" required
            class="w-full bg-[#111827] border border-[#1e3a5f] focus:border-[#38bdf8] rounded px-4 py-3 text-[#f1f5f9] outline-none transition-colors" />
        </div>
        <div>
          <label for="phone" class="block font-mono text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Phone (Optional)</label>
          <input type="tel" id="phone" name="phone"
            class="w-full bg-[#111827] border border-[#1e3a5f] focus:border-[#38bdf8] rounded px-4 py-3 text-[#f1f5f9] outline-none transition-colors" />
        </div>
        <div>
          <label for="subject" class="block font-mono text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Subject</label>
          <input type="text" id="subject" name="subject"
            class="w-full bg-[#111827] border border-[#1e3a5f] focus:border-[#38bdf8] rounded px-4 py-3 text-[#f1f5f9] outline-none transition-colors" />
        </div>
        <div>
          <label for="message" class="block font-mono text-[#94a3b8] text-xs uppercase tracking-wider mb-1">Message *</label>
          <textarea id="message" name="message" required rows="5"
            class="w-full bg-[#111827] border border-[#1e3a5f] focus:border-[#38bdf8] rounded px-4 py-3 text-[#f1f5f9] outline-none transition-colors resize-none"></textarea>
        </div>
        <button type="submit"
          class="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0a0f1e] font-semibold py-3 rounded-lg transition-colors font-mono">
          Send Message
        </button>
      </form>
    </div>
  </section>
</BaseLayout>
```

**Step 2: Verify**

`npm run dev` → /contact shows two-column layout, form renders, download button visible.

**Step 3: Commit**

```bash
git add src/pages/contact.astro public/docs/resume.pdf
git commit -m "feat: build Contact page with Formspree form"
```

---

### Task 13: Configure GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `astro.config.mjs`

**Step 1: Update astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://YOUR_GITHUB_USERNAME.github.io',
  base: '/bryan-zandi-portfolio',  // remove if using custom domain
  output: 'static',
});
```

Replace `YOUR_GITHUB_USERNAME` with the actual GitHub username.
If using a custom domain (e.g. `bryanzandi.com`), set `site` to that and remove `base`.

**Step 2: Create GitHub Actions workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Create GitHub repo and push**

```bash
# Create repo on GitHub first (github.com → New Repository → "bryan-zandi-portfolio")
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bryan-zandi-portfolio.git
git branch -M main
git push -u origin main
```

**Step 4: Enable GitHub Pages**

In the GitHub repo → Settings → Pages → Source: "GitHub Actions". Wait for the Action to complete (1-2 min). The site will be live at `https://YOUR_USERNAME.github.io/bryan-zandi-portfolio/`.

**Step 5: Commit**

```bash
git add .github/ astro.config.mjs
git commit -m "feat: add GitHub Pages deployment workflow"
git push
```

---

### Task 14: Final Polish & Mobile Check

**Files:**
- Various (fix responsive issues)

**Step 1: Test mobile layout**

In browser DevTools → toggle device toolbar → check at 375px (iPhone) and 768px (iPad) widths for all 7 pages. Common fixes needed:
- Nav wraps on small screens — add `md:flex hidden` hamburger menu or just allow wrapping
- Hero text size — reduce on mobile with `text-4xl md:text-8xl`
- Two-column layouts collapse correctly on mobile

**Step 2: Add a 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="404 — Page Not Found">
  <div class="min-h-screen flex items-center justify-center text-center px-6">
    <div>
      <p class="font-mono text-[#38bdf8] text-8xl font-bold mb-4">404</p>
      <h1 class="text-2xl font-bold text-[#f1f5f9] mb-4">Lost in the clouds</h1>
      <p class="text-[#94a3b8] mb-8">This page doesn't exist. Let's get you back on course.</p>
      <a href="/" class="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0f1e] font-semibold px-6 py-3 rounded-lg transition-colors">
        Return Home
      </a>
    </div>
  </div>
</BaseLayout>
```

**Step 3: Run final build check**

```bash
npm run build
```
Expected: Build completes with no errors, `dist/` folder created.

**Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: add 404 page and final mobile polish"
git push
```

---

## Post-Launch Checklist

- [ ] Verify live site loads at GitHub Pages URL
- [ ] Test all nav links
- [ ] Test contact form (submit a test message, check Formspree dashboard)
- [ ] Test PDF downloads (My Story, Resume)
- [ ] Confirm Articles link opens Academia.edu in new tab
- [ ] Check all images load (no broken images)
- [ ] Test on mobile device
- [ ] Share URL with Bryan's dad to review

## Optional Future Enhancements

- Add custom domain (e.g. `bryanzandi.com`) — update `astro.config.mjs` `site` field + add CNAME file to `public/`
- Add mobile hamburger menu for nav
- Add `og:image` meta tags for social sharing
- Add a resume viewer (PDF embed) instead of just download
