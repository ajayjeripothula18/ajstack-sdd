---
name: new-feature
description: Isolate repository edits in a Git worktree before starting a feature, fix, or documentation change. Preserve a worktree already assigned to the same task. Read-only reviews and investigations do not need a new worktree.
---

# New Feature

Each editing task gets its own worktree and branch, created from the latest
`origin/main` unless the user specifies a different base. Read-only work can
use the existing checkout. Never build on `main` or reuse another task's work.

## Check existing isolation first

Inspect `git worktree list`, `git status --short`, the current branch, and the
session's task assignment. If the environment already created a worktree for
this task, keep its path and branch and skip steps 3 and 4. In step 5, use the
actual assigned path. Do not infer isolation from the editor name or a branch
prefix alone. Otherwise follow all steps.

## Steps

1. **Sync**: `git fetch origin`.

2. **Scope check**: run `gh pr list` and skim the open PRs' changed files
   (`gh pr diff <n> --name-only`). For shared files, read the overlapping
   diffs. Independent edits may proceed in your own worktree. Ask for direction
   only when the changes conflict in behavior, require another task's unfinished
   work, or ownership is unclear. Check shared checkouts for uncommitted work
   without changing it. On another hosting platform, use its equivalent PR/MR
   tools; if unavailable, report the scope-check limitation and still isolate.

3. **Name the task**: lowercase-with-hyphens plus a short unique suffix,
   e.g. `user-auth-0816a`. If `git worktree add` fails because the name
   exists, pick a different name — never force or reuse.

4. **Create the worktree** from the repo root:

   **Compute Environment Guidance:**
   - **Shared-Host Environments (Local machine)**: When running agents on a shared host machine (Claude Code CLI, Antigravity local, Cursor local, Codex), agents share the developer's physical filesystem and ports. In this setup, **always** isolate worktrees inside a dedicated, gitignored directory:
     ```bash
     git worktree add .worktrees/<task-name> -b feat/<task-name> origin/main
     ```
     Link dependencies to avoid duplicating disk space:
     ```bash
     ln -s ../../node_modules .worktrees/<task-name>/node_modules
     ```
     Ensure `.worktrees/` is present in `.gitignore`. Never place worktrees loose in the project root.
   - **Cloud-Agent Environments**: When running in dedicated cloud VM sandboxes (e.g. Cursor Cloud Background Agents, Orgo cloud agents, GitHub Codespaces, remote containerized VMs), the cloud runner provisions an isolated machine per agent where container-level isolation is managed by the platform.

5. **Enter and verify**:

   ```bash
   cd .worktrees/<task-name>
   git branch --show-current   # must print your new branch, not main
   ```

   Confirm the required runtime version. Install dependencies inside the
   worktree when needed for the task's checks. Documentation-only work does
   not require installing an unrelated application toolchain.

## Remember

- Worktrees do **not** isolate dev-server ports or shared databases.
  Tracked dependency lockfiles are separate in each worktree. Confirm a port answers
  *your* process (`lsof -i :<port>`) before trusting what it serves, and
  resolve lockfile conflicts by regenerating, never by hand-merging.
- Keep the worktree until the PR is merged or closed. Cleanup after merge:

  ```bash
  git worktree remove <worktrees-dir>/<task-name>
  git branch -D <branch-prefix>/<task-name>
  ```

  `-D` is expected: after a squash- or rebase-merge, `-d` refuses even
  though the work is merged.
