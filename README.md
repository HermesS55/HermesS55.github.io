# Fixora MVP

Dark-themed MVP marketplace for connecting car owners and service pros.

## Stack
- React + Vite
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- React Router

## 1) Install
```bash
npm install
```

## 2) Environment variables
Copy `.env.example` to `.env` and set values:
```bash
cp .env.example .env
```

Required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3) Configure Supabase database
1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Paste `supabase.sql` contents.
4. Run it once.

## 4) Run app
```bash
npm run dev
```
Then open the local Vite URL.

## Routes
- `/auth` login/register
- `/` open listings dashboard
- `/create-listing` owner-only
- `/listing/:id` listing details + offer form/list
- `/my-listings` owner-only

## Notes
- Signup requires role selection (`owner` or `pro`).
- Profile is auto-created with DB trigger from auth metadata.
- Duplicate offers are prevented by unique constraint `(listing_id, pro_id)`.
