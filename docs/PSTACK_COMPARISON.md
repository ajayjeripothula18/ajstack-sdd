# Comprehensive Architectural & Technical Comparison: `ajstack-sdd` vs. Cursor `pstack`

**Document Version**: 1.0.0  
**Author**: Ajay Jeripothula & Antigravity Systems Architecture Team  
**Date**: November 2026  
**Status**: Authoritative Reference  
**Subject**: Comparative Architectural Analysis of Spec-Driven Development (`ajstack-sdd`) and In-IDE Cognitive Orchestration (`pstack`)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
   - [1.1 Context and Overview](#11-context-and-overview)
   - [1.2 Core Theses & Philosophical Divergence](#12-core-theses--philosophical-divergence)
   - [1.3 High-Level Synthesis of Findings](#13-high-level-synthesis-of-findings)
2. [Architectural & Workflow Comparison](#2-architectural--workflow-comparison)
   - [2.1 The 3-Phase SDD Lifecycle in `ajstack-sdd`](#21-the-3-phase-sdd-lifecycle-in-ajstack-sdd)
     - [Phase 0: INITIATE (`/project-init`)](#phase-0-initiate-project-init)
     - [Phase 1: SLICE (`/linear-slice`)](#phase-1-slice-linear-slice)
     - [Phase 2: EXECUTION (`rstack` Core Engine)](#phase-2-execution-rstack-core-engine)
   - [2.2 Architecture and Execution Lifecycle in Cursor `pstack`](#22-architecture-and-execution-lifecycle-in-cursor-pstack)
     - [Master Router: `/poteto-mode` & Task Playbooks](#master-router-poteto-mode--task-playbooks)
     - [Autonomous Subagents: `poteto-agent` & `comment-sicko`](#autonomous-subagents-poteto-agent--comment-sicko)
     - [Multi-Model Allocation & Reasoning Budgets (`/setup-pstack`)](#multi-model-allocation--reasoning-budgets-setup-pstack)
     - [The 24 Codified Engineering Principles](#the-24-codified-engineering-principles)
   - [2.3 State Boundaries, Persistence, & Context Management](#23-state-boundaries-persistence--context-management)
   - [2.4 Invariants, Gating Mechanics, & Failure Modes](#24-invariants-gating-mechanics--failure-modes)
3. [Skill-by-Skill & Tool-by-Tool Mapping](#3-skill-by-skill--tool-by-tool-mapping)
   - [3.1 Mapping Side A: `ajstack-sdd` Skills to `pstack` Counterparts](#31-mapping-side-a-ajstack-sdd-skills-to-pstack-counterparts)
   - [3.2 Mapping Side B: `pstack` Plugins & Skills to `ajstack-sdd` Counterparts](#32-mapping-side-b-pstack-plugins--skills-to-ajstack-sdd-counterparts)
   - [3.3 The 23 Task Playbooks Mapped to SDD Constructs](#33-the-23-task-playbooks-mapped-to-sdd-constructs)
   - [3.4 Deep-Dive Mechanical Comparison of Shared & Unique Subsystems](#34-deep-dive-mechanical-comparison-of-shared--unique-subsystems)
     - [Subsystem 1: Runtime Verification & Evidence Capture](#subsystem-1-runtime-verification--evidence-capture)
     - [Subsystem 2: Code Review Automation & Interrogation](#subsystem-2-code-review-automation--interrogation)
     - [Subsystem 3: Prose Discipline & Anti-Slop Enforcement](#subsystem-3-prose-discipline--anti-slop-enforcement)
     - [Subsystem 4: Workspace Isolation & Compute-Aware Execution](#subsystem-4-workspace-isolation--compute-aware-execution)
4. [Evaluation & Tradeoff Analysis](#4-evaluation--tradeoff-analysis)
   - [4.1 Comparative Strengths & Weaknesses Matrix](#41-comparative-strengths--weaknesses-matrix)
   - [4.2 Operational Overhead & Complexity Profile](#42-operational-overhead--complexity-profile)
   - [4.3 Tooling Requirements, Environment Compatibility, & Ergonomics](#43-tooling-requirements-environment-compatibility--ergonomics)
   - [4.4 Scenario Suitability & Best-Fit Matrix](#44-scenario-suitability--best-fit-matrix)
5. [Actionable Recommendations for Cross-Stack Evolution](#5-actionable-recommendations-for-cross-stack-evolution)
   - [5.1 Concrete Adoptions for `ajstack-sdd` (Learning from `pstack`)](#51-concrete-adoptions-for-ajstack-sdd-learning-from-pstack)
   - [5.2 Concrete Adoptions for `pstack` (Learning from `ajstack-sdd`)](#52-concrete-adoptions-for-pstack-learning-from-ajstack-sdd)
   - [5.3 The Unified Autonomous Engineering Blueprint](#53-the-unified-autonomous-engineering-blueprint)
6. [Verification Method & References](#6-verification-method--references)
   - [6.1 Independent Verification Commands](#61-independent-verification-commands)
   - [6.2 Primary Source References & Version Tags](#62-primary-source-references--version-tags)

---

## 1. Executive Summary

### 1.1 Context and Overview

The rapid transition from prompt-assisted coding to multi-agent autonomous software engineering has highlighted a critical dichotomy in tooling design. As Large Language Model (LLM) agents are granted terminal access, file system manipulation, and git capabilities, software engineering organizations face two primary failure modes:

1. **Macro-Level Drift & Hallucination**: Agents diving straight into code modification without institutional context, generating conflicting data schemas, mutating route contracts arbitrarily, and creating monolithic pull requests that defy human code review.
2. **Micro-Level Code Slop & Cognitive Laziness**: Agents introducing superficial syntactic patches, layering redundant helper wrappers, inserting verbose AI boilerplate, leaving commented-out dead code, and declaring tasks "complete" based solely on compilation without empirical runtime proof.

This technical evaluation analyzes two leading production-grade frameworks designed to solve these failure modes:

- **`ajstack-sdd`** (AJ's Linear-Backed Spec-Driven Development + `rstack`): A repository-level, structural lifecycle engine that enforces strict architectural boundaries, Docs-as-Code specifications, deterministic drift detection, and ticket-gated execution.
- **Cursor `pstack`** (Lauren Tan / `@poteto`): An in-IDE cognitive orchestrator built for Cursor and Claude Code, providing 23 task-specific execution playbooks, 24 codified engineering principles, multi-model reasoning tiering, and aggressive anti-slop filters.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                SYSTEM ARCHETYPES                                       │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│           ajstack-sdd                     │                   pstack                   │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Pipeline-Centric & Spec-Driven          │ • Agent-Centric & Cognitive-Heuristic      │
│ • "Docs-as-Code" Institutional Memory     │ • "In-Session Context & Rules" Memory      │
│ • Macro Lifecycle (Discovery ──► PR)      │ • Micro Execution (Prompt ──► Code)        │
│ • Hard Linear/GitHub Gates (spec:ready)   │ • Subagent Orchestration & Anti-Slop Rules │
│ • Sizing Invariant: < 400 Lines of Diff   │ • Philosophy: Subtractive & Verifiable     │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### 1.2 Core Theses & Philosophical Divergence

The two systems tackle the challenge of autonomous AI engineering from distinct yet complementary philosophical vantage points:

#### The `ajstack-sdd` Thesis: "Structure Governs Intelligence"
`ajstack-sdd` posits that LLMs are stochastic engines that must be constrained by external, deterministic scaffolds. Without a single source of architectural truth tracked directly in version control, agents hallucinate project requirements across turns.

Therefore, `ajstack-sdd` mandates that:
- No feature code is written until a project has a concrete architectural baseline captured in 5 canonical documents (`PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`) and immutable Architecture Decision Records (`docs/adr/`).
- No task is picked up without a deterministic drift check verifying that current code matches documentation.
- No coding agent touches the repository without an explicit issue ticket bearing the `spec:ready` label and a strict diff constraint of `< 400 lines`.
- All execution occurs in dedicated Git worktrees (`.worktrees/`), isolating agent changes from the developer's main branch and preventing port and file collisions.

#### The `pstack` Thesis: "If You Want to Go Fast, Go Deep First"
`pstack` posits that the core failure of AI coding lies in additive bloat, superficial understanding, and lack of senior-level engineering discipline. When an agent is asked to fix a bug or add a feature, its default tendency is additive sprawl—wrapping existing broken functions, adding defensive null-checks rather than fixing root causes, and generating low-value conversational comments.

Therefore, `pstack` mandates that:
- Agents must deeply investigate code semantics and architectural provenance (`/how`, `/why`) before proposing mutations.
- Engineering principles must be subtractive (`principle-subtract-before-you-add`, `principle-laziness-protocol`), driving the agent to delete code, collapse indirection, and reduce reader load.
- Verification must be empirical (`principle-prove-it-works`), requiring running code against real runtime artifacts rather than relying on compiler output.
- Execution is structured around 23 granular playbooks routed dynamically through a central orchestrator (`/poteto-mode`).

### 1.3 High-Level Synthesis of Findings

| Dimension | `ajstack-sdd` | Cursor `pstack` | Cross-Stack Verdict |
|---|---|---|---|
| **Primary Focus** | Macro-lifecycle, project management integration, architectural specifications, and hard quality gates. | Micro-execution, cognitive discipline, prompt routing, multi-model tiering, and code/comment cleanliness. | **Highly Complementary**. Neither obsoletes the other; optimal engineering combines both. |
| **System Governance** | 3-Phase SDD Lifecycle (Phase 0 Initiate, Phase 1 Slice, Phase 2 Execution) enforced via `AGENTS.md`. | Master Task Router (`/poteto-mode`) directing 23 execution playbooks and 2 subagents (`poteto-agent`, `comment-sicko`). | `ajstack-sdd` provides superior macro governance; `pstack` provides richer operational playbooks. |
| **State Persistence** | Version-controlled repository files (`docs/`, `docs/adr/`, `.worktrees/`) and issue trackers (Linear / GitHub Issues). | Ephemeral in-session memory, task lists, and IDE rule files (`.cursor/rules/*.mdc`, `.claude/rules/`). | `ajstack-sdd` prevents institutional memory loss; `pstack` optimizes for in-session prompt velocity. |
| **Quality Gates** | Hard programmatic gates: `spec:ready` label requirement, < 400 LOC diff limit, Greptile 5/5 score. | Adversarial peer review: `/interrogate` (proof-backed code review), `/no-comments`, `/unslop`. | `ajstack-sdd` excels at CI and issue tracking; `pstack` excels at pre-commit in-session interrogation. |
| **Verification Tooling** | Dedicated 1,359-line screen recorder (`evidence.py`) with burn-in annotations and isolated Playwright runner. | Behavioral testing principle (`principle-prove-it-works`), relying on host project test runners. | `ajstack-sdd` provides significantly more advanced empirical verification automation. |
| **Model Optimization** | Single-model execution driven by host environment. | Explicit multi-model role allocation (`/setup-pstack`) with configurable reasoning budgets (unlimited, xhigh, medium). | `pstack` provides superior multi-model economics and role specialization. |

---

## 2. Architectural & Workflow Comparison

### 2.1 The 3-Phase SDD Lifecycle in `ajstack-sdd`

`ajstack-sdd` replaces chaotic agent development with a three-phase Spec-Driven Development lifecycle. This pipeline guarantees that code changes are traceably anchored in formal requirements, sized for human review, and empirically proven before merging.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                THE 3-PHASE SDD LIFECYCLE                                     │
├───────────────────────────────┬───────────────────────────────┬──────────────────────────────┤
│      PHASE 0: INITIATE        │        PHASE 1: SLICE         │      PHASE 2: EXECUTION      │
│     (Greenfield / Pivot)      │    (Continuous / Mid-Dev)     │     (rstack Core Engine)     │
├───────────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ • /project-init               │ • /linear-slice               │ 1. /new-feature              │
│   - Greenfield: 2-3 turn      │   - Deterministic drift check │    - Dedicated git worktree  │
│     delta interview           │   - < 400 lines PR sizing     │    - .worktrees/<name>       │
│   - Brownfield: 8-step scan   │   - 4 Issue templates:        │ 2. /code-structure           │
│     [CONFIRMED]/[INFERRED]    │     Feature, Refactor,        │    - Actions vs. Services    │
│   - 5 Canonical docs/ files   │     Bug, Debt                 │ 3. /evidence-driven-testing  │
│   - Versioned docs/adr/       │   - Linear & GitHub label     │    - evidence.py screen rec  │
│ • Gate: Human approval of     │     parity: `spec:ready`      │    - Isolated Playwright     │
│   docs/ before code begins    │ • Gate: Coding strictly barred│ 4. /before-and-after         │
│                               │   without `spec:ready`        │ 5. /unslop & /greploop       │
└───────────────────────────────┴───────────────────────────────┴──────────────────────────────┘
```

#### Phase 0: INITIATE (`/project-init`)
The objective of Phase 0 is to establish institutional architecture documentation before a single line of feature code is written, eliminating ephemeral scratchpads (`STATE.md`, `TODO.md`) in favor of versioned repository assets.

- **Mode A: Greenfield Discovery**:
  - Implements a low-friction, conversational, delta-based interview lasting at most 2–3 turns.
  - *Turn 1*: Core problem statement, target audience, and primary domain entities.
  - *Turn 2*: Proposed technology stack, architectural patterns, and external integrations.
  - *Turn 3*: Critical user journey, screen state inventory, and quality bar (WCAG targets, performance thresholds).
  - Concludes with an explicit **Readiness Check** presenting a structured summary for human approval before files are generated.
- **Mode B: Brownfield Discovery ("Inspect First, Ask Second")**:
  - Executes an 8-step deterministic scan of existing repository files:
    1. Monorepo structure (`pnpm-workspace.yaml`, `turborepo.json`, `lerna.json`).
    2. Dependencies and frameworks (`package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`).
    3. TypeScript and compiler configs (`tsconfig.json`).
    4. Routing architecture (`src/app/`, `src/routes/`, `pages/`).
    5. Data persistence schemas and migrations (`prisma/`, `drizzle/`, `migrations/`).
    6. Authentication and session middleware (`middleware.ts`, `auth/`).
    7. Styling and component libraries (`tailwind.config.*`, CSS modules).
    8. Client and server state management (`zustand`, `redux`, `jotai`, `react-query`).
  - Tags all discovered items with confidence classifications:
    - `[CONFIRMED]`: Verified directly from code or configuration files.
    - `[INFERRED]`: Inferred from naming conventions, imports, or architectural patterns.
    - `[MISSING]`: Architectural voids requiring human clarification.
- **The 5 Canonical Documents & ADR Suite**:
  1. `docs/PRD.md`: Problem framing, user personas, user stories with Acceptance Criteria, non-functional requirements, and explicit out-of-scope boundaries.
  2. `docs/ARCHITECTURE.md`: High-level Mermaid data flow diagrams, Service Layer component boundaries (Routes ──► Actions ──► Services ──► Models), state management strategy, directory layout map, WCAG accessibility targets, and responsive breakpoints.
  3. `docs/DATA_MODEL.md`: Domain entity schemas, typed fields, constraints, cardinality relationships (1:1, 1:N, N:M), and storage contracts (relational, cache, object storage).
  4. `docs/API.md`: Route definitions, HTTP verbs, payload and response JSON schemas, error handling contracts, and webhook signatures.
  5. `docs/USER_FLOWS.md`: Mermaid flowchart of the primary user journey, screen state inventory (Loading, Empty, Success, Error states), and route transitions.
  6. `docs/adr/`: Michael Nygard-format Architecture Decision Records (`0001-record-architecture-decisions.md`, `0002-tech-stack.md`, and `template.md`), maintaining sequential numbering (`0003-*`, `0004-*`).
- **Phase 0 Gate**: The human reviewer must approve the generated `docs/` suite. No implementation work is authorized until this gate passes.

#### Phase 1: SLICE (`/linear-slice`)
Phase 1 bridges specifications and execution by translating requirements into bite-sized, testable units of work tracked in Linear or GitHub Issues.

- **Deterministic Drift Detection**:
  - Before an issue is sliced, the skill runs automated grep and shell checks between `docs/` and active code to ensure the specification reflects codebase reality:
    - Dependencies: Checks `package.json` against `ARCHITECTURE.md`.
    - State: `grep -rn "createStore\|zustand\|createContext" src/`.
    - Database: Checks Prisma/Drizzle schemas against `DATA_MODEL.md`.
    - API: Checks route files against `API.md`.
  - If drift is detected, ticket generation halts immediately, prompting the developer to update `docs/` first.
- **The `< 400 Lines` Sizing Rule**:
  - Every issue must represent exactly **one shippable pull request**.
  - Diff budget: Strictly under **400 lines of diff**.
  - Time budget: 1 to 2 days of engineering effort. Larger epics must be decomposed into sequential sub-issues.
- **4 Standardized Issue Types & Templates**:
  1. `Feature`: New user-facing capability. Requires Context, Objective, System Touchpoints (Creates, Modifies, Architecture Pattern), Given/When/Then Acceptance Criteria, Out-of-Scope boundaries, and Dependencies (`Depends on`, `Blocks`).
  2. `Refactor`: Internal restructuring with ZERO behavioral change. Requires Context, Invariants to Preserve (API contracts, schema, passing test suites), Files Affected, 3-step Migration Plan, Rollback Plan, and Dependencies.
  3. `Bug`: Defect or regression fix. Requires Reproduction Steps, Environment, Expected vs. Actual behavior, Root Cause Hypothesis, and Acceptance Criteria (failing test case reproduced, fix in Action/Service layer, passing regression test, zero console errors).
  4. `Debt`: Tooling upgrades, dependency updates, or optimizations. Requires From ──► To mapping, Migration Steps, Rollback Plan, and Acceptance Criteria (zero compiler errors, smoke checks pass, performance baseline maintained).
- **Universal Label Parity**:
  - Linear (compatible with free and paid tiers): `spec:ready` + `type:feature` | `type:refactor` | `type:bug` | `type:debt`, state `Todo`.
  - GitHub Issues: Same labels, state `open`, dependencies declared in body text (`Depends on: #42`).
  - Offline Staging: If Linear MCP and GitHub CLI are unreachable, stages tickets to `.artifacts/staged-issues/issue-$(date +%Y%m%d%H%M%S).md`.
- **Phase 1 Gate**: **Coding agents must never begin code implementation on an issue lacking the `spec:ready` label.**

#### Phase 2: EXECUTION (`rstack` Core Engine)
Phase 2 executes the sliced issue inside an isolated, compute-aware environment with rigorous verification.

1. **Isolation (`/new-feature`)**:
   - Runs scope check against open PRs (`gh pr list`, `gh pr diff`) to detect file overlap.
   - Creates a dedicated Git worktree and branch from `origin/main` (e.g., `feat/ADS-24-billing-portal`).
   - Shared-Host Protocol: Places worktrees in `.worktrees/<feature-name>` (gitignored at project root) and symlinks `node_modules` (`ln -s ../node_modules .worktrees/<feature-name>/node_modules`) to conserve disk space.
   - Cloud Sandbox Protocol: Operates seamlessly within ephemeral containers (Cursor Cloud Agents, Orgo, GitHub Codespaces).
2. **Service Layer Architecture (`/code-structure`)**:
   - Strictly enforces separation between Orchestration and Mechanics:
     - **Actions (Orchestration)**: Own business policy, user permission checks, state transitions, transaction lifecycles, retry strategies, and user-facing error formatting ("What this product flow means").
     - **Services (Shared Mechanics)**: Own reusable operations, third-party SDK calls, shell execution, health probes, and returning structured typed results ("How to do this operation reliably").
   - Forbids god services, leaky abstraction layers, and speculative indirection.
3. **Empirical Verification (`/evidence-driven-testing` & `/before-and-after`)**:
   - Requires observable proof of acceptance criteria.
   - Interactive screen recording via `scripts/evidence.py`: Captures video with Jest-style subtitle burn-in (`setup`, `test_start`, `assertion`).
   - Headless verification via `scripts/run-playwright.sh`: Spawns temporary Playwright 1.63.0 runners in `mktemp -d` without polluting host dependencies.
   - Visual comparisons via `@vercel/before-and-after`: Generates visual diff pairs and formats markdown comparison tables via `upload-and-copy.sh`.
4. **Prose & Code Hygiene (`/unslop` & `/greploop`)**:
   - `unslop`: Strips AI tells, superficial participles, em dashes, chatbot filler, and corporate marketing puffery from PR titles, commits, and documentation.
   - `greploop`: Automates a bounded polling loop against the Greptile AI bot on GitHub, GitLab, or Perforce, driving the PR to a verified **5/5 confidence score with zero actionable findings**.
   - `greploop-apps`: Handles large PRs via the `@greptile-apps` trigger.

---

### 2.2 Architecture and Execution Lifecycle in Cursor `pstack`

Cursor `pstack` takes an orthogonal architectural approach: rather than governing the external development pipeline, it operates as an **in-IDE cognitive operating system** that structures agent reasoning, suppresses slop generation, and orchestrates specialized subagents.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CURSOR PSTACK ARCHITECTURE                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                     /poteto-mode                                             │
│                     (Master Task Router & Context Window Guardian)                           │
│                                           │                                                  │
│        ┌──────────────────────────────────┴──────────────────────────────────┐               │
│        ▼                                                                     ▼               │
│  23 Task Playbooks                                                   Autonomous Subagents    │
│  • investigation.md        • shipping.md                             • poteto-agent.md       │
│  • bug-fix.md              • autopilot-full.md                         (Code Delegate)       │
│  • perf-issue.md           • orchestrate.md                          • comment-sicko.md      │
│  • hillclimb.md            • session-pickup.md                         (Zero-Slop Auditor)   │
│  • feature.md              • pause-safely.md                                                 │
│  • refactoring.md          • prototype.md (see matrix)                                       │
│        │                                                                                     │
│        ├──────────────────────────────────┬──────────────────────────────────┐               │
│        ▼                                  ▼                                  ▼               │
│  Interactive Skills                 Multi-Model Routing              24 Engineering          │
│  • /how (Code Walkthrough)          • /setup-pstack                  Principles              │
│  • /why (Design Historian)          • Orchestrator / Judgment        • subtract-before-add   │
│  • /architect (Type Contracts)      • Code Delegate                  • attack-the-premise    │
│  • /arena (Worktree Tournaments)    • Adversarial Panel              • prove-it-works        │
│  • /interrogate (Proof Review)      • Reasoning Budgets              • laziness-protocol     │
│  • /no-comments (Cleanliness)         (unlimited, xhigh, med)        • 19 other principles   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Master Router: `/poteto-mode` & Task Playbooks
At the core of `pstack` is `/poteto-mode` (`skills/poteto-mode/SKILL.md`), a master orchestrator that intercepts user requests, matches the task against one of 23 predefined execution playbooks, and manages the execution lifecycle:

- **Guard the Context Window (`principle-guard-the-context-window`)**: The orchestrator prohibits dumping large file contents into the primary chat thread. Instead, it delegates reading, searching, and prototyping to subagents, preserving the main context window for high-level reasoning and synthesis.
- **Strict In-Chat Task Tracking**: Sets up an explicit, numbered to-do list derived from the matched playbook. The agent cannot skip steps or advance without verifying prior items.
- **23 Specialized Playbooks**: Rather than relying on generic LLM problem-solving, `pstack` maintains 23 specialized markdown runbooks under `skills/poteto-mode/playbooks/`. Each playbook details entry criteria, investigation protocols, execution steps, and verification invariants for scenarios ranging from distributed tracing (`trace-forensics.md`) and latency hillclimbing (`hillclimb.md`) to PR babysitting (`babysit.md`) and session context pickup (`session-pickup.md`).

#### Autonomous Subagents: `poteto-agent` & `comment-sicko`
`pstack` formalizes delegation through two specialized agent roles defined under `agents/`:

1. **`poteto-agent` (`agents/poteto-agent.md`)**:
   - The primary execution subagent spawned by `/poteto-mode` for code authoring and file mutations.
   - Enforces strict execution rules: Must read `skills/poteto-mode/SKILL.md` and the Principles Index before making modifications. Enforces minimal diffs, unslopped prose, zero speculative wrappers, and immediate runtime verification.
2. **`comment-sicko` (`agents/comment-sicko.md`)**:
   - A specialized quality assurance subagent dedicated exclusively to code cleanliness and comment eradication.
   - Scans diffs for conversational AI commentary, block banners, obvious docstrings that rephrase variable names, commented-out dead code, and low-value suppressions (`@ts-ignore`, `eslint-disable`).
   - Issues `MUST KILL` directives, forcing the code to be self-documenting through precise type signatures and semantic naming.

#### Multi-Model Allocation & Reasoning Budgets (`/setup-pstack`)
Unlike frameworks that rely on a single model endpoint, `pstack` acknowledges that different engineering phases require different cognitive profiles:

- **Config Generation**: Generates persistent configuration files: `~/.cursor/rules/pstack-models.mdc` for Cursor or `~/.claude/rules/pstack-models.md` for Claude Code.
- **Role Tiering**:
  - `orchestrator` / `judgment`: Assigned to frontier reasoning models (e.g., Claude 3.7 Sonnet with extended thinking, OpenAI o3-mini high). Responsible for planning, architectural review, and evaluating tradeoffs.
  - `code delegate`: Assigned to fast, cost-effective coding models (e.g., Sonnet standard, GPT-4o). Responsible for writing implementations and running unit tests.
  - `adversary review panel`: Configures a panel of heterogeneous models for `/interrogate` and `/arena`, ensuring diverse critique angles.
- **Reasoning Budget Allocation**: Configures per-role token budgets for reasoning models (`unlimited`, `xhigh`, `medium`, `small`), optimizing token expenditure.

#### The 24 Codified Engineering Principles
`pstack` formalizes 24 senior-level engineering principles into modular leaf skills (`skills/principle-*/`) and indexes them inside `/poteto-mode`:

| Category | Principle | Core Mandate |
|---|---|---|
| **Core & Scope** | `principle-laziness-protocol` | Bias toward deletion. The best diff is the smallest diff that solves the problem. |
| | `principle-foundational-thinking` | Settle data shapes and core interfaces before writing executable business logic. |
| | `principle-redesign-from-first-principles` | Design as if the new requirement was known from day one; avoid awkward adapter patching. |
| | `principle-attack-the-premise` | When two debugging attempts fail, step back, challenge the underlying assumption, and test the premise directly. |
| | `principle-subtract-before-you-add` | Before adding new functions, purge obsolete abstractions, dead code, and redundant wrappers. |
| | `principle-minimize-reader-load` | Optimize for future human code comprehension. Collapse single-caller indirection and unnecessary layers. |
| | `principle-outcome-oriented-execution` | Focus on the final desired state; avoid intermediate temporary scaffold code. |
| | `principle-experience-first` | Prioritize the end-user experience and API ergonomics over internal implementation convenience. |
| **Architecture** | `principle-model-the-domain` | Encode domain concepts as typed state machines rather than scattered boolean flags. |
| | `principle-boundary-discipline` | Validate rigorously at the boundary (inputs, network, disk); trust internal types completely. |
| | `principle-type-system-discipline` | Use the type system to make illegal system states unrepresentable. |
| | `principle-make-operations-idempotent` | Ensure repeated execution safely converges on the same state without side effects. |
| | `principle-migrate-callers-then-delete-legacy-apis` | Migrate all callers and delete legacy interfaces in a single synchronized PR. |
| | `principle-separate-before-serializing-shared-state` | Isolate state ownership before introducing synchronization locks or mutexes. |
| **Verification** | `principle-prove-it-works` | Require observable execution proof against the real runtime environment; "it compiles" is rejected. |
| | `principle-fix-root-causes` | Trace failures to their originating source; never patch superficial symptoms. |
| | `principle-sequence-verifiable-units` | Divide work into small increments ending with an explicit verification command. |
| | `principle-test-behavior-not-implementation` | Test observable public behavior so test suites survive internal refactorings. |
| **Delegation** | `principle-guard-the-context-window` | Offload heavy grep/file reading to subagents; synthesize findings in the orchestrator. |
| | `principle-never-block-on-the-human` | Proceed autonomously on reversible decisions; present polished results for approval. |
| **Meta-Engineering** | `principle-encode-lessons-in-structure` | Convert recurring human feedback into permanent linters, types, or automated scripts. |
| | `principle-build-the-lever` | Build reusable generators, codemods, and scripts when facing repetitive tasks. |
| | `principle-exhaust-the-design-space` | Brainstorm and contrast multiple architectural options before committing to one. |
| | `principle-explain-the-number` | Anchor performance, latency, and memory claims to concrete baseline measurements and profiling numbers. |

---

### 2.3 State Boundaries, Persistence, & Context Management

A fundamental differentiator between the two architectures lies in how they manage system state across multi-turn interactions, multi-agent collaborations, and human developer boundaries.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STATE PERSISTENCE BOUNDARIES                              │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│               ajstack-sdd                 │                   pstack                   │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│                docs/                      │             .cursor/rules/                 │
│  (PRD, ARCHITECTURE, DATA_MODEL, API,     │     (pstack-models.mdc, rules)             │
│            USER_FLOWS, adr/)              │                   │                        │
│                   │                       │                   ▼                        │
│                   ▼                       │       In-Session Chat Context              │
│            Linear / GitHub                │     (To-Do list, task memory,              │
│       (spec:ready, type:*, <400)          │          scratchpad state)                 │
│                   │                       │                   │                        │
│                   ▼                       │                   ▼                        │
│              .worktrees/                  │           Subagent Memory                  │
│       (feat/ADS-24-slug isolation)        │     (poteto-agent, comment-sicko)          │
│                   │                       │                   │                        │
│                   ▼                       │                   ▼                        │
│               .artifacts/                 │              Git Commits                   │
│        (raw.ts, evidence videos)          │           (PR branch state)                │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### `ajstack-sdd`: Docs-as-Code & Institutional Memory
`ajstack-sdd` strictly segregates state into three permanent, version-controlled tiers:
1. **Architectural Truth (`docs/`)**: Domain models, API schemas, and architecture contracts live in tracked repository markdown files. They survive session clears, agent resets, and team turnover.
2. **Backlog State (Linear / GitHub Issues)**: Task status, acceptance criteria, and dependency graphs live in external project management systems. Agents do not maintain private todo lists; they read tickets.
3. **Workspace Isolation (`.worktrees/`)**: Code mutations occur in isolated git worktrees. This prevents work-in-progress changes from polluting the developer's main branch or colliding with other parallel agents.

#### `pstack`: In-Session Context & Cognitive Rules
`pstack` manages state primarily within the conversational context and IDE rule configuration:
1. **Static Rules (`.cursor/rules/*.mdc`)**: Model allocations, reasoning budgets, and global project constraints are declared in static MDC files loaded by the Cursor IDE.
2. **Ephemeral Conversation State**: Playbook step execution, task todo lists, and intermediate investigation findings live in the active LLM context window.
3. **Session Pickup (`session-pickup.md`)**: When context is lost or a developer resumes work on a branch, `pstack` runs an explicit pickup routine, inspecting recent git logs and diffs to reconstruct mental context.

---

### 2.4 Invariants, Gating Mechanics, & Failure Modes

Both frameworks implement strict invariants to maintain code quality, but they operate at different layers of the development stack.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              GATING & INVARIANT COMPARISON                             │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Invariant / Gate              │ Implementation & Enforcement Mechanism                 │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Requirement Gate**          │ • ajstack-sdd: `spec:ready` label in Linear/GitHub.    │
│                               │   Agents halt if ticket lacks this label.              │
│                               │ • pstack: `/in-your-own-words` & `/sharpen`.           │
│                               │   Agents restate problem and verify understanding.     │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Diff Size Ceiling**         │ • ajstack-sdd: Strict `< 400 lines of diff` rule.      │
│                               │   Forces decomposition into sequential PRs.            │
│                               │ • pstack: `principle-laziness-protocol`.               │
│                               │   Heuristic bias toward minimal diffs.                 │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Architectural Drift**       │ • ajstack-sdd: Deterministic grep/package scan         │
│                               │   checking code vs docs/ before slicing.               │
│                               │ • pstack: Interactive `/how` and `/why` exploration    │
│                               │   relying on LLM code analysis.                        │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Workspace Isolation**       │ • ajstack-sdd: Mandatory `.worktrees/` directory       │
│                               │   with symlinked `node_modules`.                       │
│                               │ • pstack: Worktrees used conditionally in `/arena`     │
│                               │   for parallel model tournaments.                      │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Verification Gate**         │ • ajstack-sdd: Screen recording (`evidence.py`)        │
│                               │   with subtitle burn-in + isolated Playwright.         │
│                               │ • pstack: `principle-prove-it-works` requiring         │
│                               │   real execution logs in PR body.                      │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Code Review Gate**          │ • ajstack-sdd: Bounded Greptile bot review             │
│                               │   requiring 5/5 confidence score (`/greploop`).        │
│                               │ • pstack: Adversarial multi-model code review          │
│                               │   requiring executable proof (`/interrogate`).         │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

#### Failure Mode Comparison

1. **Failure Mode 1: Context Window Exhaustion & Amnesia**
   - *ajstack-sdd*: Resilient. Because specifications reside in `docs/` and ticket states reside in Linear, an agent whose context window is truncated can immediately reload `docs/ARCHITECTURE.md` and resume work without loss of architectural continuity.
   - *pstack*: Vulnerable without manual intervention. If a long-running session clears, in-memory todo lists and subagent investigation notes vanish, requiring the developer to trigger `session-pickup.md` to rebuild context.
2. **Failure Mode 2: Premature Code Generation**
   - *ajstack-sdd*: Immune. Agents are hard-coded to check for the `spec:ready` label and verify drift. If an unsliced issue is presented, the agent halts and invokes `/linear-slice`.
   - *pstack*: Moderately protected. Depends on the agent adhering to `/poteto-mode` and playbook entry criteria; without an external tracker gate, an unconstrained prompt can bypass planning.
3. **Failure Mode 3: Over-Engineering & Additive Bloat**
   - *ajstack-sdd*: Moderately protected. Sizing rules (< 400 LOC) limit diff size, and `/code-structure` prevents god services, but it does not aggressively force comment stripping or deletion of adjacent legacy code.
   - *pstack*: Highly immune. Armed with `comment-sicko`, `/no-comments`, `principle-subtract-before-you-add`, and `principle-laziness-protocol`, `pstack` aggressively cuts unnecessary code and comments.

---

## 3. Skill-by-Skill & Tool-by-Tool Mapping

### 3.1 Mapping Side A: `ajstack-sdd` Skills to `pstack` Counterparts

This table maps every skill in `ajstack-sdd` to its equivalent, counterpart, or philosophical equivalent in Cursor `pstack`, detailing feature parity, underlying mechanisms, and unique features.

| `ajstack-sdd` Skill | `pstack` Counterpart | Feature Parity & Relationship | Detailed Mechanism Comparison |
|---|---|---|---|
| `project-init` | *No direct equivalent*<br>(Partial overlap with `/architect`, `/how`, `prototype.md`) | **Unique to `ajstack-sdd`**.<br>`pstack` lacks an automated greenfield/brownfield discovery engine generating canonical documentation. | `project-init` executes an 8-step deterministic scan of configs, routes, schemas, and state stores, tagging findings `[CONFIRMED]`, `[INFERRED]`, and `[MISSING]`. Generates 5 canonical docs (`PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`) and versioned ADRs. `pstack` relies on on-demand in-chat queries (`/how`, `/why`). |
| `linear-slice` | *No direct equivalent*<br>(Partial overlap with `poteto-mode/playbooks/orchestrate.md`, `/sharpen`) | **Unique to `ajstack-sdd`**.<br>`pstack` has no native issue-tracker integration or deterministic drift engine. | `linear-slice` executes deterministic shell/grep checks against `docs/`, enforces the `< 400 lines` diff ceiling, formats 4 standardized issue templates (`Feature`, `Refactor`, `Bug`, `Debt`), and synchronizes labels (`spec:ready`, `type:*`) across Linear MCP and GitHub Issues. `pstack` operates on conversational prompts and in-session todo lists. |
| `new-feature` | `/arena` (worktree isolation aspect) | **Functional Overlap**.<br>Both use Git worktrees, but for different operational purposes. | `new-feature` creates isolated worktrees in `.worktrees/<name>`, symlinks `node_modules` to save disk space, checks open PR scope collisions (`gh pr list`), and enforces single-branch isolation on shared hosts. `pstack` uses worktrees primarily to stage parallel multi-model tournaments in `/arena`. |
| `code-structure` | `/architect` | **Functional Equivalence**.<br>Both define component boundaries before coding begins. | `code-structure` enforces a strict two-layer architecture: Actions (orchestrating business policy, auth, retries, user errors) vs. Services (reusable mechanics, provider calls, structured results). `pstack`'s `/architect` focuses on defining pseudocode type signatures, module boundaries, and interfaces. |
| `evidence-driven-testing` | `principle-prove-it-works` + verification runbooks | **`ajstack-sdd` has superior operational tooling**.<br>`pstack` has the philosophy; `ajstack-sdd` has the engine. | `evidence-driven-testing` bundles a 1,359-line Python recorder (`evidence.py`) supporting Linux (X11/Wayland), macOS, and Windows with Jest-style subtitle burn-in (`setup`, `test_start`, `assertion`) and crashproof MPEG-TS output. Also provides `run-playwright.sh` executing Playwright 1.63.0 in isolated `mktemp -d` directories. `pstack` mandates proof in text but provides no capture binaries. |
| `before-and-after` | *No direct equivalent*<br>(Partial overlap with `visual-parity.md`) | **Unique to `ajstack-sdd`**.<br>`pstack` provides visual styling guidance but lacks automated diff capture. | `before-and-after` drives the `@vercel/before-and-after` CLI, captures visual diffs, uploads via pluggable adapters (`0x0.st` or custom blob endpoints), and generates PR-ready markdown comparison tables. |
| `greploop` | `/interrogate` (philosophical counterpart) | **Different Mechanisms**.<br>External CI bot loop vs. internal in-session adversarial panel. | `greploop` executes an automated Python loop (`github_review.py`, 258 lines) polling Greptile bot on GitHub, GitLab, or Perforce, enforcing a 5/5 score. `/interrogate` is an internal multi-model review panel attempting to break diffs inside the chat session. |
| `greploop-apps` | *No direct equivalent* | **Unique to `ajstack-sdd`**.<br>Dedicated entrypoint for large pull requests. | Specialized trigger invoking Greptile via `@greptile-apps review` when PRs exceed standard file count thresholds. |
| `unslop` | `/unslop` | **Exact Lineage**.<br>`ajstack-sdd` adopts `unslop` directly from `pstack`. | Both execute a 31-rule heuristic parser stripping AI tells (em dashes, participles, superficial enthusiasm, filler, passive voice) from PR titles, commit messages, and documentation. |

---

### 3.2 Mapping Side B: `pstack` Plugins & Skills to `ajstack-sdd` Counterparts

This table maps every plugin, skill, agent, and core command in Cursor `pstack` to its equivalent in `ajstack-sdd`.

| `pstack` Component | Category | `ajstack-sdd` Counterpart | Feature Parity & Assessment |
|---|---|---|---|
| `/poteto-mode` | Orchestrator | `AGENTS.md` (3-Phase SDD Lifecycle) | **Architectural Divergence**. `pstack` uses a dynamic in-session prompt router directing 23 playbooks; `ajstack-sdd` uses a declarative, ticket-gated SDD pipeline. |
| `poteto-agent` | Agent Persona | Coding Worker Agent (Phase 2) | **Functional Equivalence**. Both serve as the primary implementation subagents operating inside isolated branches/worktrees. |
| `comment-sicko` | Agent Persona | *No direct equivalent* | **Unique to `pstack`**. A specialized zero-tolerance auditor stripping unnecessary code comments, banner headers, and low-value suppressions. |
| `/setup-pstack` | Configuration | *No direct equivalent* | **Unique to `pstack`**. Dynamically configures model roles (orchestrator vs. delegate vs. adversary) and reasoning token budgets in `.cursor/rules/pstack-models.mdc`. |
| `/poteto-help` | Diagnostics | `bin/cli.js list` | **Functional Overlap**. `ajstack-sdd` CLI lists skills and phases; `pstack` provides contextual in-chat diagnostics. |
| `/how` | Exploration | `project-init` (Mode B Scan) | **Complementary**. `project-init` scans code to generate static architecture documentation; `/how` provides interactive, conversational code walkthroughs. |
| `/why` | Historian | `docs/adr/` (Architecture Decision Records) | **Complementary**. `ajstack-sdd` codifies historical rationale into immutable ADR files; `/why` investigates historical git blame and commits on-demand. |
| `/architect` | Architecture | `code-structure` + `docs/ARCHITECTURE.md` | **Strong Parity**. Both define type boundaries, contracts, and module interfaces before implementation. |
| `/arena` | Tournament | *No direct equivalent* | **Unique to `pstack`**. Runs competing models/implementations in parallel git worktrees judged by an independent arbiter. |
| `/swarm` | Parallelism | Teamwork Multi-Agent Execution | **Functional Parity**. Fans out tasks across parallel subagents. |
| `/interrogate` | Adversarial QA | `/greploop` | **Complementary**. Local in-session adversarial diff review (`/interrogate`) vs. external CI bot review loop (`/greploop`). |
| `/unslop` | Hygiene | `unslop` | **Identical**. Exact upstream source incorporated into `ajstack-sdd`. |
| `/no-comments` | Hygiene | *No direct equivalent* | **Unique to `pstack`**. Strips redundant comments, conversational artifacts, and obvious docstrings. |
| `/automate-me` | Meta-Tooling | *No direct equivalent* | **Unique to `pstack`**. Mines conversation transcripts to generate project-specific custom agent skills. |
| `/in-your-own-words` | Alignment | `linear-slice` (Acceptance Criteria) | **Functional Overlap in Goal**. Both ensure task alignment; `in-your-own-words` forces conversational synthesis, while `linear-slice` codifies Given/When/Then criteria into tickets. |
| `/sharpen` | Scoping | `linear-slice` (Issue Decomposition) | **Functional Overlap**. Both refine task boundaries; `/sharpen` deepens prompts, while `linear-slice` decomposes tasks into `< 400 LOC` tickets. |
| `/figure-it-out` | Framing | `project-init` + `linear-slice` | **Functional Overlap**. Problem framing handled via Phase 0 & Phase 1 discovery in `ajstack-sdd`. |
| `typescript-best-practices` | Standards | `code-structure` (Coding Standards) | **Domain Overlap**. Specialized guidelines for type-safe software design. |
| `/tdd` | Verification | `evidence-driven-testing` | **Strong Conceptual Parity**. `pstack` enforces an interactive red-green-refactor loop in-session; `ajstack-sdd` enforces test-driven runtime verification (recording red failure before green fix via `evidence.py`). |
| `/maintain-verification-skill` | Meta-Tooling | `bin/cli.js` + `AGENTS.md` | **Functional Overlap**. `pstack` audits and updates repository verification skills and feature maps; `ajstack-sdd` maintains centralized verification protocols in `AGENTS.md` and automated CLI scaffolding. |
| `/show-me-your-work` | Observability | `evidence-driven-testing` (`raw.ts`) + `before-and-after` | **Shared Goal, Distinct Media**. `pstack` enforces plain, concrete execution logging and transcript sharing in chat; `ajstack-sdd` captures binary evidence (MPEG-TS videos, burned-in subtitles, visual diff tables). |
| `/teach` | Exploration | `docs/ARCHITECTURE.md` + `docs/USER_FLOWS.md` | **Static vs. Interactive Walkthrough**. `ajstack-sdd` codifies system architecture and mental models into permanent canonical markdown; `pstack` provides interactive, conversational code walkthroughs. |
| `/recall` | Memory | `docs/` Specs + Linear Ticket State | **Ephemeral vs. Persistent Context**. `pstack` reconstructs topic context from session history and local files; `ajstack-sdd` relies on version-controlled specs in `docs/` that survive agent context loss. |
| 24 Principles | Principles | `AGENTS.md` Invariants | **Philosophical Depth in `pstack`**. `pstack` articulates 24 discrete, named principles cited directly during agent reasoning. |

---

### 3.3 The 23 Task Playbooks Mapped to SDD Constructs

Cursor `pstack` organizes execution into 23 granular playbooks located in `skills/poteto-mode/playbooks/`. The following matrix maps each playbook to its equivalent operational construct within `ajstack-sdd`:

| # | `pstack` Playbook (`.md`) | Primary Objective in `pstack` | Corresponding `ajstack-sdd` Construct & Handling |
|---|---|---|---|
| 1 | `investigation.md` | Read-only root cause and causality analysis without modifying code. | Handled via Phase 0 Brownfield scan (`project-init`) or Bug issue triage in `linear-slice`. |
| 2 | `bug-fix.md` | Minimal reproduction, isolated fix, and regression test. | Handled via `linear-slice` (Bug template: Repro steps, root cause hypothesis, fix in Action/Service). |
| 3 | `perf-issue.md` | Latency profiling, bottleneck isolation, and benchmark comparisons. | Handled via `linear-slice` (Debt template: Performance baseline) and `evidence-driven-testing`. |
| 4 | `hillclimb.md` | Progressive metric optimization loops until a threshold is reached. | Handled via Phase 2 iterative test-driven loops in worktrees. |
| 5 | `runtime-forensics.md` | Investigating live runtime anomalies, telemetry, and error logs. | Handled via `evidence-driven-testing` diagnostics and browser console logging. |
| 6 | `trace-forensics.md` | Inspecting distributed tracing spans and transaction flows. | Represented in `docs/ARCHITECTURE.md` (data flow maps) and service error handling. |
| 7 | `feature.md` | Scoping, designing, delegating, and verifying a new feature. | Directly mapped to Phase 1 (`linear-slice` Feature template) and Phase 2 (`new-feature`, `code-structure`). |
| 8 | `refactoring.md` | Structural transformation with ZERO behavioral modification. | Directly mapped to `linear-slice` Refactor template (Invariants to preserve, migration steps, rollback plan). |
| 9 | `prototype.md` | Disposable exploratory spike or algorithm prototype. | Handled in Phase 0 Greenfield discovery or dedicated scratch worktrees. |
| 10 | `visual-parity.md` | Aligning UI implementation with visual design specifications. | Directly mapped to `/before-and-after` visual diff captures and PR comparison tables. |
| 11 | `authoring-a-skill.md` | Authoring, formatting, and validating new agent skills. | Governed by `bin/cli.js` skill templates and skill frontmatter validation standards. |
| 12 | `eval.md` | Evaluating model output, prompt efficiency, and skill efficacy. | Measured via Greptile confidence metrics (`greploop`) and test pass rates. |
| 13 | `autonomous-run.md` | Unsupervised long-running agent execution across complex tasks. | Governed by Teamwork multi-agent orchestrator protocols and worktree boundaries. |
| 14 | `opening-a-pr.md` | Generating unslopped PR descriptions with empirical test logs. | Directly mapped to `upload-and-copy.sh`, `unslop`, and opening PRs via `gh pr create`. |
| 15 | `babysit.md` | Driving open PRs through CI checks, review bot feedback, and approval. | Directly mapped to `/greploop` and `/greploop-apps` automated polling loops. |
| 16 | `shipping.md` | Landing branches, cutting releases, and updating version manifests. | Handled via standard git release procedures and package publishing (`bin/cli.js`). |
| 17 | `autopilot-full.md` | End-to-end autonomous multi-PR stack execution to merge. | Handled via sequential `linear-slice` dependency chains (`Depends on: #XX`). |
| 18 | `autopilot-stack.md` | Autopilot stack execution pausing before final production merge. | Handled via PR gating rules in `AGENTS.md` ("Never merge unless explicitly instructed"). |
| 19 | `orchestrate.md` | Cross-cutting multi-worktree program management. | Governed by `AGENTS.md` multi-agent rules (scope checks, port checks, worktree isolation). |
| 20 | `session-pickup.md` | Reconstructing context from a mid-flight branch or prior session. | Partially covered by reading `docs/` and checking Linear ticket state; **adoption opportunity for `ajstack-sdd`**. |
| 21 | `pause-safely.md` | Checkpointing uncommitted changes, git state, and notes before pausing. | Addressed by committing WIP branches inside `.worktrees/`. |
| 22 | `multi-phase-plan.md` | Executing large-scale, multi-stage architectural migrations. | Directly mapped to Phase 0 `docs/ARCHITECTURE.md` + sequential Phase 1 `linear-slice` issues. |
| 23 | `worktree-cleanup.md` | Pruning merged worktrees, temporary branches, and stale lockfiles. | Handled via `git worktree remove .worktrees/<name>` and branch pruning. |

---

### 3.4 Deep-Dive Mechanical Comparison of Shared & Unique Subsystems

#### Subsystem 1: Runtime Verification & Evidence Capture
- **`ajstack-sdd` (`evidence-driven-testing`)**:
  - Implements `evidence-driven-testing/scripts/evidence.py` (1,359 lines of Python 3).
  - Multi-platform capture backend: Probes Linux X11 (`x11grab`), Linux Wayland (`wf-recorder` via `zwlr_screencopy_manager_v1`), macOS (`avfoundation`), Windows (`gdigrab`), and fallback test pattern.
  - Safe Supervisor Process: Uses `pidfd_send_signal` on Linux or spawns an independent supervisor process to manage FFmpeg children, preventing PID recycling hazards.
  - Crash Resilience: Writes to raw MPEG-TS (`raw.ts`), ensuring recordings remain playable even during abrupt process crashes or SIGKILL.
  - Subtitle Burn-In: Injects Jest-style test lifecycle markers (`setup`, `test_start`, `assertion`) using FFmpeg's `ass` filter, locking annotation files with POSIX `fcntl` or Windows `msvcrt`.
  - Headless Browser Automation: Bundles `run-playwright.sh` which provisions an isolated temporary directory (`mktemp -d`), installs a pinned Playwright (v1.63.0), executes the probe, and cleans up without polluting the host `package.json`.
- **`pstack` (`principle-prove-it-works`)**:
  - Treats verification as a philosophical and cognitive requirement rather than providing a dedicated screen capture engine.
  - Mandates that PR descriptions contain terminal execution transcripts, benchmark numbers, or unit test runs executed against the host project's test framework.

#### Subsystem 2: Code Review Automation & Interrogation
- **`ajstack-sdd` (`greploop` & `greploop-apps`)**:
  - Automates external review bot cycles using `scripts/github_review.py` (258 lines of Python 3).
  - Interacts with Greptile AI bot across GitHub, GitLab, and Perforce.
  - Enforces strict parsing rules: Extracts confidence score via regex `confidence(?:\s+score)?\s*:?\s*([0-5])\s*/\s*5` and validates the last-reviewed commit SHA to prevent stale review approvals.
  - Implements GraphQL mutations to query review threads and resolve actionable comments automatically.
- **`pstack` (`/interrogate`)**:
  - Operates entirely within the local agent session as an adversarial multi-model review panel.
  - Mandates that reviewers provide **executable proof** (a reproducible failing test case or shell script) for every claim. Unsupported assertions are discarded.
  - Enables immediate, pre-commit code hardening before code is pushed to remote repositories.

#### Subsystem 3: Prose Discipline & Anti-Slop Enforcement
- **Lineage**:
  - `ajstack-sdd` explicitly credits and incorporates `unslop` directly from Cursor `pstack` (`README.md` lines 122–128).
- **Core Mechanics**:
  - Evaluates text against 31 pattern heuristics.
  - Eliminates AI tells: em dashes (`—`), superficial `-ing` participle clauses ("delivering seamless integration"), fake enthusiasm ("I'd be happy to help!"), corporate jargon ("leverage", "utilize", "robust"), and bold-label list formatting.
  - Enforces plain, active voice across commit messages, PR descriptions, and architectural documentation.
- **`pstack`'s Additional Layer: `comment-sicko` & `/no-comments`**:
  - Extends anti-slop enforcement into source code.
  - `comment-sicko` scans diffs to delete low-value comments ("// increment counter", "// handle error"), banner dividers, and dead code, ensuring diffs remain clean.

#### Subsystem 4: Workspace Isolation & Compute-Aware Execution
- **`ajstack-sdd` (`new-feature` & `AGENTS.md`)**:
  - Built specifically to handle multi-agent development on shared developer workstations.
  - Worktrees are strictly quarantined inside `.worktrees/<feature-name>` (gitignored at the project root).
  - Conserves local disk space by symlinking `node_modules` from the main checkout.
  - Prevents port collisions by running `lsof -i :<port>` or `ss -ltnp` before launching dev servers.
- **`pstack` (`/arena` & `worktree-cleanup.md`)**:
  - Leverages worktrees primarily for competitive model tournaments in `/arena`.
  - Spawns parallel branches to test distinct algorithmic approaches side-by-side, terminating the losing branch with `worktree-cleanup.md`.

---

## 4. Evaluation & Tradeoff Analysis

### 4.1 Comparative Strengths & Weaknesses Matrix

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STRENGTHS & WEAKNESSES MATRIX                             │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Framework                     │ Architectural Strengths                                │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **`ajstack-sdd`**             │ 1. Zero-bloat Docs-as-Code architecture (5 canonical   │
│                               │    docs + versioned ADRs in docs/).                    │
│                               │ 2. Hard programmatic gating: agents strictly cannot    │
│                               │    code without a `spec:ready` Linear/GitHub ticket.   │
│                               │ 3. Deterministic drift detection halts ticket creation │
│                               │    when code diverges from architecture specs.         │
│                               │ 4. Strictly enforced diff sizing (< 400 lines of diff) │
│                               │    ensuring human reviewability and rapid PR velocity. │
│                               │ 5. Advanced, battle-tested screen recording engine     │
│                               │    (`evidence.py`) and isolated Playwright runner.     │
│                               │ 6. Host-agnostic: Pure Node CLI (zero runtime deps)    │
│                               │    supporting Claude Code, Antigravity, Cursor, Codex. │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Cursor `pstack`**           │ 1. Unmatched cognitive discipline: 24 senior-level     │
│                               │    principles prioritizing deletion and simplicity.    │
│                               │ 2. 23 specialized execution playbooks covering deep    │
│                               │    debugging, tracing, hillclimbing, and PR lifecycle. │
│                               │ 3. Multi-model role tiering (`/setup-pstack`) with     │
│                               │    configurable reasoning token budgets.               │
│                               │ 4. Local pre-commit adversarial interrogation          │
│                               │    (`/interrogate`) requiring executable proof.        │
│                               │ 5. Aggressive code cleanliness automation via          │
│                               │    `comment-sicko` and `/no-comments`.                 │
│                               │ 6. Innovative parallel tournaments (`/arena`) for      │
│                               │    complex algorithmic exploration.                    │
├───────────────────────────────┴────────────────────────────────────────────────────────┤
│ Framework                     │ Architectural Weaknesses & Operational Gaps            │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **`ajstack-sdd`**             │ 1. High initial process weight: Mandates Phase 0 docs   │
│                               │    and Phase 1 slicing before any code modification.   │
│                               │ 2. Heavy external dependency footprint (Linear MCP,    │
│                               │    GitHub CLI, Greptile bot, FFmpeg).                  │
│                               │ 3. Single-model execution: Lacks native multi-model    │
│                               │    role allocation and reasoning budget controls.      │
│                               │ 4. Lacks local, in-session adversarial review before   │
│                               │    pushing PRs to remote CI bots.                      │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ **Cursor `pstack`**           │ 1. Ephemeral architectural memory: Lacks standardized   │
│                               │    canonical documentation (docs/); context is lost    │
│                               │    when chat sessions clear.                           │
│                               │ 2. Weak issue-tracker integration: Operates on in-chat │
│                               │    todo lists rather than native Linear/GitHub tickets.│
│                               │ 3. Lacks deterministic drift detection between code    │
│                               │    and architecture specs.                             │
│                               │ 4. Lacks empirical video/browser verification tooling  │
│                               │    comparable to `evidence.py`.                        │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

### 4.2 Operational Overhead & Complexity Profile

The operational footprint of each stack varies significantly across setup time, infrastructure dependencies, token consumption, and maintenance overhead:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              OPERATIONAL OVERHEAD PROFILE                              │
├───────────────────────────────┬───────────────────────────┬────────────────────────────┤
│ Metric                        │ `ajstack-sdd`             │ Cursor `pstack`            │
├───────────────────────────────┼───────────────────────────┼────────────────────────────┤
│ **Setup Friction**            │ Zero-setup: Bootstrapped  │ Low friction: Installed    │
│                               │ via `npx ajstack-sdd init`│ via Cursor Marketplace or  │
│                               │ or `--global` flag.       │ Claude Code plugin loader. │
├───────────────────────────────┼───────────────────────────┼────────────────────────────┤
│ **External Dependencies**     │ High: Linear MCP / API,   │ Low to Moderate: Git,      │
│                               │ GitHub CLI (`gh`), Python │ Cursor IDE runtime,        │
│                               │ 3, FFmpeg, Playwright,    │ multiple LLM API keys      │
│                               │ Greptile review bot.      │ for model tiering.         │
├───────────────────────────────┼───────────────────────────┼────────────────────────────┤
│ **Token Economics**           │ High efficiency in code:  │ Variable: Low on single    │
│                               │ Heavy upfront planning    │ fixes; very high during    │
│                               │ minimizes wasted code-gen │ `/arena` tournaments and   │
│                               │ tokens and PR rework.     │ multi-agent `/swarm` runs. │
├───────────────────────────────┼───────────────────────────┼────────────────────────────┤
│ **Maintenance Burden**        │ Medium: Must maintain     │ Low: Rules and playbooks   │
│                               │ `docs/` and resolve drift │ are modular and update     │
│                               │ during major refactors.   │ via plugin registry.       │
└───────────────────────────────┴───────────────────────────┴────────────────────────────┘
```

---

### 4.3 Tooling Requirements, Environment Compatibility, & Ergonomics

#### Host Environment Matrix
- **`ajstack-sdd`**:
  - Environment Agnostic: The CLI (`bin/cli.js`) is written in 183 lines of pure ECMAScript with zero runtime dependencies.
  - Native support for:
    - **Claude Code**: Installs to `.claude/skills/` and links `CLAUDE.md`.
    - **Antigravity / Cursor / Codex**: Installs to `.agents/skills/` and provides `AGENTS.md`.
    - **Global Mode**: Installs to `~/.claude/skills` and `~/.gemini/config/skills`.
- **`pstack`**:
  - Optimized for Cursor: Leverages `.cursor-plugin/plugin.json`, `.cursor/rules/*.mdc`, and Cursor's native subagent spawning APIs.
  - Claude Code Adapter: Provides `/pstack:*` command prefixes and `.claude/rules/` mappings.

#### Developer Ergonomics
- **`ajstack-sdd` Ergonomics**: Best suited for structured, disciplined engineering workflows where pull requests are scrutinized by human peers, project managers track tickets in Linear, and production regressions carry high cost.
- **`pstack` Ergonomics**: Best suited for rapid, solo developer workflows, experimental hacking, deep debugging sessions, and developers who prioritize clean, minimalist code with zero unnecessary comments.

---

### 4.4 Scenario Suitability & Best-Fit Matrix

| Development Scenario | Recommended Stack | Technical Justification |
|---|---|---|
| **0-to-1 Greenfield Product Build** | **`ajstack-sdd`** | Phase 0 (`/project-init`) establishes foundational PRD, architecture, data models, and API contracts before coding begins, preventing architectural chaos. |
| **Complex Brownfield Codebase Refactor** | **Hybrid (`ajstack-sdd` + `pstack`)** | Use `ajstack-sdd` Phase 0 (Mode B scan) and Phase 1 (`linear-slice` Refactor template) to lock invariants; use `pstack` (`refactoring.md`, `principle-subtract-before-you-add`) for execution. |
| **Deep Latency & Performance Hillclimbing** | **`pstack`** | `pstack`'s dedicated `perf-issue.md` and `hillclimb.md` playbooks provide structured profiling, bottleneck isolation, and progressive optimization loops. |
| **Distributed Multi-Agent Engineering Team** | **`ajstack-sdd`** | Linear ticket gating (`spec:ready`), worktree quarantine (`.worktrees/`), and the < 400 LOC diff limit prevent agents from stepping on each other's code. |
| **Exploratory Algorithmic Tournament** | **`pstack`** | `/arena` enables parallel worktree competitions evaluated by independent judge models to determine the optimal algorithmic approach. |
| **Client Deliverables with Visual Sign-off** | **`ajstack-sdd`** | `/evidence-driven-testing` (annotated video evidence) and `/before-and-after` (visual diff markdown tables) provide irrefutable client proof of delivery. |
| **Rapid Solo Bug-Fixing in Cursor** | **`pstack`** | `/poteto-mode bug-fix` provides fast, low-overhead in-chat resolution without requiring ticket creation. |

---

## 5. Actionable Recommendations for Cross-Stack Evolution

### 5.1 Concrete Adoptions for `ajstack-sdd` (Learning from `pstack`)

To reach the next tier of autonomous engineering excellence, `ajstack-sdd` should adopt five core concepts pioneered by `pstack`:

#### 1. Implement Local In-Session Adversarial Review (`/interrogate`)
- **Current Limitation in `ajstack-sdd`**: Code review relies on `/greploop`, which requires pushing a PR to GitHub/GitLab and polling an external third-party bot (Greptile).
- **Adoption**: Add a native `/interrogate` skill to `ajstack-sdd` that runs an adversarial diff review directly inside the local worktree prior to pushing. Require the adversarial agent to supply an executable failing test or reproduction script for every flagged issue.
- **Benefit**: Catches regressions immediately, saves CI build cycles, and hardens code before opening public pull requests.

#### 2. Adopt Subtractive Principles and Automated Comment Stripping (`/no-comments`)
- **Current Limitation in `ajstack-sdd`**: While `/code-structure` governs module boundaries, agents frequently generate conversational comments, obvious docstrings, and defensive helper sprawl.
- **Adoption**: Incorporate `pstack`'s `comment-sicko` heuristic into `ajstack-sdd` as an automated post-implementation pass (`/no-comments`), and embed `principle-subtract-before-you-add` into `code-structure`.
- **Benefit**: Keeps PR diffs well within the `< 400 lines` threshold and improves long-term codebase maintainability.

#### 3. Introduce Multi-Model Tiering & Reasoning Budget Allocation (`/setup-models`)
- **Current Limitation in `ajstack-sdd`**: All lifecycle phases execute under whichever model is active in the host environment, leading to either under-powered planning or over-priced code generation.
- **Adoption**: Build a `/setup-models` CLI command inspired by `setup-pstack` that configures model allocations per phase:
  - *Phase 0 & Phase 1*: High-reasoning frontier models (e.g., Claude 3.7 Thinking, o3-mini) for architecture discovery and issue slicing.
  - *Phase 2 Execution*: High-speed, cost-effective models (e.g., Sonnet standard) for writing code in worktrees.
  - *Interrogation*: Heterogeneous model panels for adversarial critique.
- **Benefit**: Optimizes token expenditure and improves architectural quality.

#### 4. Add Parallel Worktree Tournaments (`/arena`)
- **Current Limitation in `ajstack-sdd`**: Execution is linear—one agent works on one branch in one worktree.
- **Adoption**: Introduce an `/arena` skill leveraging `ajstack-sdd`'s existing `.worktrees/` infrastructure to spawn two competing implementations for complex tasks, judged by an automated evaluator script.
- **Benefit**: Allows exploring alternative architectures and selecting the cleanest implementation.

#### 5. Introduce a Structured Session Resumption Skill (`/session-pickup`)
- **Current Limitation in `ajstack-sdd`**: If an agent session is terminated mid-task, resuming requires the human to manually direct the agent back to the active worktree and Linear ticket.
- **Adoption**: Add a `/session-pickup` skill that inspects `docs/`, checks active `.worktrees/`, queries Linear for in-flight `spec:ready` issues, and inspects recent git commits to automatically reconstruct context.
- **Benefit**: Seamless recovery from context truncation or multi-day development pauses.

---

### 5.2 Concrete Adoptions for `pstack` (Learning from `ajstack-sdd`)

Conversely, Cursor `pstack` would gain tremendous institutional robustness by adopting five architectural practices from `ajstack-sdd`:

#### 1. Adopt Canonical Docs-as-Code System Architecture (`docs/` + ADRs)
- **Current Limitation in `pstack`**: Architectural knowledge lives in the ephemeral chat session or static `.cursor/rules/` files. When a project grows, new agents have no standardized repository specification to consult.
- **Adoption**: Adopt `ajstack-sdd`'s 5 canonical architecture documents (`docs/PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`) and Michael Nygard-format ADRs (`docs/adr/`).
- **Benefit**: Provides `pstack` agents with persistent, version-controlled institutional memory that survives session resets.

#### 2. Implement Deterministic Code-to-Spec Drift Detection
- **Current Limitation in `pstack`**: When planning features or refactors, agents rely on conversational prompts and interactive queries (`/how`, `/why`), which can miss uncommitted changes or outdated assumptions.
- **Adoption**: Introduce a deterministic drift-checking script before `/poteto-mode` launches playbooks, running shell/grep checks against schemas, routes, and package configs.
- **Benefit**: Prevents agents from hallucinating dependencies or building on stale architecture.

#### 3. Introduce Universal Issue-Tracker Parity & the `< 400 Lines` Sizing Rule
- **Current Limitation in `pstack`**: Tasks are tracked in conversational todo lists inside the chat, which are invisible to the broader engineering team and project managers.
- **Adoption**: Integrate Linear MCP and GitHub Issues support, enforcing the universal `spec:ready` gate and the `< 400 lines of diff` PR sizing constraint across `pstack` playbooks.
- **Benefit**: Bridges in-IDE coding with organizational project management and ensures pull requests remain small and reviewable.

#### 4. Incorporate Empirical Runtime Verification Tooling (`evidence.py`)
- **Current Limitation in `pstack`**: `pstack` enforces `principle-prove-it-works` as a philosophical standard, but provides no built-in screen capture, video annotation, or headless browser test harness.
- **Adoption**: Incorporate `ajstack-sdd`'s cross-platform screen recorder (`evidence.py`) and isolated Playwright runner (`run-playwright.sh`) directly into `pstack`'s verification playbooks.
- **Benefit**: Empowers `pstack` agents to generate video artifacts with subtitle burn-in and visual diff tables for PR verification.

#### 5. Standardize Compute-Aware Worktree Quarantine (`.worktrees/`)
- **Current Limitation in `pstack`**: Worktrees are used dynamically in `/arena` but lack standardized quarantine rules for shared developer machines.
- **Adoption**: Standardize all worktree creation inside a gitignored `.worktrees/` directory, symlinking `node_modules` and enforcing port checks (`lsof -i :<port>`) before starting development servers.
- **Benefit**: Eliminates disk bloat and port collision hazards on local developer workstations.

---

### 5.3 The Unified Autonomous Engineering Blueprint

Synthesizing the core strengths of both frameworks yields the **Unified Autonomous Engineering Lifecycle**—a blueprint representing the state of the art in agentic software development:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                           UNIFIED AUTONOMOUS ENGINEERING BLUEPRINT                           │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. SYSTEM DISCOVERY & INSTITUTIONAL MEMORY (from ajstack-sdd Phase 0)                        │
│    • Greenfield Delta Interview or Brownfield 8-Step Deterministic Scan                      │
│    • Canonical Version-Controlled Assets: docs/ (PRD, ARCHITECTURE, DATA_MODEL, API, FLOWS)  │
│    • Immutable Architecture Decision Records: docs/adr/ (0001-*, 0002-*, etc.)               │
│                                           │                                                  │
│ 2. MODEL ALLOCATION & REASONING BUDGETS (from pstack /setup-pstack)                          │
│    • Orchestration / Planning: Frontier Reasoning Tier (Claude 3.7 Thinking, o3-mini)        │
│    • Coding Delegation: High-Speed Tier (Sonnet standard, GPT-4o)                            │
│    • Adversarial Review: Heterogeneous multi-model panel                                     │
│                                           │                                                  │
│ 3. DETERMINISTIC DRIFT CHECK & TASK SLICING (from ajstack-sdd Phase 1)                       │
│    • Shell/Grep Drift Detection: Verify code matches docs/ before ticket creation            │
│    • Sizing Invariant: Strictly < 400 lines of diff per PR (1-2 days scope)                  │
│    • Structured Templates: Feature, Refactor, Bug, Debt with Given/When/Then AC              │
│    • Universal Tracker Gate: Linear / GitHub Issues label parity (`spec:ready`)              │
│                                           │                                                  │
│ 4. ISOLATED COMPUTE-AWARE EXECUTION (from ajstack-sdd Phase 2 + pstack Playbooks)           │
│    • Dedicated Git Worktrees in .worktrees/<task-name> with symlinked node_modules           │
│    • Task-Specific Playbook Execution: bug-fix, perf-issue, refactoring, feature             │
│    • Subtractive Engineering Principles: subtract-before-add, laziness-protocol             │
│    • Clean Service Layer Boundaries: Actions (Policy) vs. Services (Mechanics)               │
│                                           │                                                  │
│ 5. PRE-COMMIT ADVERSARIAL HARDENING (from pstack /interrogate & comment-sicko)               │
│    • In-Session Adversarial Review: Reviewers must supply executable failing tests           │
│    • Comment & Slop Eradication: Strip low-value comments, banners, and conversational text  │
│                                           │                                                  │
│ 6. EMPIRICAL RUNTIME VERIFICATION (from ajstack-sdd evidence.py & before-and-after)          │
│    • Annotated Screen Recording: MPEG-TS video capture with Jest-style subtitle burn-in      │
│    • Headless Playwright Probes: Isolated test execution in temporary environments           │
│    • Visual Diff Tables: Before/After screenshots uploaded and formatted in markdown        │
│                                           │                                                  │
│ 7. PRODUCTION REVIEW & SHIPPING (from ajstack-sdd greploop + unslop)                         │
│    • Prose De-slopping: Strip AI tells, em dashes, and fluff from commit and PR text         │
│    • Bounded Review Loop: Greptile automated bot review driving PR to verified 5/5 score     │
│    • Safe Landing: Merge to main and prune worktrees via worktree-cleanup                    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Verification Method & References

### 6.1 Independent Verification Commands

To independently audit, reproduce, and verify the technical findings and codebase citations in this report, execute the following commands in your local workspace:

#### 1. Audit `ajstack-sdd` Package Manifest & CLI Tools
```bash
# Verify package identity, version, and exported binaries
cat /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/package.json | grep -E '"name"|"version"|"main"|"bin"'

# Enumerate all 9 packaged skills, phases, and descriptions
node /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/bin/cli.js list

# Verify CLI installation paths (.claude/skills and .agents/skills)
grep -n -C 5 "mkdirSync" /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/bin/cli.js
```

#### 2. Verify `ajstack-sdd` Python Test Suites
```bash
# Run exhaustive unit/integration tests for the 1,359-line screen recorder (evidence.py)
pytest /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/tests/test_evidence.py

# Run unit tests for Greptile review parsing and commit SHA verification
pytest /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/tests/test_github_review.py
```

#### 3. Audit Governing Rules & Lifecycle Invariants
```bash
# Verify 3-phase SDD lifecycle, gating invariants, and worktree rules
head -n 60 /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/AGENTS.md

# Verify upstream attribution to pstack in unslop and README
grep -n -C 3 "pstack" /home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd/README.md
```

#### 4. Audit Cursor `pstack` Upstream Source
```bash
# Inspect pstack manifest in official Cursor plugins monorepo
curl -sL https://raw.githubusercontent.com/cursor/plugins/main/pstack/.cursor-plugin/plugin.json

# Inspect pstack's 23 playbooks catalog
curl -sL https://api.github.com/repos/cursor/plugins/contents/pstack/skills/poteto-mode/playbooks | grep '"name"'
```

---

### 6.2 Primary Source References & Version Tags

1. **`ajstack-sdd` Repository**:
   - Location: `/home/ajay-hypermiles/Documents/AJ/freelance/ajstack-sdd`
   - Upstream Git URL: `https://github.com/ajayjeripothula18/ajstack-sdd.git`
   - Package Version: `1.0.0`
   - Author: Ajay Jeripothula
   - Core Foundation: Built on `@michaelshimeles/rstack` (`https://github.com/michaelshimeles/rstack`).
2. **Cursor `pstack` Plugin**:
   - Monorepo Location: `https://github.com/cursor/plugins/tree/main/pstack`
   - Manifest: `pstack/.cursor-plugin/plugin.json`
   - Marketplace Identifier: `pstack` (v0.15.36+)
   - Author: Lauren Tan (`@poteto`), software engineer at Cursor.
3. **Upstream Subsystems & Components**:
   - `before-and-after`: Vercel Labs (`https://github.com/vercel-labs/before-and-after`).
   - `greploop`: Greptile AI Skills (`https://github.com/greptileai/skills`).
   - `unslop`: Cursor `pstack` (`https://github.com/cursor/plugins/tree/main/pstack/skills/unslop`).
   - `Playwright`: Version 1.63.0 pinned in `evidence-driven-testing/scripts/playwright/package.json`.
4. **Internal Investigation Records**:
   - `.agents/teamwork/explorer_survey_1/handoff.md`: Codebase & architecture survey of `ajstack-sdd`.
   - `.agents/teamwork/explorer_survey_2/handoff.md`: Exhaustive survey of Cursor `pstack`.
   - `.agents/teamwork/explorer_survey_3/handoff.md`: Comparative synthesis, mapping, and tradeoff evaluation.
