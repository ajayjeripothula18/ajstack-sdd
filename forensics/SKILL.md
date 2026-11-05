---
name: forensics
description: Deep root-cause investigation and telemetry analysis. Read-only diagnostic skill to inspect logs, traces, call stacks, and git history before touching code. Use when analyzing bugs, performance cliffs, or unclear requirements.
---

# Forensics (Deep Root-Cause Investigation)

## Overview

`/forensics` enforces the principle: **"If you want to go fast, go deep first."**

When faced with a bug, regression, or performance cliff, the worst failure mode of an AI agent is speculative trial-and-error editing. `/forensics` guarantees that causality is proven before a single line of production code is modified.

---

## The 4 Cardinal Rules of Forensics

1. **Read-Only Invariant**: Do not edit production code or configuration files during a forensics run. Any test scripts written must live in temporary scratch locations (`.artifacts/scratch/repro.*`).
2. **Attack the Premise**: Do not assume the reported issue is accurate or that the proposed fix is necessary. Verify:
   - Does the issue actually occur in the current commit?
   - Is the caller invoking the API against the documented contract?
   - Is this an intentional design constraint or documented limitation?
3. **Trace Causality to the Root**: Do not treat the symptom with a defensive null check or try/catch patch. Follow the call stack backward until you locate the exact origin of invalid state.
4. **Mandate an Isolated Reproduction**: An investigation is not finished until you have an automated script or test that reliably triggers the failure.

---

## Investigation Playbook

### Step 1: Telemetry & Stack Trace Inspection
- Collect exact error messages, status codes, and call stacks.
- Identify the boundary where valid input transitioned into invalid runtime state.
- Dump verbose server logs to `.artifacts/scratch/forensics-trace.log` to protect chat context.

### Step 2: Historical Provenance (Git Archaeology)
- Inspect recent changes to the affected files:
  ```bash
  git log -p -n 5 -- <affected-file>
  ```
- Search when a specific function, type, or error string was introduced:
  ```bash
  git log -S "<symbol-or-string>" --oneline
  ```
- Use `git bisect` if the regression point across commits is unknown.

### Step 3: Minimal Isolated Reproduction
- Write a standalone test or reproduction script that isolates the faulty behavior from external dependencies.
- Verify that it fails reliably:
  - Exit code != 0 or expected assertion failure.

---

## Forensics Report Format

Summarize findings using this structure:

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
- What can be simplified or deleted to fix this at the source rather than patching the symptoms.
```

Once the forensics report is complete and the reproduction script passes red, proceed to `/sdd-flow` or `/new-feature` to implement the isolated fix.

