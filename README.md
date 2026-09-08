# KG Sports Therapy — Public Website

The public marketing website for KG Sports Therapy: home, about, services, and
a contact page with a Supabase-backed lead-capture form. Deployed statically
to GitHub Pages at https://tomlawson9444.github.io/kg-sports-therapy/.

This is **sub-project 1 of 3** — the foundation and public website. The admin
console (managing leads/bookings) and the public booking flow are separate,
later sub-projects. Full design and planning docs live in
[`docs/superpowers/specs/`](docs/superpowers/specs/) and
[`docs/superpowers/plans/`](docs/superpowers/plans/).

## Tech stack

- [Next.js 16](https://nextjs.org) with static export (`output: "export"`)
- Tailwind CSS v4
- [Supabase](https://supabase.com) for lead capture (public `anon` key,
  protected by Row Level Security and column-level grants)
- Deployed to GitHub Pages via GitHub Actions

## Setup

```bash
npm install
cp .env.example .env.local
```

Then fill in `.env.local` with your Supabase project's URL and anon key.

## Commands

```bash
npm run dev     # start the dev server
npm run build   # static export to out/
npm run test    # run the unit tests (vitest)
npm run lint    # run eslint
```

**Note:** because of the `basePath` configured in `next.config.ts` (required
so the site works under GitHub Pages' `/kg-sports-therapy/` sub-path), the dev
server is served at `http://localhost:3000/kg-sports-therapy/`, **not** the
bare `http://localhost:3000`.

## Deployment

Pushes to `main` automatically build and deploy via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow
runs lint, tests, and the build before deploying, so a failure in any of
those blocks the deploy.

The two `NEXT_PUBLIC_SUPABASE_*` values must be set as GitHub repository
**variables** (Settings → Secrets and variables → Actions → Variables), not
secrets — they're the public anon key, which is safe to expose client-side
and is protected by Supabase Row Level Security, not by secrecy.
