---
name: interrogate
description: In-session adversarial pre-flight review. Audits git diff in the worktree before pushing or opening a PR, requiring executable failing reproduction tests for any flagged issue. Use prior to git push and greploop.
---

# Interrogate (Pre-Flight Adversarial Review)

## Overview

`/interrogate` is an internal adversarial peer review run directly inside your Git worktree **before pushing to remote or opening a PR**. 

Leaving code review entirely to external CI bots like Greptile is slow, wasteful, and burns CI minutes. `/interrogate` catches bugs, race conditions, edge cases, and design flaws locally within seconds.

---

## The Skeptical Reviewer Invariant

When running `/interrogate`, adopt the persona of a **Skeptical Staff Engineer** whose sole objective is to break the proposed changes.

> [!IMPORTANT]
> **The Hard Invariant: No Reproducible Test, No Finding.**
> Subjective stylistic opinions, bikeshedding, and vague warnings ("this might fail under load") are strictly disallowed.
> Every flagged issue **MUST** include an executable failing test case (`*.spec.ts`, `test_*.py`) or a concrete shell reproduction script proving the defect. If you cannot write a reproduction, the finding is invalid.

---

## Audit Checklist

Examine the full diff against the base branch:
```bash
git diff origin/main
```

### 1. Edge Cases & Boundary Conditions
- What happens with empty inputs, nulls, zeroes, negative numbers, or maximum allowable payloads?
- Are off-by-one errors possible in slices, paginations, or loops?
- Are string encodings, Unicode, or timezone offsets handled safely?

### 2. Concurrency & Async Safety
- Can two concurrent requests race on this state transition or database row?
- Are promises handled with proper error boundaries, or can an unhandled rejection crash the runtime?
- Are timeouts, retries, and circuit breakers bounded?

### 3. Subtractive Integrity
- Did the author add defensive wrappers around code that should have simply been deleted?
- Is there copy-pasted logic that belongs in the Service layer?
- Are there unnecessary type casts (`as any`, `as unknown`) bypassing compiler safety?

### 4. Error Transparency
- Does the code swallow exceptions or fail silently?
- Are user-facing errors sanitized while developer logs retain structured causality?

---

## Review Output Format

Output the interrogation report in chat using this structure:

```markdown
### Adversarial Interrogation Report: <branch-name>

#### Diff Summary
- Files changed: N
- Insertions: +X / Deletions: -Y (Diff budget check: < 400 LOC)

#### Findings

##### Finding 1: [Short Title]
- **Severity**: Critical | Major | Minor
- **Target**: `path/to/file.ext#L12-L34`
- **Vulnerability**: Exact explanation of the flaw or unhandled edge case.
- **Executable Reproduction**:
  ```typescript
  // Failing test proving the defect
  it("fails when input array contains duplicate IDs during concurrent batch", async () => {
    ...
  });
  ```
- **Recommended Subtractive Fix**: How to resolve it without adding bloat.

---

#### Verdict: [BLOCKED | APPROVED]
- **BLOCKED**: N critical/major findings require resolution.
- **APPROVED**: Clean diff, zero failing reproductions, ready for `/unslop` and PR.
```

---

## Resolution Protocol

1. If findings are reported with failing tests, save the failing test into the test suite.
2. Run the test to confirm it reproduces the failure (**RED**).
3. Update the implementation code to fix the root cause (**GREEN**).
4. Re-run `/interrogate` until the verdict is **APPROVED**.
5. Once approved, proceed to `/unslop` and push to remote.

