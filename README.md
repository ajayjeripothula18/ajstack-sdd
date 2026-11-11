# ajstack-sdd

> **AJ's Linear-Backed Spec-Driven Development + rstack**  
> An enhanced execution engine adding structured discovery, drift detection, and issue slicing to [@michaelshimeles/rstack](https://github.com/michaelshimeles/rstack).

---

## Quickstart (Zero-Setup CLI)

Bootstrap `ajstack-sdd` into any project with one command:

```bash
# In your project root:
npx github:ajayjeripothula18/ajstack-sdd init
```
This automatically:
- Installs all 12 skills into `.claude/skills/` (callable via `/` in Claude Code)
- Installs all 12 skills into `.agents/skills/` (for Antigravity, Cursor, and Codex)
- Copies `AGENTS.md` and links `CLAUDE.md`
- Appends `.worktrees/` to `.gitignore`

### Global Installation (For All Projects)
To make `/project-init`, `/linear-slice`, `/new-feature`, etc. accessible across **all** your projects on your machine without running per-project installs:
```bash
npx github:ajayjeripothula18/ajstack-sdd --global
```

---

## Why ajstack-sdd?

`rstack` provides an exceptional Git-Ops execution pipeline: isolated worktrees (`/new-feature`), service boundaries (`/code-structure`), visual evidence (`/evidence-driven-testing`, `/before-and-after`), and automated code reviews (`/greploop`).

However, for developers building products from scratch (0-to-1) or working on complex brownfield codebases, starting at `/new-feature` skips the architectural foundation. 

`ajstack-sdd` bridges this gap **without introducing markdown state clutter**:
1. **Zero-bloat system design**: Creates and maintains 5 canonical industry-standard architecture docs in `docs/` (`PRD.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`, `USER_FLOWS.md`, plus `adr/`).
2. **Deterministic drift detection**: Ensures code and architectural specifications stay in sync before new tasks are sliced.
3. **Linear & GitHub parity**: Slices tasks into 4 concrete issue types (`Feature`, `Refactor`, `Bug`, `Debt`) using free-tier-compatible native labels (`spec:ready`, `type:*`).
4. **Complete execution safety**: Enforces that coding agents never begin work on an issue until the acceptance criteria are codified under `spec:ready`.
5. **Compute-Aware Worktree Isolation**: Enforces dedicated `.worktrees/` isolation on shared host machines to prevent workspace pollution and port collisions, while seamlessly supporting cloud agent sandboxes (Cursor Cloud, Orgo, Codespaces).

---

## The 3-Phase Lifecycle

```
PHASE 0: INITIATE                     PHASE 1: SLICE                       PHASE 2: EXECUTION
(Greenfield / Pivot)                  (Continuous / Mid-Dev)               (Hybrid SDD Engine)
┌───────────────────────┐             ┌─────────────────────────┐          ┌───────────────────────────┐
│ /project-init         │             │ /linear-slice           │          │ /sdd-flow (Orchestrator)  │
│ • Delta interview     │ ──docs/──►  │ • Deterministic drift   │ ──issue─►│ 1. /forensics (Root-cause)│
│ • Brownfield scan     │             │ • 4 issue templates     │          │ 2. /new-feature (Worktree)│
│ • 5 Canonical docs    │             │ • Linear/GitHub labels  │          │ 3. /code-structure (Build)│
│ • adr/ continuity     │             │ • < 400 lines PR sizing │          │ 4. /evidence-driven (Prove│
└───────────────────────┘             └─────────────────────────┘          │ 5. /interrogate (Pre-comm)│
                                                                           │ 6. /unslop & /greploop    │
                                                                           └───────────────────────────┘
```

---

## Skills Suite (12 Skills)

| Skill | Role | Purpose |
|---|---|---|
| [`project-init`](project-init/SKILL.md) | Phase 0 | Greenfield discovery interview + Brownfield code reverse-engineering into canonical `docs/`. |
| [`linear-slice`](linear-slice/SKILL.md) | Phase 1 | Fast grep drift detection, 4 issue templates (`Feature`, `Refactor`, `Bug`, `Debt`), and label-gated issue creation. |
| [`sdd-flow`](sdd-flow/SKILL.md) | Phase 2 | Hybrid orchestrator chaining Investigate -> Isolate -> Build -> Prove -> Interrogate -> Ship. |
| [`forensics`](forensics/SKILL.md) | Phase 2 | Root-cause diagnosis, plan evaluation, schema checks, commit archaeology, and PR bot review auditing. |
| [`new-feature`](new-feature/SKILL.md) | Phase 2 | Dedicated Git worktree and branch isolation per issue. Never build on `main`. |
| [`code-structure`](code-structure/SKILL.md) | Phase 2 | Service layer architecture: Actions orchestrate business rules; Services implement reusable mechanics. |
| [`evidence-driven-testing`](evidence-driven-testing/SKILL.md) | Phase 2 | Annotated screen recordings and headless Playwright probes proving acceptance criteria. |
| [`before-and-after`](before-and-after/SKILL.md) | Phase 2 | Visual diff comparisons formatted into PR-ready markdown tables. |
| [`interrogate`](interrogate/SKILL.md) | Phase 2 | Pre-commit adversarial diff audit for async crashes, OCC races, secrets, and repro tests. |
| [`greploop`](greploop/SKILL.md) | Phase 2 | Automated Greptile review and fix cycles targeting a clean 5/5 score. |
| [`greploop-apps`](greploop-apps/SKILL.md) | Phase 2 | Compatibility trigger (`@greptile-apps`) for large pull requests. |
| [`unslop`](unslop/SKILL.md) | Cross-cutting | Cuts AI tells, buzzwords, and boilerplate from commit messages, PR text, and docs. |

---

## The 5 Canonical Docs (`docs/`)

`ajstack-sdd` strictly adheres to Docs-as-Code standards. No temporary state files (`STATE.md`, `TODO.md`) enter your repository:

```
docs/
├── PRD.md              # Vision, personas, user stories, out-of-scope boundaries
├── ARCHITECTURE.md     # Stack, component boundaries, state mgmt, a11y & responsive rules
├── DATA_MODEL.md       # Domain entities, schemas, relationships, storage contracts
├── API.md              # Route definitions, request/response contracts, external services
├── USER_FLOWS.md       # Mermaid flowcharts, screen states, navigation transitions
└── adr/
    ├── 0001-record-architecture-decisions.md  # Standard meta-ADR
    ├── 0002-tech-stack.md                     # Initial stack selection & rationale
    └── template.md                            # Template for future ADRs
```

---

## Installation

### Manual Installation

#### For Claude Code
```bash
git clone https://github.com/ajayjeripothula18/ajstack-sdd.git
mkdir -p ~/.claude/skills/
cp -r ajstack-sdd/{project-init,linear-slice,sdd-flow,forensics,new-feature,code-structure,evidence-driven-testing,before-and-after,interrogate,greploop,greploop-apps,unslop} ~/.claude/skills/
```
In your project root, copy `AGENTS.md` and add a `CLAUDE.md` referencing it:
```bash
cp ajstack-sdd/AGENTS.md /path/to/your/project/
echo "@AGENTS.md" > /path/to/your/project/CLAUDE.md
```

#### For Antigravity / Cursor / Codex
In your project repository:
```bash
mkdir -p .agents/skills/
cp -r ajstack-sdd/{project-init,linear-slice,sdd-flow,forensics,new-feature,code-structure,evidence-driven-testing,before-and-after,interrogate,greploop,greploop-apps,unslop} .agents/skills/
cp ajstack-sdd/AGENTS.md .
```

---

## Credits & Upstream

- Built upon [@michaelshimeles/rstack](https://github.com/michaelshimeles/rstack).
- Integrates `before-and-after` from [vercel-labs/before-and-after](https://github.com/vercel-labs/before-and-after).
- Integrates `greploop` from [greptileai/skills](https://github.com/greptileai/skills).
- Integrates `unslop` from [cursor/plugins (pstack)](https://github.com/cursor/plugins/tree/main/pstack/skills/unslop).
