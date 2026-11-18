# Katiadi Government College — Official Website

**কটিয়াদী সরকারি কলেজ | Katiadi Government College**
Katiadi, Kishoreganj, Bangladesh — **EIIN: 110434**

Next.js 14 + React + TypeScript + Tailwind CSS, Node.js API Routes, PostgreSQL
(Neon SSL via `pg`), Vercel Blob (optional, for uploads). Bengali + English,
light/dark mode, responsive mobile-first.

## ⚠️ Verified facts only

Only these facts are verified: college name, EIIN **110434**, location
(Katiadi, Kishoreganj, Bangladesh), and Bengali + English language.
**Everything else is a clearly labelled PLACEHOLDER / SAMPLE** — principal's
name, teacher names, notices, news, results, routines, phone/email and
history are NOT real and must be confirmed by the college office before
being published as fact. Placeholder rows carry `is_sample: true` and are
badged "SAMPLE / PLACEHOLDER" on the site.

## Pages

Home, About, History, Principal's Message, Governing Body, Teachers & Staff,
Departments, Academic Programs, Admission, Class Routine, Examination Routine,
Results, Notice Board, News & Events (+ detail), Photo Gallery, Contact.

## Student Portal

- `/student/login` — student ID + password
- `/student/dashboard` — profile, notices, class & exam routines, results, documents
- Demo student: **Student ID `DEMO-001` / password `demo123`**
  (created by migration with a bcrypt hash of `demo123`)

## Admin Dashboard

- `/admin/login` → `/admin` — tabs for Notices, News & Events, Teachers,
  Departments, Programs, Students, Admissions, Routines, Results, Gallery,
  Documents, Settings, Users, Messages, plus a Database panel
  (`/api/status` + Migrate button).
- Admin login is env-based, **not** a database user.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes (production) | Neon / Vercel Postgres connection string. Without it the site runs on the JSON seed fallback (local dev only). |
| `ADMIN_EMAIL` | Yes | Admin login email. Demo: `admin@katiadi.edu.bd` |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of the admin password. Demo password is `admin123` — generate a hash with `node -e "console.log(require('bcryptjs').hashSync('admin123',10))"` and set it; never commit a plain password. |
| `SESSION_SECRET` | Yes (production) | HMAC secret for session cookies. |
| `BLOB_READ_WRITE_TOKEN` | Optional | Vercel Blob token for image storage. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Public site URL (sitemap/metadata). |

## Setup

```bash
npm install
cp .env.example .env.local   # if present; otherwise create it with the vars above
npm run dev                  # http://localhost:3000
```

## Database

```bash
# Local / one-off seed (needs DATABASE_URL):
npm run seed
# Or, after deploying, log in as admin and POST /api/admin/migrate
# (Admin → Database tab → "Run Migration / Seed").
# It creates all tables and seeds placeholder data ONLY when tables are empty.
```

Check status: `GET /api/status` → `{ database: { mode }, storage, adminConfigured, counts }`.

## Data model (PostgreSQL)

`notices, news_events, teachers, departments, programs, students, admissions, routines, results, gallery, documents, settings, users, contacts` — each with `id TEXT PRIMARY KEY` and `created_at`; `is_sample BOOLEAN` where relevant. Reads are DB-first (an existing empty table returns `[]`, never silently falls back to seed); writes throw on DB failure instead of returning a fake `ok:true`.

## Key APIs

- `GET /api/status` — database/storage/admin/counts
- `GET /api/public/[resource]` — public read (`notices, news_events, teachers, departments, programs, routines, results?student_id=, gallery, documents`)
- `POST /api/admissions`, `POST /api/contact` — public forms (rate-limited)
- `POST /api/auth/login` / `logout` — admin; `POST /api/auth/student-login` / `student-logout` — student
- `GET /api/student/me` — student cookie only
- `GET|POST|DELETE /api/admin/[resource]` — admin only, whitelisted resources
- `GET|POST /api/admin/settings`, `POST /api/admin/migrate` — admin only

## Deployment (Vercel)

1. Push this repo to GitHub (`katiadi-college`).
2. Import it in Vercel, set the env vars above (including `DATABASE_URL` from a managed Postgres/Neon database).
3. Deploy, log in as admin, run the migration from the Database tab, verify `GET /api/status` shows `database.mode: "PostgreSQL"`.
4. Automatic deployments: every push to the connected branch redeploys.
