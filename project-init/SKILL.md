---
name: project-init
description: Guides discovery and system design for fresh projects (Greenfield) or existing codebases (Brownfield). Generates industry-standard docs/ (PRD.md, ARCHITECTURE.md, DATA_MODEL.md, API.md, USER_FLOWS.md, and adr/).
---

# Project Init

Establish the canonical, industry-standard architectural foundation in `docs/` before writing implementation code.

## Execution Modes

Detect whether the workspace is **Greenfield** (empty/starter) or **Brownfield** (existing code):
- If `src/`, `app/`, or substantial application logic exists: Run **Mode B (Brownfield)**.
- If the directory is blank, has only a bare scaffold, or the user requested a fresh start: Run **Mode A (Greenfield)**.

---

## Mode A: Greenfield Discovery (Fresh Project)

### 1. Conversational, Delta-Based Interview (Max 2–3 Turns)
Do not ask rigid lists of questions. Acknowledge what the developer has already shared and ask 2–3 high-leverage questions to fill remaining gaps:

- **Turn 1 — Vision & Core Entities**:
  - What is the one-sentence problem this project solves?
  - Who are the primary user personas?
  - What are the 3–5 core domain entities (e.g., Project, User, Enquiry, Asset)?
  - Are there any hard constraints (timeline, existing APIs, design requirements)?
- **Turn 2 — Tech Stack & Architecture**:
  - Preferred framework & language (e.g. Vite + React + TS, Next.js, Remix)?
  - Styling & UI library (Tailwind CSS, Vanilla CSS, Radix, shadcn)?
  - Data storage / Backend (Supabase, PostgreSQL, SQLite, Firebase, local state/JSON)?
  - Auth & Third-party integrations (Clerk, Auth.js, Stripe, Resend)?
- **Turn 3 — Critical Flow & Quality Bar**:
  - What is the primary user flow (the "North Star" interaction)?
  - Any real-time, animation, or performance requirements?

### 2. The Readiness Check
As soon as the core entities, tech stack, and primary user flow are clear, **explicitly signal readiness**:

> **Readiness Check**: I have enough context to generate the foundational system specifications (`PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`, and initial ADRs).
> 
> We can proceed now, or you can add constraints, design preferences, or adjustments.

- If the developer adds more details or changes something, incorporate them and repeat the readiness check.
- If the developer confirms ("proceed"), generate the documents.

---

## Mode B: Brownfield Discovery (Existing Codebase)

When running on an existing repository, **inspect first, ask second**. Reverse-engineer the current architecture through a deterministic scan.

### 1. Deterministic Scan Protocol (In Order)
1. **Monorepo Check**: Check for `pnpm-workspace.yaml`, `turbo.json`, `lerna.json`, or root `package.json` with `workspaces`.
2. **Dependencies & Runtime**: Read `package.json` (dependencies, devDependencies, scripts, Node engine).
3. **TypeScript & Config**: Read `tsconfig.json` (compiler target, path aliases, strictness).
4. **Routing & Directory Layout**: Scan `src/` or `app/` to map page routes, layout wrappers, and API endpoints.
5. **Schema & Models**: Check `prisma/schema.prisma`, `drizzle.config.ts`, `supabase/migrations/`, or TypeScript types in `src/types/` / `src/models/`.
6. **Auth & Middleware**: Check `middleware.ts`, `src/lib/auth.ts`, or session helper files.
7. **Styling & Design System**: Check `tailwind.config.*`, CSS modules, or component directories (`src/components/ui`).
8. **State Management & Services**: Check for Zustand stores, Redux slices, TanStack Query hooks, or service layers.

### 2. Draft Docs with Confidence Tags
Generate draft documentation marking findings with explicit tags:
- `[CONFIRMED]`: Proven directly by code/config (e.g., `@tanstack/react-query` in dependencies).
- `[INFERRED]`: Deducted from patterns (e.g., `src/services/api.ts` suggests a client-side fetch wrapper).
- `[MISSING]`: Gaps requiring developer clarification (e.g., no clear auth pattern detected).

Present the findings and ask targeted questions only for `[INFERRED]` and `[MISSING]` items.

---

## Pre-Output Strategy & Directory Preparation

Before creating or writing docs, execute these safety protocols:

### 1. Prepare `docs/` and Existing Docs Safety (Brownfield)
- If `docs/` does not exist: create it with `mkdir -p docs/adr`.
- If `docs/` already exists with existing documentation:
  - **Create a timestamped backup**: `cp -r docs/ .docs-backup-$(date +%Y%m%d%H%M%S)/`
  - **Non-destructive merge**: Do not overwrite developer-authored research, brief files, or recon notes. Preserve existing custom specs and merge new structural sections into the canonical 5 docs.

### 2. ADR Numbering Continuity
- Check existing files in `docs/adr/`.
- If `docs/adr/` is empty:
  - Write `0001-record-architecture-decisions.md` (meta-ADR defining the ADR standard).
  - Write `0002-tech-stack.md` (first project decision).
  - Write `template.md`.
- If ADRs already exist (e.g. up to `0003-*`):
  - Increment sequence number (e.g. create `0004-*.md`). Never overwrite existing ADRs.

### 3. Monorepo Docs Layout Handling
If workspaces/monorepo were detected in Step 1:
- **Unified root docs (Standard)**: Single `docs/` at repository root with shared `PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, and `adr/`. Place per-app UI/screen journeys in `apps/<name>/docs/USER_FLOWS.md`.
- **Per-package docs (Modular)**: Each app maintains its own `docs/` folder for local architecture; the root contains project-wide vision and global ADRs.

---

## Output: The 5 Canonical Docs + `adr/`

Write dense, structured Markdown files (under 150 lines each) directly into `docs/`:

### 1. `docs/PRD.md`
- Problem statement & core value proposition
- Primary user personas
- Core user stories with acceptance criteria
- Non-functional requirements (performance, accessibility, security)
- Explicit Out of Scope boundary

### 2. `docs/ARCHITECTURE.md`
- High-level system data flow (Mermaid diagram)
- Component boundaries (Routes → Actions → Services → Models)
- State management strategy (server state, client state, form state)
- Directory structure map
- Quality standards (Accessibility WCAG targets, responsive breakpoints)

### 3. `docs/DATA_MODEL.md`
- Entity definitions with field names, types, and constraints
- Entity relationships (1:1, 1:N, N:M)
- Storage contracts (primary database, cache, file storage)

### 4. `docs/API.md`
- Route definitions, HTTP methods, parameters, and payloads
- Success & error response schemas
- External integrations & webhook endpoints

### 5. `docs/USER_FLOWS.md`
- Mermaid flowchart of the North Star user journey
- Screen state inventory (Loading, Empty, Success, Error states)
- Route transitions and modal interactions

### 6. `docs/adr/`
- `docs/adr/0001-record-architecture-decisions.md`: Standard meta-ADR establishing the Michael Nygard ADR format.
- `docs/adr/0002-tech-stack.md`: Why the chosen stack was selected and what alternatives were rejected.
- `docs/adr/template.md`: Template for future architectural decisions.
