# KG Sports Therapy — Sub-project 1: Foundation + Public Website

**Date:** 2026-09-08
**Status:** Approved

## Context

KG Sports Therapy is a new sports therapy business run by the user's sister. The
business currently only has a "coming soon" placeholder graphic (see
`Coming soon image.jpg`). This is the first of three planned sub-projects for
the full site:

1. **Foundation + public website** (this document) — design system, core
   marketing pages, and a lead-capture enquiry form.
2. **Admin console** — secure login, dashboard, lead management, and schedule
   / availability management (blocking out unavailable time).
3. **Public booking flow** — customers pick a service and an available slot
   and book themselves in, respecting whatever is blocked out in the admin
   console.

This document covers sub-project 1 only.

## Goals

- Replace the "coming soon" placeholder with a real marketing site: Home,
  Services, About, Contact.
- Capture enquiries from the Contact page as leads, stored durably so
  sub-project 2's admin console can list and manage them.
- Establish the visual design system (derived from the existing logo) and
  the technical foundation (framework, hosting, deployment pipeline) that
  sub-projects 2 and 3 will build on.
- All copy in UK English (spelling, £ pricing, DD/MM/YYYY dates).

## Non-goals (deferred to later sub-projects)

- Admin login, dashboard, or any lead-management UI.
- Booking / appointments of any kind.
- Managing services, prices, or schedule from an admin UI — services are a
  static content file for now.
- Email notifications on new leads.
- Custom domain (site ships to the default `github.io` URL for now).

## Architecture

- **Framework:** Next.js (App Router), configured with `output: 'export'` to
  produce a fully static build — required for GitHub Pages, which cannot run
  server-side Next.js features (API routes, middleware, SSR).
- **Backend:** Supabase (Postgres). The browser talks to Supabase directly
  via the public anon key using the Supabase JS client — there is no custom
  server backend in this sub-project.
- **Security model:** Row Level Security (RLS) on all tables. The public
  (anon) role can only `INSERT` into `leads` — it cannot `SELECT`, `UPDATE`,
  or `DELETE`. Read/update access for the admin console is added in
  sub-project 2 once authenticated roles exist. Because the site is a static
  export, there is no server-side route protection anywhere in this
  architecture — RLS is the actual security boundary, not hidden routes.
- **Services content:** a local data file (`content/services.ts`) holding
  name, description, price, and duration for each service. Not
  database-backed in this sub-project — it's placeholder copy edited via the
  codebase, and doesn't yet need a management UI.
- **Deployment:** a GitHub Actions workflow builds the static export and
  publishes it to GitHub Pages on push to `main`.
- **Repository:** a new project repo named `kg-sports-therapy`, giving a
  final URL of `https://<username>.github.io/kg-sports-therapy/`.

## Data model

One Supabase table for this sub-project:

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

`status` exists now (default `'new'`) so sub-project 2 can add triage states
(e.g. `contacted`, `booked`, `closed`) without a schema migration.

No `SELECT`/`UPDATE`/`DELETE` policy exists yet for any role — that is
intentionally added alongside authentication in sub-project 2.

## Pages & components

- **Header:** black circular logo badge (mirroring the coming-soon graphic),
  nav links (Home, Services, About, Contact), collapsible mobile menu.
- **Footer:** logo, nav links repeated, placeholder social links, copyright
  line.
- **Home:**
  - Hero: logo badge, bold headline, italic-accent tagline echoing
    "Move · Recover · Repeat", primary CTA ("Get in Touch" → Contact page —
    a "Book Now" CTA is added once sub-project 3 exists).
  - "Why choose us" section (2–4 short value props).
  - Services preview: 3 cards pulled from `content/services.ts`, linking to
    the full Services page.
- **Services:** full list from `content/services.ts` rendered as cards
  (name, description, price in £, duration).
- **About:** bio placeholder for the therapist, a qualifications/credentials
  list, a short philosophy blurb tying back to the "Move · Recover · Repeat"
  tagline.
- **Contact:**
  - Enquiry form: name, email, phone, service dropdown (sourced from
    `content/services.ts`), free-text message. On submit, inserts a row into
    `leads` via the Supabase client; shows a success/error state inline.
  - Business info block: placeholder address, phone, email, opening hours,
    social links.

## Design system

Derived from the existing logo (`Coming soon image.jpg`):

- **Colour:** off-white/cream background, near-black as the primary ink and
  accent colour. Monochrome — no additional accent colour.
- **Motif:** a black circular badge (as in the logo) reused as a recurring
  graphic element (e.g. behind the hero, around icons).
- **Type:**
  - Headings: a heavy, geometric sans-serif (loaded via `next/font`).
  - Labels/eyebrow text: letter-spaced small-caps, matching "SPORTS THERAPY"
    in the logo.
  - Tagline accents: an italic serif, matching "Recover" in the logo.
- **Layout:** mobile-first, responsive across phone/tablet/desktop.

## Copy conventions

- UK English spelling throughout (e.g. "specialise", "personalised").
- Prices in £.
- Dates in DD/MM/YYYY where dates appear.
- Placeholder content is realistic and clearly structured (e.g.
  "Sports Massage — £45 / 60 minutes") so it's a fast find-and-replace once
  real content is available — not lorem ipsum.

## Verification

This sub-project has no complex backend logic beyond a single form insert,
so verification is manual rather than an automated test suite:

1. Run the dev server and check each page against the design system and
   responsive breakpoints (mobile, tablet, desktop).
2. Submit the Contact form and confirm a row lands in the `leads` table in
   Supabase with the correct fields.
3. Confirm the anon key cannot read, update, or delete rows in `leads`
   (RLS is doing its job).
4. Run a production build (`next build` with static export) and confirm it
   completes without errors before wiring up the GitHub Actions deploy.
5. Confirm the GitHub Actions workflow deploys successfully and the site is
   reachable at the GitHub Pages URL.
