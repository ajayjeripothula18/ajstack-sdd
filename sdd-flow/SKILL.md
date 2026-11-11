---
name: sdd-flow
description: Phase 2 Hybrid Orchestrator for ajstack-sdd. Chrains investigation, worktree isolation, subtractive execution, empirical evidence, in-session adversarial interrogation, and shipping. Use when executing any sliced issue marked spec:ready.
---

# SDD Flow (Phase 2 Hybrid Orchestrator)

## Overview

`/sdd-flow` orchestrates Phase 2 Execution for issues sliced in Phase 1 (`spec:ready`). It unifies `ajstack-sdd`'s worktree isolation and empirical evidence with `pstack`'s cognitive discipline, subtractive engineering, and in-session adversarial review.

It is **opt-in** and modular: developers and agents can execute the full flow end-to-end or jump into individual skills directly.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 2 SDD EXECUTION FLOW                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. INVESTIGATE     /forensics       Root cause analysis & attack the premise│
│ 2. ISOLATE         /new-feature     Dedicated worktree (.worktrees/<name>)  │
│ 3. CONSTRUCT       /code-structure  Actions vs Services + Subtractive Code  │
│ 4. PROVE           /evidence-driven Record failure before & success after   │
│ 5. INTERROGATE     /interrogate     Pre-flight adversarial review & repros  │
│ 6. SHIP            /unslop + loop   Clean AI tells & verify Greptile 5/5    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The In-Session Task Tracker

To guard context and maintain velocity, print and update this compact task tracker in chat at each milestone transition:

```markdown
### SDD Flow Status: [ISSUE-KEY] <slug>
- [ ] 1. Forensics & Investigation (root cause & premise validated)
- [ ] 2. Worktree Isolation (`.worktrees/<feature-name>`)
- [ ] 3. Subtractive Implementation & Unit Tests
- [ ] 4. Empirical Evidence Recording (`evidence.py` / Playwright)
- [ ] 5. In-Session Interrogation (adversarial diff audit)
- [ ] 6. Ship (Unslop PR & Greploop 5/5)
```

---

## Execution Steps

### Step 1: Investigate (`/forensics`)
- Read-only analysis. **Do not modify code in this step.**
- Validate the issue premise & audit remediation plans:
  - Is the reported behavior actually a bug, or are caller expectations misaligned?
  - For PR reviews or proposed plans: run commit archaeology (`git log -n 5`) to detect stale assumptions already resolved in subsequent commits.
  - Enforce canonical schema invariants (enum unions, transactional atomicity, API contracts) to prevent runtime validator crashes.
- For bugs: produce an isolated reproduction script or minimal failing unit test.
- For complex investigations or PR bot review audits, delegate to `DeepInvestigator` via the `/forensics` Delegation Engine.
- For features: identify affected interfaces and data models in `docs/ARCHITECTURE.md`.

### Step 2: Isolate (`/new-feature`)
- Run scope check on open PRs (`gh pr list`, `gh pr diff <n> --name-only`).
- Create a dedicated Git worktree branched from `origin/main`:
  ```bash
  git worktree add .worktrees/<feature-name> -b feat/<ISSUE-KEY>-<slug>
  ln -s ../../node_modules .worktrees/<feature-name>/node_modules
  cd .worktrees/<feature-name>
  ```
- Verify the dev server port answers *your* process before testing.

### Step 3: Construct (`/code-structure`)
- Enforce Actions vs. Services boundary:
  - **Actions**: Orchestrate business rules, user auth, state changes, user-facing errors.
  - **Services**: Reusable mechanics, provider SDK calls, shell execution.
- Apply **Subtractive Discipline**:
  - Delete or collapse existing code before adding new layers.
  - No speculative wrappers, premature abstractions, or defensive null chains.
  - Zero explanatory comments for obvious logic.

### Step 4: Prove (`/evidence-driven-testing` & `/before-and-after`)
- For behavioral changes: record the failing test before the fix, and the passing test after.
- For UI changes: capture screenshot diffs using `/before-and-after` and generate the markdown table.
- Use `scripts/evidence.py` for headless or desktop video recordings.

### Step 5: Interrogate (`/interrogate`)
- Run pre-flight adversarial review **locally inside the worktree before pushing**:
  ```bash
  git diff origin/main
  ```
- The reviewer persona aggressively challenges the diff against the 6 critical audit vectors:
  - Async crash boundaries and orphaned locks or quota allocations.
  - Atomic concurrency & optimistic concurrency control (OCC) races.
  - Secret sanitization (verifying all credentials/tokens are stripped, not just primary passwords).
  - Schema validator conformance (verifying enum union literals).
  - API contract stability and subtractive code integrity.
- For large diffs (> 200 LOC), delegate to `DeepInvestigator` subagent.
- **Hard Rule**: Any valid critique must include an executable failing test or repro script.
- Fix all confirmed issues locally.

### Step 6: Ship (`/unslop` & `/greploop`)
- Run `/unslop` across commit messages, PR title, and PR body.
- Open PR linking the Linear/GitHub issue (`Closes ADS-XX`).
- Run `/greploop` to poll Greptile until a **5/5 clean score with 0 actionable findings** is achieved.

---

## Context Window Guarding Rules

1. **Never dump raw output into chat**: Redirect long test runs, build logs, and stack traces to `.artifacts/scratch/<task>-log.txt`.
2. **Report structured summaries**: In chat, report only the command executed, the exit code, and a 3-line diagnostic summary.
3. **Keep conversation turns compact**: Clear, purposeful turns maintain high model prompt velocity and prevent amnesia.

