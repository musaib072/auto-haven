# AUTOFLEXII — Buy. Sell. Inspect. Care.

Marketing site and lead-capture forms for AUTOFLEXII (Amravati, Maharashtra): pre-owned car buying & selling, Inspectify 299+ point inspections, door-to-door car spa, insurance assistance and PDI.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · React Hook Form + Zod · TanStack Query · Supabase (listings, enquiries, storage) · EmailJS (form → email)

## Quick start

```sh
npm ci
cp .env.example .env      # fill in Supabase + EmailJS keys
npm run dev               # http://localhost:8080
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | typecheck + lint + test + build (run before deploying) |

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero, services, Buy / Sell / Car Spa forms, Inspectify, Why AUTOFLEXII |
| `/buy` | Car listings (from Supabase) + "find my car" request |
| `/car/:id` | Car details |
| `/sell` | Sell your car (with photo upload) |
| `/car-spa` | Packages + slot booking |
| `/inspectify` | Inspection details + booking |
| `/about`, `/contact`, `/privacy`, `/terms` | Info pages |
| `/admin` | Manage listings + view enquiries (admins only) |

Old URLs `/browse`, `/service` and `/how-it-works` redirect to the new pages.

## Where things live

```
src/
  config/site.ts          ← business name, phones, email, Instagram, address (edit here)
  data/options.ts         ← dropdown options, spa packages, time slots
  lib/emailService.ts     ← EmailJS delivery + Supabase enquiry backup
  lib/validation.ts       ← Indian mobile / registration validation
  hooks/useEnquirySubmit  ← spam protection, toasts
  components/forms/       ← Buy, Sell, Car Spa, Inspection forms
  components/home/        ← homepage sections
public/images/            ← hero & section photos (swap for higher-resolution shots anytime, same filenames)
supabase/migrations/      ← database schema + security policies
```

## Email delivery

See **[EMAIL_SETUP.md](./EMAIL_SETUP.md)**. Short version: set `VITE_EMAILJS_PUBLIC_KEY`, service ID and the two template IDs in `.env` **and** in Vercel, then redeploy.

## Deploying (Vercel)

1. Add all variables from `.env.example` in Vercel → Settings → Environment Variables.
2. Apply the Supabase migration in `supabase/migrations/` (SQL editor or `supabase db push`).
3. Push to the main branch. `vercel.json` handles SPA routing, security headers (CSP, HSTS…) and asset caching.
4. Set `VITE_SITE_URL` to your real domain so canonical links, the sitemap and social previews point to it.

If you add a new third-party service that the browser calls, add its domain to the `connect-src` part of the CSP in `vercel.json`.
