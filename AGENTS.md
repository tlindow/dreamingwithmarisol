# AGENTS.md

## Cursor Cloud specific instructions

This is a React + Vite frontend with a Sanity Studio CMS backend, all in one repo (not a monorepo workspace — two separate `npm install` runs are required).

### Services

| Service | Port | Start command | Directory |
|---|---|---|---|
| Vite Frontend | 5173 | `npm run dev` | `/workspace` (root) |
| Sanity Studio | 3333 | `npm run dev` | `/workspace/studio` |

Both services use `npm` (lockfile: `package-lock.json`).

### Lint / Build / Test

- **Lint (frontend):** `npm run lint` — runs ESLint. Note: the codebase has 5 pre-existing lint errors (`@typescript-eslint/no-explicit-any` and `@typescript-eslint/ban-ts-comment`).
- **Build (frontend):** `npm run build` — runs `tsc -b && vite build`.
- **No automated test suite** is configured in either project.

### Gotchas

- The Sanity project ID (`t8kqnnav`) and dataset (`production`) are hardcoded in both `src/sanityClient.ts` and `studio/sanity.config.ts`. No `.env` files are needed for basic dev.
- The Sanity Studio requires authentication (Google, GitHub, or email/password) to access the CMS admin panel. The frontend renders without Sanity auth but dynamic content depends on the Sanity Cloud API being accessible.
- The frontend references the Sanity Studio at `http://localhost:3333` for visual editing (`stega` config in `src/sanityClient.ts`), so both services should run simultaneously during development.
