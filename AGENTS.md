# AGENTS.md

## Session behavior

The first prompt of a session should always enter a **planning mode**, unless otherwise stated. Plan before implementing.

---

## Cursor Cloud specific instructions

This is a Next.js site with a small in-house editor at `/admin`. One `npm install` at the repo root is enough.

### Cursor Cloud agent git workflow (cloud sessions — use this one)

Cursor Cloud pre-creates a `cursor/<task-id>` branch for every session and auto-opens a PR when commits are pushed to it. **Do not switch away from it.**

For any new implementation task, cloud agents must follow this exact flow:

1. Note the current branch name (it will be `cursor/<task-id>`): `git branch --show-current`
2. Ensure working tree is clean: `git status --short`
3. Sync with latest `main` without changing branches: `git fetch origin && git rebase origin/main`
4. Do implementation and validation (logic + visual checks).
5. Commit each logical change: `git add -A && git commit -m "..."`
6. Push to the same `cursor/<task-id>` branch: `git push` (Cursor Cloud auto-creates/updates the PR)
7. End the flow by confirming the branch was pushed — Cursor Cloud will attach the PR to the session automatically.

Rules:
- **Never** run `git checkout main` or `git checkout -b ...` — stay on the `cursor/<task-id>` branch.
- **Never** run `gh pr create` — the integration token doesn't have write access; the auto-PR handles it.
- Use `git fetch origin && git rebase origin/main` (not pull) to stay in sync with `main`.

---

### Local agent git workflow (local dev machine only — not for cloud sessions)

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
10. End the flow by sharing a clickable PR link in Markdown format:
   - `[PR #<number>](https://github.com/<owner>/<repo>/pull/<number>)`

Rules:
- Never branch from an existing feature branch.
- Never use `git push --force` on shared branches unless explicitly requested.
- Prefer `--ff-only` pulls to avoid accidental merge commits on `main`.

### Local agent visual validation (match Cursor Cloud flow)

Local agents must run UI validation and attach visual proof before PR creation.

Required flow:
1. Install dependencies if needed:
   - Root: `npm install`
2. Start the frontend dev server from repo root:
   - `npm run dev` (expect `http://localhost:5173`)
3. Content editing is `/admin` on that same server. Login is a Stytch texted 6-digit code. Set `STYTCH_PROJECT_ID` and `STYTCH_SECRET` in `.env.local`.
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
- In the final handoff message, include a clickable Markdown link to the PR URL.

### Services

| Service | Port | Start command | Directory |
|---|---|---|---|
| Next.js site and `/admin` | 5173 | `npm run dev` | `/workspace` (root) |

The site uses `npm` (lockfile: `package-lock.json`).

### Lint / Build / Test

- **Lint (frontend):** `npm run lint` — runs ESLint.
- **Build (frontend):** `npm run build` — runs `next build`.
- **Tests (frontend):** `npm test` — Node test runner via `tsx` for download tokens and Stripe webhook handling.

### Content editor

`/admin` is the editor. Login is a Stytch texted 6-digit code. Anyone who finishes the code on that Stytch project can edit. Saves go to `data/content.json` locally. On Vercel, set `BLOB_READ_WRITE_TOKEN` so saves persist as a private blob. The public site falls back to `content/site.ts` until a save exists.

### Gotchas

- Do not render the home street address.
- `CALENDLY_API_TOKEN` in this environment can return 403. The booking page still shows the embeds when availability is unknown.
- Product checkout uses a Stripe Price ID. The dollar field in Content is display-only.
