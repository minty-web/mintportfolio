# Portfolio

A personal portfolio website that showcases web projects as clickable cards.
Visitors see a responsive grid of project cards and are taken straight to the
live site for a project when they click a card (new tab). A single admin
account can add, edit, delete, and reorder cards from a protected dashboard.
There is no public sign-up — one admin, that's it.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Turbopack
- **Styling:** Tailwind CSS v4
- **Motion:** Framer Motion + Lenis (inertia scroll), custom cursor
- **Storage:** [Netlify Blobs](https://docs.netlify.com/blobs/) — a built-in
  key-value store, no database or migrations. In local dev it falls back to a
  plain JSON file (`.data/projects.json`) so `next dev` needs no extra tooling.
- **Auth:** hand-rolled session auth — scrypt password hashing (Node `crypto`)
  + an HMAC-signed, httpOnly session cookie. No OAuth, no user system.

## Quick start

Requires Node.js 20.9+.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env    # Windows
#   - set ADMIN_USERNAME and a password hash (see below)
#   - set SESSION_SECRET to a random string of >= 32 characters
#   - set NEXT_PUBLIC_SITE_URL to your public URL when deploying

# 3. Seed some sample projects (local dev store only)
npm run db:seed           # inserts 6 sample projects (skips if data exists)

# 4. Run it
npm run dev               # http://localhost:3000
```

Sign in at `http://localhost:3000/admin` with the admin credentials from `.env`.

## Admin credentials

Credentials live in environment variables — never in source code.

1. Generate a password hash:

   ```bash
   npm run hash-password "your-strong-password"
   # prints: scrypt:16384:8:1:<salt>:<key>
   ```

2. Put it in `.env`:

   ```dotenv
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD_HASH="scrypt:16384:8:1:..."
   ```

   For convenience, a plain-text `ADMIN_PASSWORD` is also accepted as a
   fallback, but the hash form is preferred.

The default `.env` included in this repo hashes the password `admin1234` so the
app runs out of the box — **change it before deploying**.

## Environment variables

| Variable                 | Required | Description                                                      |
| ------------------------ | -------- | ---------------------------------------------------------------- |
| `ADMIN_USERNAME`         | yes      | The single admin username                                        |
| `ADMIN_PASSWORD_HASH`    | yes*     | scrypt hash from `npm run hash-password` (`ADMIN_PASSWORD` works too) |
| `SESSION_SECRET`         | yes      | >= 32 chars, signs the session cookie                            |
| `ADMIN_SESSION_TTL`      | no       | Session lifetime in seconds (default 7 days)                     |
| `NEXT_PUBLIC_SITE_NAME`  | no       | Site name used in the header and meta tags                       |
| `NEXT_PUBLIC_SITE_URL`   | no       | Public URL; used for canonical/OG meta and the Secure cookie flag |
| `NEXT_PUBLIC_SITE_EMAIL` | no       | Contact email shown in the footer                                |
| `STORAGE`                | no       | `netlify` or `local` — overrides the automatic backend selection |

## Using the admin

- **Add** — `Admin → Add project` (or `/admin/new`). Title and live URL are
  required; thumbnail is optional (paste an image URL — a placeholder block is
  shown when it's empty or broken).
- **Edit** — `Admin → Edit` on any row (or `/admin/edit/<id>`).
- **Delete** — `Admin → Delete` on any row (asks for confirmation).
- **Reorder** — the ↑/↓ arrows on each row. New projects are appended to the
  end of the grid; public order always follows the admin order.

## Project structure

```
scripts/
  hash-password.mjs    # scrypt hash generator
  seed.mjs             # sample projects -> local dev store
src/
  app/
    page.tsx           # public landing page (rendered on demand)
    layout.tsx         # root layout + SEO metadata
    opengraph-image.tsx# generated OG image
    admin/
      login/page.tsx   # admin sign-in
      (protected)/     # everything below requires a valid session
        layout.tsx     # auth guard + admin nav
        page.tsx       # dashboard (list, reorder, delete)
        new/page.tsx   # add project
        edit/[id]/page.tsx
  components/
    public/            # intro, cursor, nav, hero, work list, process, footer
    admin/…            # admin form + delete button
  lib/
    store.ts           # storage backend (Netlify Blobs or local JSON)
    projects.ts        # data access layer (read/modify/write the store)
    auth.ts            # credentials + session cookie helpers
    actions.ts         # server actions (login, logout, CRUD, reorder)
    site.ts            # site-wide config
    types.ts           # shared serializable types
```

## Deployment (Netlify)

Netlify detects Next.js automatically (official Next.js runtime) and Netlify
Blobs are enabled by default — no configuration needed.

1. Push this repo to GitHub/GitLab and **Import** it in the Netlify dashboard
   (New site → Import an existing project). Build command `npm run build` is
   already set in `netlify.toml`.
2. Set the environment variables in the dashboard
   (Site configuration → Environment variables): `ADMIN_USERNAME`,
   `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`
   (e.g. `https://your-site.netlify.app`), plus `NEXT_PUBLIC_SITE_NAME` and
   `NEXT_PUBLIC_SITE_EMAIL` if you want custom values.
3. Deploy. After the first deploy, sign in at `/admin` and add your projects —
   they are stored in Netlify Blobs and persist across deploys.

> The landing page is rendered on demand (it reads the blob store at request
> time), so content stays fresh immediately after an admin edit — no rebuild
> needed.

**Local dev** uses a JSON file (`.data/projects.json`). To point local dev at
the production blob store instead, set `STORAGE=netlify` and run via
`netlify dev` (or set `NETLIFY_API_TOKEN`/site context).

## Acceptance criteria

- [x] `/` shows all projects as cards in admin-set order
- [x] Clicking a card opens the external URL in a new tab
- [x] `/admin/login` validates credentials; wrong ones are rejected
- [x] `/admin` is protected and supports add / edit / delete / reorder
- [x] Admin session persists across refresh, expires on logout
- [x] Responsive on mobile
- [x] No public sign-up flow anywhere
