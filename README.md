# Invite Rewards Dashboard

A React 18 + Vite + TypeScript + Tailwind CSS v4 dashboard for an invite-based reward system.

## Stack
- Vite 5 + React 18 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Radix UI primitives + shadcn-style components
- TanStack Query, React Hook Form + Zod, Wouter routing

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Path Alias

`@/*` maps to `src/*` (configured in `vite.config.ts` and `tsconfig.json`).

## API Client

The pages `src/pages/admin.tsx`, `src/pages/rewards.tsx`, and `src/pages/claim.tsx`
use `src/lib/mock-api-client.ts`, a local mock implementation that replaced the
previously-missing `@workspace/api-client-react` workspace package. It returns
in-memory mock data so the UI builds and runs standalone.

To connect a real backend (e.g. your Discord bot's REST API), replace the
implementations in `src/lib/mock-api-client.ts` with real `fetch` calls / your
own TanStack Query hooks — the function signatures and return types already
match what the UI expects.

## Deployment

### Vercel
Import the repo into Vercel — it auto-detects Vite. `vercel.json` includes a
catch-all rewrite to `index.html` for SPA routing.

### Netlify
`netlify.toml` is configured with `npm run build` → `dist`, plus a SPA redirect.

No environment variables are required for the mock build.
