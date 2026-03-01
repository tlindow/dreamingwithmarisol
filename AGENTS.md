# AGENTS.md

## Cursor Cloud specific instructions

This is a React + Vite frontend with a Sanity Studio CMS backend, all in one repo (not a monorepo workspace — two separate `npm install` runs are required).

### Local agent git workflow

For any new implementation task, local agents should follow this exact flow (deterministic):

1. Ensure working tree is clean before switching branches:
   - `git status --short`
2. Fetch latest remote refs:
   - `git fetch origin`
3. Switch to `main`:
   - `git checkout main`
4. Fast-forward local `main` only (no merge commits):
   - `git pull --ff-only origin main`
5. Create and switch to a new branch from updated `main`:
   - `git checkout -b <type>/<short-description>`
6. Do implementation and validation (logic + visual checks).
7. Before opening PR, re-sync with updated `main`:
   - `git fetch origin`
   - `git rebase origin/main`
8. Push branch to remote:
   - `git push -u origin <branch-name>`
9. Open PR in **Ready for review** state (not draft) only after both checks are approved.

Rules:
- Never branch from an existing feature branch.
- Never use `git push --force` on shared branches unless explicitly requested.
- Prefer `--ff-only` pulls to avoid accidental merge commits on `main`.

### Local agent visual validation (match Cursor Cloud flow)

Local agents must run UI validation and attach visual proof before PR creation.

Required flow:
1. Install dependencies if needed:
   - Root: `npm install`
   - Studio: `cd studio && npm install`
2. Start the frontend dev server from repo root:
   - `npm run dev` (expect `http://localhost:5173`)
3. If task touches Studio/content editing, also start Studio:
   - `cd studio && npm run dev` (expect `http://localhost:3333`)
4. Open the target user flows in a browser automation session.
5. Capture evidence for each changed flow:
   - At least one screenshot per changed page/state.
   - A short video capture (or step-by-step screenshot sequence) of the end-to-end happy path.
6. If visuals do not match expected behavior, continue iterating until they do.
7. Only then proceed to push branch and open PR in **Ready for review**.

PR evidence requirements:
- Include links or attached artifacts for screenshots/video in the PR description.
- Include a short checklist of validated flows (logic + visual).
- Do not mark PR ready until evidence is present.

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

### Sanity API Tokens

Two tokens are available as environment variables:

| Variable | Purpose | Permissions |
|---|---|---|
| `SANITY_API_TOKEN` | Content read/write | Read + write mutations against the dataset |
| `SANITY_DEPLOY_TOKEN` | Studio deployment | Deploy the hosted Studio (`sanity deploy`). No content write access. |

- **To sync/seed content:** Use `SANITY_API_TOKEN` with `@sanity/client` (e.g. `studio/sync-content.ts`).
- **To deploy the Studio:** Use `SANITY_DEPLOY_TOKEN` via `SANITY_AUTH_TOKEN=$SANITY_DEPLOY_TOKEN npx sanity deploy` (run from `/workspace/studio`).
- After schema changes, **always redeploy the Studio** so the hosted version at `https://dreaming-with-marisol.sanity.studio/` reflects the new schemas.

### Gotchas

- The Sanity project ID (`t8kqnnav`) and dataset (`production`) are hardcoded in both `src/sanityClient.ts` and `studio/sanity.config.ts`. No `.env` files are needed for basic dev.
- The Sanity Studio requires authentication (Google, GitHub, or email/password) to access the CMS admin panel. The frontend renders without Sanity auth but dynamic content depends on the Sanity Cloud API being accessible.
- The frontend references the Sanity Studio at `http://localhost:3333` for visual editing (`stega` config in `src/sanityClient.ts`), so both services should run simultaneously during development.
- Singleton documents (`siteSettings`, `homePage`, `aboutPage`, `valuesPage`, `pricingPage`) use their type name as the `_id`. The sync script (`studio/sync-content.ts`) uses `createOrReplace` for these.
