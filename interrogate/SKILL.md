---
name: interrogate
description: In-session adversarial pre-flight review. Audits git diff in the worktree before pushing or opening a PR, requiring executable failing reproduction tests for any flagged issue. Use prior to git push and greploop.
---

# Interrogate (Pre-Flight Adversarial Review)

## Overview

`/interrogate` is an internal adversarial peer review run directly inside your Git worktree **before pushing to remote or opening a PR**. 

Leaving code review entirely to external CI bots like Greptile is slow, wasteful, and burns CI minutes. `/interrogate` catches bugs, concurrency races, unhandled async crashes, secret leaks, and schema flaws locally within seconds.

---

## The Skeptical Reviewer Invariant

When running `/interrogate`, adopt the persona of a **Skeptical Staff Engineer** whose sole objective is to break the proposed changes.

> [!IMPORTANT]
> **The Hard Invariant: No Reproducible Test, No Finding.**
> Subjective stylistic opinions, bikeshedding, and vague warnings ("this might fail under load") are strictly disallowed.
> Every flagged issue **MUST** include an executable failing test case (`*.spec.ts`, `test_*.py`) or a concrete shell reproduction script proving the defect. If you cannot write a reproduction, the finding is invalid.

---

## Subagent Delegation for Large Diffs

When reviewing diffs exceeding 200 lines of code, or changes modifying critical authorization, concurrency, or payment paths, delegate the adversarial audit to an isolated subagent:
- **Antigravity**: Launch via `invoke_subagent`:
  ```python
  invoke_subagent(
      TypeName="self",
      Role="DeepInvestigator",
      Workspace="inherit",
      Prompt="Run adversarial diff audit against git diff origin/main. Enforce: No Reproducible Test, No Finding."
  )
  ```
- **Claude Code**: Dispatch via `/boost` or subagent review task.
- **CLI / Cursor / Codex**: Dispatch to a dedicated child agent or audit prompt.

---

## The 6 Critical Audit Vectors

Examine the uncommitted or worktree diff against the base branch **prior to running `git commit` or `git push`**:
```bash
git diff HEAD # or git diff origin/main
```

### 1. Async Crash Boundaries & Resource Leaks
- Do external service calls, HTTP actions, or network dispatches have unhandled promise rejections?
- If an external call fails, does the system leave orphaned locks, leaked quotas, or dangling state reservations (e.g. state marked committed but never dispatched)?
- Are cleanup or rollback operations guaranteed to run in `try/catch` or `finally` blocks?

### 2. Atomic Concurrency & OCC Races
- Can two concurrent requests, webhooks, or scheduled jobs race to read state and double-spend daily limits or quotas?
- Are checks and mutations executed within a single atomic database transaction rather than an async read followed by a delayed write?
- Are optimistic concurrency control (OCC) retries handled cleanly?

### 3. Secret Sanitization & Defense-in-Depth
- When serializing models or returning query results over public endpoints or WebSockets, are all secrets stripped?
- Verify serializers remove *all* sensitive fields (auth tokens, API keys, webhook secrets, private keys, internal credentials), not just primary passwords.
- Are development fallback secrets (e.g. mock API keys) strictly blocked in production (`process.env.NODE_ENV === 'production'`)?

### 4. Schema & Validator Conformance
- Does any new field, enum value, or write argument introduced in the diff violate the canonical schema definitions?
- Cross-reference against the project's canonical schema files (ORM models, schema validators, database DDL, API contracts) to ensure undeclared enum literals or missing properties do not trigger runtime validation crashes.

### 5. API & Contract Stability
- Does the diff arbitrarily rename exported functions, public endpoints, queries, or mutations?
- Ensure external callers, MCP tools, and frontend clients are not broken by unversioned signature changes.

### 6. Subtractive Integrity & Error Transparency
- Did the author add defensive wrappers around code that should have simply been deleted?
- Is there copy-pasted logic that belongs in the Service layer?
- Are there unnecessary type casts (`as any`, `as unknown`) bypassing compiler safety?
- Does the code swallow exceptions or fail silently without structured logging?

---

## Review Output Format

Output the interrogation report in chat using this structure:

```markdown
### Adversarial Interrogation Report: <branch-name>

#### Diff Summary
- Files changed: N
- Insertions: +X / Deletions: -Y (Diff budget check: < 400 LOC)

#### Failure Mode Checklist
- [ ] Async Crash Boundaries & Resource Leaks: [PASSED | VULNERABLE]
- [ ] Atomic Concurrency & OCC Races: [PASSED | VULNERABLE]
- [ ] Secret Sanitization & Defense-in-Depth: [PASSED | VULNERABLE]
- [ ] Schema & Validator Conformance: [PASSED | VULNERABLE]
- [ ] API & Contract Stability: [PASSED | VULNERABLE]
- [ ] Subtractive Integrity: [PASSED | VULNERABLE]

#### Findings

##### Finding 1: [Short Title]
- **Severity**: Critical | Major | Minor
- **Target**: `path/to/file.ext#L12-L34`
- **Vulnerability**: Exact explanation of the flaw or unhandled edge case.
- **Executable Reproduction**:
  ```typescript
  // Failing test proving the defect
  it("fails when external operation rejects, leaving resource slot orphaned", async () => {
    ...
  });
  ```
- **Recommended Subtractive Fix**: How to resolve it without adding bloat.

---

#### Verdict: [BLOCKED | APPROVED]
- **BLOCKED**: N critical/major findings require resolution. DO NOT COMMIT.
- **APPROVED**: Clean diff, zero failing reproductions. Proceed to commit and push.
```

---

## Resolution Protocol

1. If findings are reported with failing tests, save the failing test into the test suite.
2. Run the test to confirm it reproduces the failure (**RED**).
3. Update the implementation code to fix the root cause (**GREEN**).
4. Re-run `/interrogate` until the verdict is **APPROVED**.
5. Once approved, output the verified Interrogation Verdict in chat, proceed to `/unslop`, commit changes, and push to remote.
