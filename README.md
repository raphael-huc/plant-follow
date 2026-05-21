# plant-follow

React 19 + Vite + TypeScript frontend for the Huc House project. Talks to the Directus 11 backend in the sibling repo `../huc-back` via `@directus/sdk`.

## Stack

- React 19, React Router 7, Vite 7, TypeScript
- TailwindCSS
- `@directus/sdk` for backend data access
- pnpm

## Quick start

```sh
pnpm install
pnpm dev                # http://localhost:5173
pnpm lint && pnpm build # verify (no test framework configured)
```

Required env in `.env` (copy from `.env.example`):

- `VITE_DIRECTUS_URL` — backend URL, typically `http://localhost:8055`
- `VITE_MODE` — set to `dev` to enable the "Login as Admin (dev)" shortcut
- `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD` — pre-fill the dev login form

## Backend

Boot the backend first (see `../huc-back/README.md`):

```sh
cd ../huc-back && docker compose up -d
```

## Calling the Directus API directly (debugging)

For one-off queries against the backend (debugging, exploration, scripts outside the React app), the backend exposes a static admin token in `../huc-back/.env` as `ADMIN_TOKEN`. Use it the same way as documented in `../huc-back/README.md` (`Authorization: Bearer <token>` header). Do **not** use this token in the React app itself — the SDK in `src/api/directus.ts` is configured for cookie-based user sessions, which is the correct path for user-facing flows.
