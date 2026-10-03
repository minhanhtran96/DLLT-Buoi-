# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

DuHoc24: a study-abroad application intake portal, used as a template repo for a 6-week programming course (README is in Vietnamese). It is currently at **Week 1**: UI only, with all data hardcoded as mock data in `lib/mock-data.ts`. There is no API, database, or auth yet. The README's weekly roadmap lists what gets added later (Gemini chatbot, Supabase, document extraction, Make.com automation, magic-link login). Don't wire in backend pieces unless asked.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
npm run lint    # eslint (flat config, eslint.config.mjs)
```

There is no test runner configured. Env vars are not needed yet; `.env.example` lists the ones planned for later weeks.

## Architecture

- **Next.js 16 App Router + React 19 + Tailwind v4 + TypeScript** (path alias `@/*` → repo root). Per AGENTS.md, this Next.js version has breaking changes, so read `node_modules/next/dist/docs/` before writing Next-specific code. Layouts use the global `LayoutProps<"/">` type rather than hand-written prop types.
- **Routes** (`app/`): `/` (landing), `/portal` (student document portal), and `/admin/{requests,schools,profiles,conversations}`, with `/admin` redirecting to `/admin/requests`. `app/admin/layout.tsx` provides the sidebar shell. `/login` is deliberately not built (a Week 6 exercise).
- **Components** are grouped by area: `components/landing`, `components/portal`, `components/admin`, plus shared `site-header`, `site-footer`, `logo`, `status-badge`.
- **UI primitives** in `components/ui` are shadcn/ui, style `base-nova`, built on **Base UI** (`@base-ui/react`), not Radix. Check Base UI's API, not Radix's, when changing them. `components.json` configures the shadcn CLI, with an extra `@tailark-oss` registry. Icons come from `lucide-react`, and animation from `motion`.
- **Data layer**: `lib/mock-data.ts` is the single source for all pages. It holds the domain types (`DocStatus`, `RequestStatus`, `ServicePackage`, `School`), enum-like string unions in Vietnamese snake_case (e.g. `cho_duyet`, `hop_le`), and the mock arrays. When real data replaces it, these types are the contract to keep.
- Styling tokens live in `app/globals.css`. The font is Be Vietnam Pro, exposed as `--font-sans` (set in `app/layout.tsx`). UI copy is in Vietnamese.

## Quy tắc Git

- Luôn hỏi xác nhận trước khi push lên Github

- Không bao giờ commit file .env hoặc bất kỳ file chứa API key
