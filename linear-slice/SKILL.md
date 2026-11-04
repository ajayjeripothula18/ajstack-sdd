---
name: linear-slice
description: Slices product requirements or feature ideas into bite-sized, testable issues for Linear or GitHub Issues. Runs deterministic drift detection against docs/ and applies dedicated templates for Feature, Refactor, Bug, and Debt.
---

# Linear Slice

Transform requirements from `docs/` (or a mid-development task request) into Shippable Linear Issues.

## Process

### 1. Prerequisites Check
1. Verify that `docs/PRD.md` and `docs/ARCHITECTURE.md` exist. If missing, prompt the developer to run `/project-init` first.
2. Determine backend:
   - **Linear (Default)**: If Linear MCP / API credentials are configured.
   - **GitHub Issues (Fallback)**: If Linear is not configured but GitHub CLI (`gh`) / token exists.

---

### 2. Deterministic Drift Detection (Fast, Grep/Package-Based)
Before generating or updating tickets, verify that `docs/` reflects the active code. Run deterministic shell commands instead of slow LLM diffs:

| Check | Target in `docs/` | Deterministic Verification Command |
|---|---|---|
| **Dependencies** | `ARCHITECTURE.md` stack declaration | Read `package.json` dependencies block directly |
| **State Management** | Declared store (e.g. Zustand, Context) | `grep -rn "createStore\|zustand\|createContext" src/ --include="*.ts" --include="*.tsx"` |
| **Database / ORM** | `DATA_MODEL.md` schema | Test file existence: `test -f prisma/schema.prisma` or `ls drizzle/**/*.ts` |
| **API Endpoints** | `API.md` routes | Check directories: `ls src/routes/` or `ls src/app/api/` |
| **Styling** | `ARCHITECTURE.md` styling | Check config: `test -f tailwind.config.*` or grep CSS module imports |

**If Drift is Detected:**
Halt ticket generation and present the discrepancy:
> *"Drift detected: `docs/ARCHITECTURE.md` specifies Zustand, but `src/services/` imports TanStack Query.*
> *Should I update `docs/ARCHITECTURE.md` to match the code reality before slicing this ticket? (y/n)"*

Sync the doc immediately upon confirmation.

---

### 3. Sizing Rule: One Shippable PR
Every Linear issue must represent **one shippable pull request**:
- Diff limit: Target **< 400 lines of diff**.
- Scope limit: 1–2 days of development work.
- If a feature crosses multiple domain modules or unrelated UI routes, split it into sequential sub-issues.

---

### 4. Issue Type Selection & Templates
Ask the developer to classify the task into one of 4 types:

```
[1] Feature  — New user-facing capability or API endpoint
[2] Refactor — Internal code restructuring with ZERO behavior change
[3] Bug      — Regression, defect, or unexpected runtime failure
[4] Debt     — Dependency upgrade, tooling migration, or performance optimization
```

Apply the corresponding template:

#### Template A: Feature
```markdown
### Context & Objective
[1-2 sentences explaining what this feature does and why it is needed.]

### System Touchpoints
- **Creates**: `src/actions/createEnquiry.ts`, `src/components/EnquiryModal.tsx`
- **Modifies**: `src/services/enquiryService.ts`
- **Architecture Pattern**: Service Layer (`code-structure`)

### Acceptance Criteria (Given / When / Then)
- [ ] Given [precondition], When [action], Then [expected outcome].
- [ ] Given [invalid input], When [submitted], Then [proper validation error displayed].
- [ ] Runtime proof: Playwright/evidence recorder verifies positive flow.

### Out of Scope
- [Explicit boundary of what this issue will NOT handle to prevent scope creep.]

### Dependencies
- Depends on: [Linear issue key or GitHub issue #, e.g. #42]
- Blocks: [Subsequent issue #, e.g. #43]
```

#### Template B: Refactor
```markdown
### Context & Objective
[What internal architecture is being improved and why.]

### Invariants to Preserve (Must NOT Change)
- [ ] Public API contracts and signatures remain identical
- [ ] Database schema and storage contracts remain unchanged
- [ ] All existing test suites pass without modification

### Files Affected
- `src/services/auth.ts` → refactored into modular handlers
- `src/actions/login.ts` (consumer)

### Migration Steps
1. Add new internal service alongside old implementation.
2. Redirect callers sequentially.
3. Remove deprecated implementation once verified.

### Rollback Plan
[Exact git revert or flag toggle steps if regressions are discovered in staging.]

### Dependencies
- Depends on: #XX
- Blocks: #YY
```

#### Template C: Bug
```markdown
### Reproduction Steps
1. Navigate to `/projects/123`.
2. Click "Submit Enquiry" with empty email field.
3. Observe crash or unhandled error state.
- **Environment**: [Browser, Node version, OS]

### Expected vs. Actual
- **Expected**: Inline validation error appears: "Email is required".
- **Actual**: Page shows unhandled 500 error boundary.

### Root Cause Hypothesis
[Hypothesis based on quick code inspection, e.g. missing Zod validation in handler.]

### Acceptance Criteria
- [ ] Failing test case added reproducing the defect.
- [ ] Fix applied in service/action layer.
- [ ] Regression test passes cleanly.
- [ ] Zero console errors during visual reproduction.
```

#### Template D: Debt / Upgrade
```markdown
### From → To
- Upgrade `@tanstack/react-query` v4 → v5
- Update breaking query options syntax across all services

### Migration Steps
1. Install new dependency version.
2. Run codemod or update query call sites in `src/services/`.
3. Verify dev server build and bundle output.

### Rollback Plan
Revert `package.json` and lockfile; restore previous service imports.

### Acceptance Criteria
- [ ] Application builds with zero TypeScript compiler errors.
- [ ] Existing automated tests and Playwright smoke checks pass.
- [ ] Performance baseline: Bundle size and LCP show zero regression.
```

---

### 5. Issue Creation & Universal Label Parity

Create the issue in the target system using native labels (compatible with all free and paid workspace tiers):

| Target | Labels Applied | Initial State | Dependency Syntax |
|---|---|---|---|
| **Linear** | `spec:ready` + `type:feature` \| `type:bug` \| `type:refactor` \| `type:debt` | `Todo` (Native state) | Native Linear relations or issue links |
| **GitHub Issues** | `spec:ready` + `type:feature` \| `type:bug` \| `type:refactor` \| `type:debt` | `open` | In body text: `Depends on: #42` / `Blocks: #43` |

Output the created issue key(s) (e.g. `ADS-24` or `#42`) directly to the developer.

---

### 6. Fallback & Offline Error Handling
If neither Linear MCP nor GitHub CLI is available or API calls fail:
1. Stage the formatted issue to `.artifacts/staged-issues/issue-$(date +%Y%m%d%H%M%S).md`.
2. Present the full markdown directly in the conversation.
3. Instruct the developer to create the issue manually in their tracker and apply the `spec:ready` label before initiating `/new-feature`.

---

### 7. Workflow Gate Rule (Codified for Agents)
Coding agents (Claude Code, Antigravity, Cursor) must **never** begin work on an issue unless it has the label **`spec:ready`**. If a developer asks to build an issue lacking this label, the agent must reply:
> *"This issue does not have the `spec:ready` label. Please run `/linear-slice` to define acceptance criteria and touchpoints first."*
