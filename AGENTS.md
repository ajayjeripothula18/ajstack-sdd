# Agent workflow (Linear-Backed SDD + rstack)

Choose the applicable parts of this workflow for the requested task. It governs
this repo and establishes a disciplined bridge from discovery to verified shipping.

- Read-only reviews, explanations, and investigations need no worktree, commit,
  PR, or Greptile run. If an investigation leads to edits, isolate those edits.
- Greenfield setups and major architectural resets begin in Phase 0.
- All code changes originate from a sliced issue with the `spec:ready` label.
- Small documentation edits use an isolated branch and relevant content or link
  checks. Do not manufacture runtime evidence or require a bot review for them.
- Ship when the task calls for a PR or a completed repository change. A request
  for a plan, review, or local experiment does not imply publishing it.

---

## The 3-Phase Lifecycle

### Phase 0: INITIATE (Greenfield / Major Pivot)
Run `/project-init` to establish or reverse-engineer foundational specs in `docs/`:
- **Greenfield**: Complete the conversational, delta-based interview (max 2–3 turns) until the agent signals readiness.
- **Brownfield**: Deterministic scan of dependencies, configs, routes, and schemas with `[CONFIRMED]`, `[INFERRED]`, and `[MISSING]` tags.
- **Outputs (5 canonical docs + `adr/`)**:
  - `docs/PRD.md` — Vision, personas, user stories, out-of-scope boundaries.
  - `docs/ARCHITECTURE.md` — Stack, component boundaries, state mgmt, a11y & responsive rules.
  - `docs/DATA_MODEL.md` — Domain entities, schemas, relationships, storage contracts.
  - `docs/API.md` — Route definitions, request/response contracts, external services.
  - `docs/USER_FLOWS.md` — Mermaid flowcharts, screen states, navigation transitions.
  - `docs/adr/` — `0001-record-architecture-decisions.md` (meta-ADR), `0002-tech-stack.md`, `template.md`.

**Gate**: Human reviews and approves generated `docs/` before development begins.

---

### Phase 1: SLICE (Initial Backlog or Mid-Development)
Run `/linear-slice` before picking up or starting any feature, refactor, bug, or technical debt:
1. **Drift Check**: Runs deterministic package/grep checks between `docs/` and active code. If drift is found, prompts to sync docs first.
2. **Select Issue Type**: Feature, Refactor, Bug, or Debt.
3. **Sizing Rule**: Every issue must represent **one shippable PR (< 400 lines of diff, 1–2 days)**. Split larger tasks into sequential sub-issues.
4. **Target Issue Creation**: Creates issue in Linear (default) or GitHub Issues (fallback) applying:
   - Label: `spec:ready`
   - Label: `type:feature` | `type:refactor` | `type:bug` | `type:debt`
   - State: `Todo` (Linear native) / `open` (GitHub)

**Gate**: Coding agents must **never** begin code implementation on an issue lacking the **`spec:ready`** label. If an unsliced issue is assigned, stop and run `/linear-slice` first.

---

### Phase 2: EXECUTION (Per Linear/GitHub Issue)
Run `/sdd-flow` to orchestrate this phase end-to-end, or execute the steps individually:

1. **Investigate**: For bugs, regressions, or performance bottlenecks, run `/forensics` before modifying code. Attack the premise, inspect traces/logs, and write an isolated failing reproduction script or test.
2. **Isolate**: Run `/new-feature` to create a dedicated Git worktree and branch from `origin/main` (e.g. `feat/ADS-24-slug`).
   - **Shared-Host Environments**: When agents run on the developer's local machine (Claude Code, Antigravity, Cursor, Codex), worktrees must live inside `.worktrees/<feature-name>` (gitignored at project root). Link dependencies (`ln -s ../node_modules .worktrees/<feature-name>/node_modules`) to conserve disk space. Never build directly on `main` or place worktrees loose in the workspace root.
   - **Cloud-Agent Environments**: When running in dedicated cloud VM sandboxes (Cursor Cloud Agents, Orgo, GitHub Codespaces), ephemeral container isolation manages the environment.
3. **Build**: Run `/code-structure` when choosing boundaries. Actions orchestrate domain rules; services implement reusable mechanics. Apply **Subtractive Discipline**: delete before adding, avoid premature wrappers/interfaces, and eliminate explanatory comment slop. Reference patterns in `docs/ARCHITECTURE.md`.
4. **Prove**: Run relevant checks and prove the issue's Acceptance Criteria.
   - Use `/evidence-driven-testing` for changed runtime behavior: record the failure before fixing it and the success afterward.
   - For UI/frontend changes, use `/before-and-after` to capture visual comparison screenshots.
5. **Interrogate**: Run `/interrogate` locally in the worktree against `git diff origin/main` prior to pushing. Discard subjective opinions: any valid critique must be backed by an executable failing test or repro. Fix all confirmed issues locally.
6. **Ship**:
   - Run `/unslop` over anything a person will read (commit messages, PR title, PR body) and across modified source code comments.
   - Open PR linking the issue (`Closes ADS-XX`).
   - Run `/greploop` (or `/greploop-apps` for large PRs). Aim for **5/5 with zero unresolved actionable Greptile findings** on the current commit.
   - Present the PR URL upon completion. Do not merge unless explicitly instructed.

---

## Senior Subtractive Engineering Principles

When executing Phase 2 changes, apply these 5 principles:
1. **Subtract Before You Add**: Solve problems by deleting or simplifying existing code before creating new functions, layers, or configuration.
2. **Attack the Premise**: Do not blindly accept bug reports or feature requests without verifying causality against the actual codebase.
3. **Laziness Protocol**: If an invariant is enforced by types or upstream guards, do not write defensive redundant wrappers downstream.
4. **Zero Explanatory Comment Slop**: Never write comments explaining what readable code does. Reserve comments strictly for non-obvious *why* (hardware quirks, external bug workarounds, mathematical formulas).
5. **Prove It Works**: No assertion is accepted without empirical execution evidence (passing tests, screen recordings, or visual diffs).

---

## In-Session Task Tracking & Context Guarding

### Active Task Tracker Template
During Phase 2 execution, print and update this compact progress block in chat across milestones:
```markdown
### SDD Flow Status: [ISSUE-KEY] <slug>
- [ ] 1. Forensics & Investigation (root cause & premise validated)
- [ ] 2. Worktree Isolation (`.worktrees/<feature-name>`)
- [ ] 3. Subtractive Implementation & Unit Tests
- [ ] 4. Empirical Evidence Recording (`evidence.py` / Playwright)
- [ ] 5. In-Session Interrogation (adversarial diff audit)
- [ ] 6. Ship (Unslop PR & Greploop 5/5)
```

### Context Window Protection
- **Redirect Heavy Output**: Send verbose test suites, build outputs, and server logs to `.artifacts/scratch/<task>-output.log`.
- **Structured Chat Summaries**: In chat, report only the exact command executed, exit code, and a concise 3-line diagnostic summary.
- **Multi-Model Tiering**: Review `docs/MODELS.md` for recommended model roles (Orchestrator, Builder, Interrogator, Hygiene).

---

## Ship-beat notes

- `/before-and-after` drives the `@vercel/before-and-after` CLI. `--markdown`
  uploads the pair and prints a PR-ready table; it also accepts existing
  PNGs, so evidence gathered while developing can be reused as-is.
- In containers/VMs where Chrome fails with "No usable sandbox", set
  `AGENT_BROWSER_ARGS="--no-sandbox"` for the capture command.
- The default upload host (0x0.st) is public — fine for ordinary UI shots;
  pass `--upload-url` for anything sensitive.

---

## Writing for humans

Run `/unslop` over anything a person will read, before you commit, post, or
send it: commit messages, the PR title and body, README and doc edits, code
comments, and the closing reply. It strips AI tells (em dashes, filler,
hedging, chatbot phrases, puffery, bold-label lists) and replaces fancy
words with plain ones and passive voice with active. Apply it to text you
wrote or changed, not to prose you didn't touch.

---

## Multi-agent rules

- Never commit directly to `main`.
- One worktree and one branch per task and per agent — never reuse or modify
  another agent's worktree, branch, or uncommitted work.
- **Scope check** before starting: skim open PRs' changed files
  (`gh pr list`, `gh pr diff <n> --name-only`) and look for uncommitted work
  in shared checkouts. Inspect overlapping diffs: independent edits to the same
  file may proceed in your own worktree. Ask only when changes conflict in
  behavior, depend on unfinished work, or ownership is unclear. Do not modify
  another task's checkout.
- Never force-push to `main` — and never plain `--force` anywhere; only
  `--force-with-lease`, only on your own task branch.
- Resolve lockfile conflicts by regenerating, never by hand-merging.
- Worktrees don't isolate shared resources: confirm a dev-server port
  answers *your* process before trusting it, and don't run schema
  experiments against a shared database.
- If a conflict can't be resolved confidently, stop and report instead of
  guessing.

---

## Checks in this repo

- `git diff --check` checks whitespace in the change.
- `npm run build` / `npm run lint` / `npm test` when the web application is scaffolded.
- For headless runtime verification, run the documented Playwright capture example and verify output (Node 20+, npm, Chromium required).
- Check compliance against specifications in `docs/` (`PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`).
- Validate edited skill frontmatter and local references.
- Keep generated evidence under the ignored `.artifacts/` directory.

---

## Skill sources

| Skill | Role | Source |
|---|---|---|
| `project-init` | Phase 0: Greenfield / Brownfield system discovery & docs generation | this repo |
| `linear-slice` | Phase 1: Drift detection, issue slicing (4 types), Linear/GitHub gates | this repo |
| `sdd-flow` | Phase 2: Hybrid execution orchestrator (Investigate -> Build -> Interrogate -> Ship) | this repo |
| `forensics` | Phase 2: Read-only root cause investigation and premise validation | this repo |
| `new-feature` | Phase 2: Worktree isolation per issue branch | rstack |
| `code-structure` | Phase 2: Service Layer architecture & Subtractive Principles | rstack |
| `evidence-driven-testing` | Phase 2: Runtime/visual evidence recording & Playwright probes | rstack |
| `before-and-after` | Phase 2: Before/after visual diff screenshot tables | rstack (vercel-labs) |
| `interrogate` | Phase 2: In-session adversarial pre-flight review & repro tests | this repo |
| `greploop` | Phase 2: Bounded Greptile automated review cycles | rstack (greptileai) |
| `greploop-apps` | Phase 2: Compatibility entrypoint for large PRs | rstack (greptileai) |
| `unslop` | Cross-cutting: Strips AI tone from PRs, commits, and source code comments | rstack (pstack) |
