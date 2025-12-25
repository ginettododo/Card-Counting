# AGENT INSTRUCTIONS

## Scope
These instructions apply to the entire repository unless a nested `AGENTS.md` overrides them.

## Setup
- Use Node.js 20+ with npm for dependency management.
- Install dependencies with `npm install`.

## Style
- Use TypeScript, Next.js App Router, Tailwind CSS, and shadcn/ui style primitives where possible.
- Keep components accessible (ARIA labels, keyboard focus states) and mobile-first responsive.
- Prefer functional components and hooks.
- Add docstrings/comments to new functions to clarify intent.

## Testing
- Provide and update automated tests with Vitest/Testing Library/Playwright where relevant.
- Run `npm run lint` and `npm run test` before committing.

## Commits
- Commit messages follow the format `[<scope>] <Title>` (e.g., `[UI] Add navbar`).

## Custom Notes
- Do not add binary assets to the repository.
- If UI changes are made, include a short note about visual verification or screenshots when feasible.
