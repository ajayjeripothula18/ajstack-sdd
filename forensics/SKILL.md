---
name: forensics
description: Deep root-cause diagnosis, telemetry analysis, plan evaluation, and PR bot review auditing. Read-only diagnostic skill to attack premises, verify schema invariants, inspect git history, and distill plans before touching code. Use when analyzing bugs, reviewing remediation plans, or auditing PR bot feedback.
---

# Forensics (Root-Cause, Telemetry & Plan Auditing)

## Overview

`/forensics` enforces the principle: **"If you want to go fast, go deep first."**

When faced with a bug, regression, performance cliff, or a sprawling remediation plan from an external review, the worst failure mode of an AI agent is speculative trial-and-error editing or rubber-stamping flawed assumptions. `/forensics` guarantees that causality and architectural invariants are proven before a single line of production code is modified.

---

## The 5 Cardinal Rules of Forensics

1. **Read-Only Invariant**: Do not edit production code or configuration files during a forensics run. Any reproduction scripts written must live in temporary scratch locations (`.artifacts/scratch/repro.*`).
2. **Attack the Premise**: Do not assume the reported issue or proposed plan is accurate. Verify:
   - Does the issue actually occur in the current commit?
   - Is the plan drafted against an older commit whose findings are already resolved?
   - Is the caller invoking the API against the documented contract?
   - Is this an intentional design constraint or documented limitation?
3. **Trace Causality to the Root**: Do not treat symptoms with defensive null checks or `try/catch` patches. Follow the call stack backward until you locate the exact origin of invalid state.
4. **Mandate an Isolated Reproduction**: An investigation is not finished until you have an automated script or test that reliably triggers the failure (**"No Reproducible Test, No Finding"**).
5. **Schema & Contract Invariant Enforcement**: Cross-reference every proposed schema change, mutation argument, or enum against canonical schema files. Reject any proposal that violates schema unions, breaks transactional atomicity, or arbitrarily renames public APIs.

---

## Delegation Routing Engine & Anti-Bias Protocol

For every complex inquiry, proposed remediation plan, or multi-faceted bug report, the orchestrator evaluates this routing matrix:

### Decision Matrix: Routine Selection

| Routine | Trigger Criteria | Action |
|---|---|---|
| **Solo Routine** | Simple single-file documentation edits, direct questions, or localized reproducible bugs. | Execute directly in the current session. |
| **Delegated Routine** | Multi-file investigations, auditing implementation plans, reviewing PR bot feedback (Greptile, CodeRabbit), or subtle race conditions. | Delegate to an isolated subagent (`DeepInvestigator`). |

### Cross-Platform Subagent Invocation

- **Antigravity**: Launch via `invoke_subagent`:
  ```python
  invoke_subagent(
      TypeName="self",
      Role="DeepInvestigator",
      Workspace="inherit",
      Prompt="<Verbatim task prompt + objective constraints>"
  )
  ```
- **Claude Code**: Invoke `/boost` or dispatch to a background subagent task.
- **CLI / Cursor / Codex**: Dispatch to a dedicated child agent or sub-task prompt.

### The 4 Anti-Bias Rules

1. **No Pre-Work**: The parent orchestrator **must not** perform independent exploration, web searches, or speculative code diffs prior to spawning the subagent. This preserves token context and prevents premature cognitive bias.
2. **High-Fidelity Prompt Forwarding**:
   - The user's original task is passed verbatim.
   - Additional context is strictly limited to objective facts: active repository/worktree path, PR number/URL, latest commit SHAs, relevant bot review threads, and canonical schema files.
3. **Independent Critical Verification**: When the subagent completes its investigation, the parent orchestrator does not passively accept the summary. It must critically inspect reproduction outputs, verify schema conformance, and spot-check the reasoning.
4. **Iterative Convergence**: If open questions or edge cases remain, send follow-up instructions to the **same** subagent instance via `send_message`. Never spawn duplicate subagents for the same continuous investigation.

---

## Investigation Playbooks

### Playbook A: Bug & Regression Diagnostics

1. **Telemetry & Stack Trace Inspection**:
   - Collect exact error messages, status codes, and call stacks.
   - Dump verbose server logs to `.artifacts/scratch/forensics-trace.log` to protect chat context.
2. **Historical Provenance (Git Archaeology)**:
   - Inspect recent changes to affected files:
     ```bash
     git log -p -n 5 -- <affected-file>
     ```
   - Search when a specific symbol or string was introduced:
     ```bash
     git log -S "<symbol-or-string>" --oneline
     ```
   - Use `git bisect` if the regression point across commits is unknown.
3. **Minimal Isolated Reproduction**:
   - Write a standalone test or reproduction script that isolates the faulty behavior from external dependencies.
   - Verify that it fails reliably (exit code != 0 or assertion failure).

---

### Playbook B: Plan & PR Bot Review Auditing

When evaluating an implementation plan or addressing bot review comments (Greptile, CodeRabbit):

1. **Commit Archaeology & Stale Plan Detection**:
   - Never audit a plan in a vacuum. Check recent commit history and PR review activity:
     ```bash
     git log -n 5 --oneline
     gh pr view <pr> --json reviews,comments,latestReviews
     ```
   - **Detect Stale Plans**: Determine if the plan was drafted against an older commit (e.g. initial PR revision) and whether subsequent commits have already resolved the majority of findings. Do not re-fix already resolved issues.
   - **Detect Draft Regressions**: Inspect uncommitted worktree diffs (`git diff`) to verify whether draft edits have introduced typos, schema property misnomers, or linting errors.

2. **Schema & Model Invariant Enforcement (Universal Contracts)**:
   Cross-reference every proposed database change, write payload, and model contract against the project's canonical schema definitions:
   - **Enum & Type Union Conformance**: Verify that proposed values actually exist in the schema's allowed enum or literal union. Reject proposals inserting undeclared literals that trigger runtime validation exceptions.
   - **Transactional & State Atomicity**: Favor atomic database transactions and state updates over asynchronous multi-step reservations that risk orphaned resources, dangling locks, or quota leaks if an intermediate action fails.
   - **API & Signature Contract Stability**: Reject arbitrary renaming of exported functions, public endpoints, queries, or mutations if downstream clients, MCP tools, tests, or callers depend on existing signatures. Deprecate safely rather than breaking callers.
   - **Telemetry Preservation**: Never delete log records on failure; transition them to a terminal failure state with structured error messages to preserve operational audit trails.

3. **Subtractive Blueprint**:
   - Distill sprawling 10+ step plans down to surgical, minimal lines of code (target < 50–100 LOC across 2–3 files).
   - Require explicit drop-in snippets for each affected file.

---

## Forensics Reporting Formats

### Format 1: Bug Forensics Report (For Defects & Regressions)

```markdown
### Forensics Investigation: [ISSUE-KEY] <Summary>

#### 1. Premise Verification
- **Reported Symptom**: ...
- **Actual Runtime Reality**: [CONFIRMED DEFECT | INVALID PREMISE | SPEC MISALIGNMENT]
- **Verification Details**: ...

#### 2. Root Cause Analysis
- **Defective Location**: `src/path/to/file.ts#L42-L55`
- **Failure Mechanism**: Why the failure occurs under specific inputs or concurrency conditions.
- **Historical Origin**: Introduced in commit `abc1234` ("feat: ...").

#### 3. Reproduction Proof
- **Script/Test**: `.artifacts/scratch/repro_test.py` (or `test/repro.spec.ts`)
- **Result**: Fails with `Expected 200 OK, got 500 Internal Error (DivisionByZeroError)`.

#### 4. Subtractive Solution Blueprint
- What can be simplified or deleted to fix this at the source rather than patching symptoms.
```

---

### Format 2: Plan & PR Review Audit Report (For Plans & Bot Reviews)

```markdown
# Forensics & Audit Report: <Topic / PR #>

**Target**: <PR URL, Branch, or Feature Key>
**Worktree**: <Path to worktree>
**Status**: [APPROVED | PLAN REJECTED & REFINED | BLOCKED]

---

## 1. Executive Verdict & Summary
- High-level decision and core architectural rationale.
- Critical flaws caught (stale assumptions, schema validator violations, breaking API renames).

---

## 2. Forensics Audit: Commit Archaeology & Status Matrix
- Commit progression and review history analysis.
- Status matrix mapping each finding to its actual codebase state:

| # | Finding | Proposed Plan | Actual State in Codebase | Action Required? |
|---|---|---|---|---|
| 1 | ... | ... | Already resolved in commit `abc1234` | No (Skip) |
| 2 | ... | ... | Unhandled error boundary | Yes |

---

## 3. Invariant Violations Caught
- **Schema Violations**: Undeclared enum literals or missing schema properties.
- **API Stability**: Breaking renames or contract changes.
- **Async Safety**: Orphaned states or missing catch boundaries.

---

## 4. Empirical Verification Proof
- Reproduction test cases executed and their pass/fail results.

---

## 5. Refined Implementation Plan (Actionable Subtractive Blueprint)
- Surgical, file-by-file code changes (< 50 LOC).
- Explicit drop-in snippets.

---

## 6. Verification & Sign-Off Criteria
- [ ] Automated unit tests pass
- [ ] Type check returns 0 errors
- [ ] Linter returns 0 warnings
```
