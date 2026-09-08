# KG Sports Therapy — Foundation + Public Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the KG Sports Therapy marketing site (Home, Services, About, Contact) with a lead-capture enquiry form, matching the black/cream logo design, as a static Next.js site on GitHub Pages backed by Supabase.

**Architecture:** A Next.js 16 App Router project built with `output: "export"` (fully static HTML/CSS/JS, no server) so it can be hosted on GitHub Pages. The browser talks directly to Supabase Postgres via the public anon key for lead capture; Row Level Security restricts the public to insert-only access. A GitHub Actions workflow builds and deploys the static export on every push to `main`.

**Tech Stack:** Next.js 16.3.4 (App Router, TypeScript, React 19.2.8), Tailwind CSS v4 (CSS-first `@theme` config), `@supabase/supabase-js` 2.116.0, Vitest 5.0.0 for unit tests, GitHub Actions + official `actions/*-pages` actions for deployment.

Design spec: `docs/superpowers/specs/2026-09-08-foundation-website-design.md`

## Global Constraints

- UK English spelling throughout all copy (e.g. "specialise", "programme"). Prices in £. Dates, where shown, in DD/MM/YYYY.
- Static export only: no API routes, no middleware, no server components that require a server at runtime. Security is enforced by Supabase Row Level Security, not by hiding routes.
- `leads` table: Row Level Security enabled; the only policy is `anon` `INSERT`. No `SELECT`/`UPDATE`/`DELETE` policy exists for any role yet (added in the admin console sub-project).
- Services (name/description/price/duration) live in `content/services.ts`, not in the database.
- Out of scope for this plan (do not build): admin login/dashboard, any booking/appointment flow, email notifications on new leads, custom domain. These belong to later sub-projects per the design spec.
- Next.js version `16.3.4` exactly (pin in `package.json`, do not float to `latest`). React `19.2.8`.
- Tailwind CSS v4 CSS-first config (`@theme` block in `app/globals.css`) — no `tailwind.config.ts` file.
- Design tokens (exact values, use everywhere — do not re-derive):
  - `--color-cream: #f6f3ec` (background)
  - `--color-ink: #14120f` (primary text / logo badge fill)
  - `--color-ink-muted: #5c574d` (secondary text)
  - `--color-line: #dad4c7` (borders/dividers)
  - Heading font: Archivo Black (`--font-heading`)
  - Tagline/accent font: Playfair Display, italic (`--font-accent`)
  - Body/label font: Work Sans (`--font-body`)
  - No dark-mode variant — the palette above is fixed regardless of system theme.
- Repository name: `kg-sports-therapy`. Deployed via GitHub Actions to GitHub Pages at `https://<username>.github.io/kg-sports-therapy/`. `next.config.ts` must set `basePath`/`assetPrefix` to `/kg-sports-therapy` accordingly.
- Supabase project: organization `Tom Lawsons Projects` (id `elnsbyepozsiiyokjakp`), region `eu-west-2` (London), project name `kg-sports-therapy`.
- Import alias `@/*` maps to the project root (e.g. `@/components/Header`, `@/lib/supabaseClient`).

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire Next.js project skeleton in the repo root (via `create-next-app`)
- Modify: `next.config.ts`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (unused template assets)

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a working Next.js project with `npm run dev`, `npm run build`, `npm run lint` scripts; `next.config.ts` exporting a `NextConfig` configured for static export at basePath `/kg-sports-therapy`

- [ ] **Step 1: Scaffold with create-next-app**

Run from the repo root (`/run/media/tomlawson/Games_V2/Web Development/KG Sports Therapy`):

```bash
npx --yes create-next-app@16.3.4 . --typescript --tailwind --eslint --app --import-alias "@/*" --disable-git --use-npm --yes
```

Expected: command completes with "Success!" and creates `app/`, `public/`, `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` alongside the existing `docs/` folder and `Coming soon image.jpg`. `--disable-git` is required because this directory is already a git repo.

- [ ] **Step 2: Configure static export for GitHub Pages**

Replace the full contents of `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const REPO_NAME = "kg-sports-therapy";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: `/${REPO_NAME}`,
  assetPrefix: `/${REPO_NAME}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Remove unused template assets**

```bash
rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 4: Verify the dev server runs**

```bash
npm run dev
```

Expected: starts without errors on port 3000. Because of `basePath`, the app is served at `http://localhost:3000/kg-sports-therapy/` (not the bare root — a request to `/` will 404, that's expected). Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 5: Verify the production static export builds**

```bash
npm run build
```

Expected: build completes successfully and prints a route summary; an `out/` directory is created containing `index.html` under `out/kg-sports-therapy/` — actually with `basePath` set, output still lands in `out/` at the project root (the basePath only affects served URLs, not the export folder structure). Confirm `out/index.html` exists:

```bash
ls out/index.html
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js project with static export for GitHub Pages"
```

---

### Task 2: Design tokens and root layout shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: Tailwind utility classes `bg-cream`, `text-cream`, `text-ink`, `text-ink-muted`, `border-line`, `font-heading`, `font-accent`, `font-body`, available to every later task. Root `RootLayout` component sets `lang="en-GB"` and loads the three brand fonts (Header/Footer are wired in during Task 3, not this one).

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme inline {
  --color-cream: #f6f3ec;
  --color-ink: #14120f;
  --color-ink-muted: #5c574d;
  --color-line: #dad4c7;

  --font-heading: var(--font-archivo-black);
  --font-accent: var(--font-playfair);
  --font-body: var(--font-work-sans);
}

body {
  background-color: var(--color-cream);
  color: var(--color-ink);
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Archivo_Black, Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  style: ["italic"],
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KG Sports Therapy",
  description:
    "KG Sports Therapy — sports massage, injury assessment, and rehabilitation. Move. Recover. Repeat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivoBlack.variable} ${playfairDisplay.variable} ${workSans.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-cream font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify it builds**

```bash
npm run build
```

Expected: succeeds with no type or lint errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "Add brand design tokens and font loading to root layout"
```

---

### Task 3: Shared components — logo badge, header, footer

**Files:**
- Create: `components/navLinks.ts`
- Create: `components/LogoBadge.tsx`
- Create: `components/Header.tsx`
- Create: `components/MobileNav.tsx`
- Create: `components/Footer.tsx`
- Create: `components/Section.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: design tokens from Task 2 (`bg-cream`, `text-ink`, `font-heading`, etc.)
- Produces:
  - `NAV_LINKS: { href: string; label: string }[]` from `components/navLinks.ts`
  - `LogoBadge({ size?: "sm" | "lg" })` from `components/LogoBadge.tsx`
  - `Header()` from `components/Header.tsx`
  - `Footer()` from `components/Footer.tsx`
  - `Section({ children, className? })` from `components/Section.tsx` — used by every page task from here on

- [ ] **Step 1: Create `components/navLinks.ts`**

```ts
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;
```

- [ ] **Step 2: Create `components/LogoBadge.tsx`**

```tsx
type LogoBadgeSize = "sm" | "lg";

interface LogoBadgeProps {
  size?: LogoBadgeSize;
}

const VARIANTS: Record<
  LogoBadgeSize,
  { wrapper: string; initials: string; label: string }
> = {
  sm: {
    wrapper: "h-14 w-14 border",
    initials: "text-xl",
    label: "text-[6px] tracking-[0.2em] mt-0.5",
  },
  lg: {
    wrapper: "h-48 w-48 sm:h-60 sm:w-60 border-2",
    initials: "text-5xl sm:text-6xl",
    label: "text-xs sm:text-sm tracking-[0.35em] mt-2",
  },
};

export function LogoBadge({ size = "lg" }: LogoBadgeProps) {
  const variant = VARIANTS[size];

  return (
    <div
      className={`${variant.wrapper} relative flex shrink-0 items-center justify-center rounded-full bg-ink text-cream`}
    >
      <div className="absolute inset-[8%] rounded-full border border-cream/40" />
      <div className="relative flex flex-col items-center px-3 text-center">
        <span className={`${variant.initials} font-heading leading-none`}>
          KG
        </span>
        <span
          className={`${variant.label} font-body font-semibold uppercase text-cream`}
        >
          Sports Therapy
        </span>
        {size === "lg" ? (
          <span className="mt-3 font-accent text-sm italic text-cream/90 sm:text-base">
            Move · Recover · Repeat
          </span>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/MobileNav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/components/navLinks";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-6 bg-ink" />
        <span className="h-0.5 w-6 bg-ink" />
        <span className="h-0.5 w-6 bg-ink" />
      </button>
      {isOpen ? (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-cream px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-2 font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/Header.tsx`**

```tsx
import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { MobileNav } from "@/components/MobileNav";
import { NAV_LINKS } from "@/components/navLinks";

export function Header() {
  return (
    <header className="relative border-b border-line bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoBadge size="sm" />
          <span className="font-heading text-sm uppercase tracking-[0.2em]">
            KG Sports Therapy
          </span>
        </Link>
        <nav className="hidden gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink hover:text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Create `components/Footer.tsx`**

```tsx
import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { NAV_LINKS } from "@/components/navLinks";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12 text-center">
        <LogoBadge size="sm" />
        <nav className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink hover:text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4 font-body text-sm uppercase tracking-[0.15em] text-ink-muted">
          <span>[Facebook]</span>
          <span>[Instagram]</span>
        </div>
        <p className="font-body text-xs text-ink-muted">
          © {new Date().getFullYear()} KG Sports Therapy. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Create `components/Section.tsx`**

```tsx
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`mx-auto max-w-5xl px-6 py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}
```

- [ ] **Step 7: Wire Header/Footer into `app/layout.tsx`**

Update the `body` in `app/layout.tsx` (from Task 2) to:

```tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
```

Add those two imports at the top alongside the existing ones, and change the `body` element to:

```tsx
      <body className="flex min-h-screen flex-col bg-cream font-body text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
```

- [ ] **Step 8: Verify it builds**

```bash
npm run build
```

Expected: succeeds with no errors (the default `app/page.tsx` template content still renders inside the new Header/Footer at this point — that's fine, Task 5 replaces it).

- [ ] **Step 9: Commit**

```bash
git add components app/layout.tsx
git commit -m "Add logo badge, header, footer, and section components"
```

---

### Task 4: Services content and service card

**Files:**
- Create: `content/services.ts`
- Create: `components/ServiceCard.tsx`

**Interfaces:**
- Consumes: design tokens from Task 2
- Produces:
  - `interface Service { slug: string; name: string; description: string; price: string; duration: string }` and `services: Service[]` from `content/services.ts` — consumed by Task 5 (Home), Task 6 (Services page), and Task 10 (Contact form's service dropdown)
  - `ServiceCard({ service: Service })` from `components/ServiceCard.tsx` — consumed by Task 5 and Task 6

- [ ] **Step 1: Create `content/services.ts`**

```ts
export interface Service {
  slug: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export const services: Service[] = [
  {
    slug: "sports-massage",
    name: "Sports Massage",
    description:
      "Deep tissue work to ease muscle tension, speed up recovery, and keep you moving between training sessions.",
    price: "£45",
    duration: "60 minutes",
  },
  {
    slug: "injury-assessment",
    name: "Injury Assessment",
    description:
      "A thorough assessment to identify the cause of pain or injury and build a plan to get you back to full fitness.",
    price: "£40",
    duration: "45 minutes",
  },
  {
    slug: "rehabilitation-programme",
    name: "Rehabilitation Programme",
    description:
      "A structured, hands-on programme of exercises and treatment to rebuild strength and mobility after injury.",
    price: "£50",
    duration: "60 minutes",
  },
];
```

- [ ] **Step 2: Create `components/ServiceCard.tsx`**

```tsx
import type { Service } from "@/content/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="flex flex-col gap-3 border border-line p-6">
      <h3 className="font-heading text-lg uppercase tracking-[0.05em]">
        {service.name}
      </h3>
      <p className="font-body text-sm text-ink-muted">
        {service.description}
      </p>
      <p className="font-body text-sm font-semibold uppercase tracking-[0.1em]">
        {service.price} · {service.duration}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify it builds**

```bash
npm run build
```

Expected: succeeds (these files aren't imported anywhere yet, but TypeScript still checks them).

- [ ] **Step 4: Commit**

```bash
git add content components/ServiceCard.tsx
git commit -m "Add services content and service card component"
```

---

### Task 5: Home page

**Files:**
- Modify: `app/page.tsx` (replace the default `create-next-app` template content entirely)

**Interfaces:**
- Consumes: `LogoBadge` (Task 3), `Section` (Task 3), `ServiceCard` and `services` (Task 4)
- Produces: `app/page.tsx` default export `HomePage`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/content/services";

const VALUE_PROPS = [
  {
    title: "Sports-specific expertise",
    body: "Treatment built around the demands of your sport, not a generic routine.",
  },
  {
    title: "Hands-on rehabilitation",
    body: "A clear, structured plan to get you from injury back to full training.",
  },
  {
    title: "Flexible appointments",
    body: "Evening and weekend slots to fit around training and match schedules.",
  },
];

export default function HomePage() {
  return (
    <>
      <Section className="flex flex-col items-center gap-8 text-center">
        <LogoBadge size="lg" />
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl uppercase leading-tight sm:text-5xl">
            Move. Recover. Repeat.
          </h1>
          <p className="mx-auto max-w-xl font-accent text-lg italic text-ink-muted">
            Sports therapy built around getting you back to what you love.
          </p>
        </div>
        <Link
          href="/contact/"
          className="rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-cream hover:bg-ink-muted"
        >
          Get in Touch
        </Link>
      </Section>

      <Section className="grid gap-10 border-t border-line sm:grid-cols-3">
        {VALUE_PROPS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 text-center sm:text-left"
          >
            <h2 className="font-heading text-sm uppercase tracking-[0.15em]">
              {item.title}
            </h2>
            <p className="font-body text-sm text-ink-muted">{item.body}</p>
          </div>
        ))}
      </Section>

      <Section className="border-t border-line">
        <h2 className="mb-10 text-center font-heading text-2xl uppercase tracking-[0.1em]">
          Services
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services/"
            className="font-body text-sm font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
          >
            View all services
          </Link>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: succeeds with no errors.

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000/kg-sports-therapy/` in a browser (or use the `mcp__chrome-devtools__navigate_page` + `mcp__chrome-devtools__take_screenshot` tools if available) and confirm: logo badge renders centred, headline in the heavy heading font, italic tagline, three value props, three service cards with placeholder copy in £. Stop the server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "Build home page"
```

---

### Task 6: Services page

**Files:**
- Create: `app/services/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 3), `ServiceCard` and `services` (Task 4)
- Produces: `app/services/page.tsx` default export `ServicesPage`, reachable at `/services/`

- [ ] **Step 1: Create `app/services/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services — KG Sports Therapy",
  description:
    "Sports massage, injury assessment, and rehabilitation programmes at KG Sports Therapy.",
};

export default function ServicesPage() {
  return (
    <Section className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
          Services
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-lg italic text-ink-muted">
          Treatment plans built around your recovery.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: succeeds; route list includes `/services`.

- [ ] **Step 3: Commit**

```bash
git add app/services
git commit -m "Build services page"
```

---

### Task 7: About page

**Files:**
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `Section` (Task 3)
- Produces: `app/about/page.tsx` default export `AboutPage`, reachable at `/about/`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Section } from "@/components/Section";

const QUALIFICATIONS = [
  "[BSc (Hons) Sports Therapy]",
  "[Sports Massage Therapy Diploma]",
  "[First Aid for Sport]",
  "[Member, Society of Sports Therapists]",
];

export const metadata: Metadata = {
  title: "About — KG Sports Therapy",
  description: "Meet your sports therapist at KG Sports Therapy.",
};

export default function AboutPage() {
  return (
    <Section className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
          About
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-lg italic text-ink-muted">
          Move. Recover. Repeat.
        </p>
      </div>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <h2 className="font-heading text-xl uppercase tracking-[0.1em]">
          [Therapist Name]
        </h2>
        <p className="font-body text-ink-muted">
          [Add your bio here] A qualified sports therapist working with
          athletes and active people of all levels, from weekend runners to
          semi-professional teams — helping clients recover from injury and
          get back to doing what they love, faster and stronger.
        </p>
        <div>
          <h3 className="font-heading text-sm uppercase tracking-[0.15em]">
            Qualifications
          </h3>
          <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-ink-muted">
            {QUALIFICATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: succeeds; route list includes `/about`.

- [ ] **Step 3: Commit**

```bash
git add app/about
git commit -m "Build about page"
```

---

### Task 8: Supabase project, leads table, and client

**Files:**
- Create: `lib/supabaseClient.ts`
- Create: `.env.example`
- Create: `.env.local` (git-ignored — confirm `.gitignore` already excludes `.env*.local`, which the `create-next-app` template does by default)
- Modify: `package.json` (add `@supabase/supabase-js` dependency)

**Interfaces:**
- Consumes: nothing new
- Produces: a live Supabase project with a `leads` table; `supabase` client export from `lib/supabaseClient.ts` (`import { supabase } from "@/lib/supabaseClient"`) — consumed by Task 10

**This task creates a real, potentially billable cloud resource.** Confirm cost with the user before creating the project, per the steps below.

- [ ] **Step 1: Get the cost of a new Supabase project**

Call the `mcp__claude_ai_Supabase__get_cost` tool with `type: "project"` and `organization_id: "elnsbyepozsiiyokjakp"`. Report the returned amount to the user in plain terms (e.g. "this org's plan means new projects cost $X/month — Supabase's free tier covers most small sites") before proceeding.

- [ ] **Step 2: Confirm the cost**

Call `mcp__claude_ai_Supabase__confirm_cost` with `type: "project"`, the `recurrence` and `amount` returned from Step 1. Keep the returned `confirm_cost_id` for the next step.

- [ ] **Step 3: Create the project**

Call `mcp__claude_ai_Supabase__create_project` with:
- `name`: `kg-sports-therapy`
- `region`: `eu-west-2`
- `organization_id`: `elnsbyepozsiiyokjakp`
- `confirm_cost_id`: (from Step 2)

- [ ] **Step 4: Wait for the project to become active**

Poll `mcp__claude_ai_Supabase__get_project` with the new project's `id` every ~10 seconds until `status` is `ACTIVE_HEALTHY` (project creation typically takes 1–2 minutes).

- [ ] **Step 5: Apply the `leads` table migration**

Call `mcp__claude_ai_Supabase__apply_migration` with `project_id` set to the new project's id, `name: "create_leads_table"`, and:

```sql
create table leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  email             text not null,
  phone             text not null,
  service_interest  text,
  message           text,
  status            text not null default 'new'
);

alter table leads enable row level security;

create policy "anon can insert leads"
  on leads for insert
  to anon
  with check (true);
```

- [ ] **Step 6: Get the project URL and anon key**

Call `mcp__claude_ai_Supabase__get_project_url` and `mcp__claude_ai_Supabase__get_publishable_keys` with the project id. From the publishable keys result, use the legacy JWT-based anon key (not the newer `sb_publishable_...` key) since `@supabase/supabase-js` 2.116.0's `createClient` expects that format for this simple setup.

- [ ] **Step 7: Create `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 8: Create `.env.local`**

Same two variables as `.env.example`, but with the real values from Step 6:

```
NEXT_PUBLIC_SUPABASE_URL=<real project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<real anon key>
```

Confirm it's git-ignored:

```bash
git check-ignore .env.local
```

Expected: prints `.env.local` (confirming it will not be committed).

- [ ] **Step 9: Install the Supabase client library**

```bash
npm install @supabase/supabase-js@2.116.0
```

- [ ] **Step 10: Create `lib/supabaseClient.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 11: Verify it builds**

```bash
npm run build
```

Expected: succeeds (this file isn't imported anywhere yet, but `.env.local` must be present locally or the build's type-check of this file still passes since the check is a runtime `throw`, not a type error).

- [ ] **Step 12: Commit**

Note: `.env.local` must NOT be committed (it's git-ignored). Only commit the client and example file:

```bash
git add lib/supabaseClient.ts .env.example package.json package-lock.json
git commit -m "Provision Supabase project and add client library"
```

---

### Task 9: Lead validation logic (TDD)

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/validateLead.ts`
- Create: `tests/validateLead.test.ts`
- Modify: `package.json` (add `test` script and `vitest` devDependency)

**Interfaces:**
- Consumes: nothing new
- Produces: `interface LeadFormInput { name: string; email: string; phone: string; serviceInterest: string; message: string }`, `type LeadFormErrors = Partial<Record<"name" | "email" | "phone", string>>`, `function validateLead(input: LeadFormInput): LeadFormErrors` from `lib/validateLead.ts` — consumed by Task 10

- [ ] **Step 1: Install Vitest**

```bash
npm install --save-dev vitest@5.0.0
```

- [ ] **Step 2: Add the `test` script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Write the failing tests — create `tests/validateLead.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { validateLead } from "@/lib/validateLead";

const VALID_INPUT = {
  name: "Jamie Smith",
  email: "jamie@example.com",
  phone: "07123 456789",
  serviceInterest: "Sports Massage",
  message: "Looking to book in for next week.",
};

describe("validateLead", () => {
  it("returns no errors for valid input", () => {
    expect(validateLead(VALID_INPUT)).toEqual({});
  });

  it("requires a name", () => {
    const errors = validateLead({ ...VALID_INPUT, name: "  " });
    expect(errors.name).toBe("Please enter your name.");
  });

  it("requires an email", () => {
    const errors = validateLead({ ...VALID_INPUT, email: "" });
    expect(errors.email).toBe("Please enter your email address.");
  });

  it("rejects a malformed email", () => {
    const errors = validateLead({ ...VALID_INPUT, email: "not-an-email" });
    expect(errors.email).toBe("Please enter a valid email address.");
  });

  it("requires a phone number", () => {
    const errors = validateLead({ ...VALID_INPUT, phone: "" });
    expect(errors.phone).toBe("Please enter your phone number.");
  });

  it("rejects a malformed phone number", () => {
    const errors = validateLead({ ...VALID_INPUT, phone: "abc" });
    expect(errors.phone).toBe("Please enter a valid phone number.");
  });
});
```

- [ ] **Step 5: Run the tests and confirm they fail**

```bash
npm run test
```

Expected: FAIL — `lib/validateLead.ts` does not exist yet (module not found).

- [ ] **Step 6: Create `lib/validateLead.ts`**

```ts
export interface LeadFormInput {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
}

export type LeadFormErrors = Partial<Record<"name" | "email" | "phone", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

export function validateLead(input: LeadFormInput): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!input.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!input.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!input.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}
```

- [ ] **Step 7: Run the tests and confirm they pass**

```bash
npm run test
```

Expected: PASS — all 6 tests green.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts lib/validateLead.ts tests/validateLead.test.ts package.json package-lock.json
git commit -m "Add lead form validation logic with unit tests"
```

---

### Task 10: Contact form and Contact page

**Files:**
- Create: `lib/leads.ts`
- Create: `components/ContactForm.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `supabase` (Task 8), `validateLead`/`LeadFormInput`/`LeadFormErrors` (Task 9), `services` (Task 4), `Section` (Task 3)
- Produces: `submitLead(input: LeadFormInput): Promise<void>` from `lib/leads.ts`; `ContactForm()` from `components/ContactForm.tsx`; `app/contact/page.tsx` default export `ContactPage`, reachable at `/contact/`

- [ ] **Step 1: Create `lib/leads.ts`**

```ts
import { supabase } from "@/lib/supabaseClient";
import type { LeadFormInput } from "@/lib/validateLead";

export async function submitLead(input: LeadFormInput): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    service_interest: input.serviceInterest || null,
    message: input.message.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
```

- [ ] **Step 2: Create `components/ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { submitLead } from "@/lib/leads";
import {
  validateLead,
  type LeadFormErrors,
  type LeadFormInput,
} from "@/lib/validateLead";

const INITIAL_INPUT: LeadFormInput = {
  name: "",
  email: "",
  phone: "",
  serviceInterest: "",
  message: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [input, setInput] = useState<LeadFormInput>(INITIAL_INPUT);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLead(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");

    try {
      await submitLead(input);
      setStatus("success");
      setInput(INITIAL_INPUT);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-body text-ink" role="status">
        Thanks for getting in touch — we&apos;ll reply as soon as we can.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={input.name}
          onChange={(event) =>
            setInput({ ...input, name: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.name ? (
          <p className="text-sm text-red-700">{errors.name}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={input.email}
          onChange={(event) =>
            setInput({ ...input, email: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.email ? (
          <p className="text-sm text-red-700">{errors.email}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="phone"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={input.phone}
          onChange={(event) =>
            setInput({ ...input, phone: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.phone ? (
          <p className="text-sm text-red-700">{errors.phone}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="serviceInterest"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Service you&apos;re interested in
        </label>
        <select
          id="serviceInterest"
          value={input.serviceInterest}
          onChange={(event) =>
            setInput({ ...input, serviceInterest: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        >
          <option value="">Not sure yet</option>
          {services.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="message"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={input.message}
          onChange={(event) =>
            setInput({ ...input, message: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong sending your message. Please try again or
          call us directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-cream hover:bg-ink-muted disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Contact — KG Sports Therapy",
  description:
    "Get in touch with KG Sports Therapy to book an appointment or ask a question.",
};

export default function ContactPage() {
  return (
    <Section className="grid gap-12 sm:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
            Contact
          </h1>
          <p className="mt-4 font-accent text-lg italic text-ink-muted">
            Get in touch to book your appointment.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-body text-sm text-ink-muted">
          <p>[Clinic Address], [Town], [Postcode]</p>
          <p>Phone: [01234 567890]</p>
          <p>Email: [hello@kgsportstherapy.co.uk]</p>
          <p>Mon–Fri: 09:00–18:00 · Sat: 09:00–13:00</p>
        </div>
      </div>
      <ContactForm />
    </Section>
  );
}
```

- [ ] **Step 4: Verify it builds**

```bash
npm run build
```

Expected: succeeds; route list includes `/contact`.

- [ ] **Step 5: Manual end-to-end check against the real Supabase project**

```bash
npm run dev
```

Open `http://localhost:3000/kg-sports-therapy/contact/`, fill in the form with test data, and submit. Expected: the form shows the "Thanks for getting in touch" success message. Then confirm the row landed in Supabase by calling `mcp__claude_ai_Supabase__execute_sql` with `select * from leads order by created_at desc limit 1;` against the project — confirm the test data appears. Delete the test row afterwards with `mcp__claude_ai_Supabase__execute_sql` running `delete from leads where email = '<test email used>';` so it doesn't linger as fake data. Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add lib/leads.ts components/ContactForm.tsx app/contact
git commit -m "Build contact page with lead-capture form"
```

---

### Task 11: GitHub repository and deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: everything from Tasks 1–10 (the full site)
- Produces: a live GitHub Pages deployment at `https://<username>.github.io/kg-sports-therapy/`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
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
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      - run: touch out/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The `touch out/.nojekyll` step is required — without it, GitHub Pages runs the output through Jekyll, which ignores the `_next` folder (anything starting with `_`) and breaks the site.

The Supabase URL and anon key are read from repository **variables**, not secrets — the anon key is meant to be public (it's protected by Row Level Security, not secrecy), so `vars` is the semantically correct GitHub Actions context here.

- [ ] **Step 2: Commit the workflow**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow to deploy to GitHub Pages"
```

- [ ] **Step 3: Create the GitHub repository**

If `gh` is authenticated (`gh auth status` succeeds), create and push in one step:

```bash
gh repo create kg-sports-therapy --public --source=. --remote=origin --push
```

If `gh` is not authenticated, ask the user to either run `gh auth login` first, or manually create an empty repository named `kg-sports-therapy` at github.com, then run:

```bash
git remote add origin https://github.com/<username>/kg-sports-therapy.git
git push -u origin main
```

- [ ] **Step 4: Set the repository variables**

These must be set before the workflow can build successfully (the workflow run from Step 3's push will fail until this is done — that's expected, it'll succeed on the next push or via manual re-run). If `gh` is authenticated:

```bash
gh variable set NEXT_PUBLIC_SUPABASE_URL --body "<value from Task 8 Step 6>"
gh variable set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "<value from Task 8 Step 6>"
```

Otherwise, ask the user to add both as repository variables manually: Settings → Secrets and variables → Actions → Variables tab → New repository variable.

- [ ] **Step 5: Enable GitHub Pages with the Actions source**

If `gh` is authenticated, this can be set via the API:

```bash
gh api -X POST repos/<username>/kg-sports-therapy/pages -f build_type=workflow
```

Otherwise, ask the user to do this manually: Settings → Pages → Build and deployment → Source → "GitHub Actions".

- [ ] **Step 6: Re-run the deployment**

```bash
gh workflow run deploy.yml
```

Or ask the user to push an empty commit / re-run the failed workflow from the Actions tab if `gh` isn't available.

---

### Task 12: End-to-end verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the entire site from Tasks 1–11
- Produces: confirmation the site is live and correct

- [ ] **Step 1: Full local build and static preview**

```bash
npm run build
npx serve@14.2.6 out
```

Open the printed local URL and navigate to `/kg-sports-therapy/`, `/kg-sports-therapy/services/`, `/kg-sports-therapy/about/`, `/kg-sports-therapy/contact/`. Confirm every page loads (no 404s from `basePath` misconfiguration) and styling matches the design tokens (cream background, black logo badge, correct fonts). Stop the server once confirmed.

- [ ] **Step 2: Run the full test suite**

```bash
npm run test
npm run lint
```

Expected: both exit with code 0.

- [ ] **Step 3: Confirm the live GitHub Pages site**

Fetch `https://<username>.github.io/kg-sports-therapy/` and confirm it returns HTTP 200 and renders the same content as the local preview. Click through to each of the four pages on the live site.

- [ ] **Step 4: Confirm the live Contact form**

On the live site's Contact page, submit a real test enquiry, confirm the success message appears, then verify and clean up the row via `mcp__claude_ai_Supabase__execute_sql` exactly as in Task 10 Step 5.

- [ ] **Step 5: Confirm RLS is actually enforced**

Using the anon key, attempt a `select` against `leads` from a scratch script or via `mcp__claude_ai_Supabase__execute_sql` run as the `anon` role (not the service role) — confirm it is rejected or returns zero rows, proving the public cannot read other people's leads.
