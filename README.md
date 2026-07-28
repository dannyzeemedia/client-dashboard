# Client Reporting dashboard

Interactive, per-client KPI dashboard with real logins. React (Vite) + Supabase,
deployed to GitHub Pages. Companion to the `client-kpi-reports` pipeline, which
computes each client's numbers and publishes a snapshot to Supabase.

## How it works
- **Auth:** Supabase email/password. A user only sees the client(s) they're granted
  (row-level security on `report_access` → `client_reports`).
- **Data:** the dashboard reads the latest row from `public.client_reports` for the
  signed-in user's client. The whole view renders from that row's `data` JSON
  (KPIs, 12-month share chart, narrative, heartbeat, testing log).
- **Live:** the `client-kpi-reports` pipeline refreshes the Supabase snapshot daily
  + on-demand. No Klaviyo calls happen here — the dashboard only reads Supabase.

## Where things are
- Supabase project: **Client Reporting** (`dxocfmwjwzzseepujfji`).
- Data is written by the pipeline's `supabase_publish.py` with the service_role key.
- The URL + anon key in `src/supa.js` are public by design; data is protected by RLS.

## Editing
- **Look / layout / interactions:** edit this repo (it's the app).
- **What data shows / metrics:** the `client-kpi-reports` pipeline (the snapshot shape).

## Adding a client / user
- Client data: add the slug to the pipeline and it publishes a `client_reports` row.
- A login: create a Supabase Auth user, then insert `(user_id, client_slug)` into
  `report_access`. (Handled by a small admin step in the pipeline repo.)
