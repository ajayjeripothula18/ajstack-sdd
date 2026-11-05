# Multi-Model Execution Guide

This document details the multi-model tiering matrix for `ajstack-sdd`, inspired by `pstack`'s cognitive specialization. In modern agentic engineering, assigning distinct roles to different model tiers maximizes code quality, eliminates blind spots, and optimizes cost and latency.

---

## 1. Role Allocation Matrix

| Role | Primary Responsibility | Recommended Models | Reasoning Budget / Profile |
| :--- | :--- | :--- | :--- |
| **Architect & Orchestrator** | Phase 0 Discovery, Phase 1 Issue Slicing, System Architecture, Complex Trade-offs | **Frontier Thinking Models**:<br>• Claude 3.7 Sonnet (Thinking)<br>• Gemini 2.5 / 3.8 Pro<br>• GPT-4o / o3-mini | High reasoning budget (`thinking: enabled` or `xhigh`). Requires deep spatial and dependency reasoning. |
| **Builder & Implementer** | Worktree code implementation, Action/Service wiring, unit & Playwright test authoring | **Fast, Precise Coding Models**:<br>• Claude 3.7 Sonnet<br>• Gemini 2.5 Flash / Flash-Thinking | Medium reasoning. Prioritizes exact syntax, compliance with existing patterns, and fast iterative tool calls. |
| **Adversarial Interrogator** | Pre-flight `/interrogate` diff audit, writing failing reproductions, red-teaming | **Independent Skeptic Models**:<br>• Gemini 3.8 Pro / o3-mini<br>• Fresh instance of Claude 3.7 Sonnet | High reasoning. Must be run without builder bias. Instructed to aggressively seek race conditions and edge cases. |
| **Hygiene & Formatting** | `/unslop` passes, commit message formatting, markdown diff table generation | **Lightweight Fast Models**:<br>• Gemini 2.5 Flash-Lite<br>• Claude 3.5 Haiku | Low/Zero reasoning. Rapid token throughput for text-processing heuristics. |

---

## 2. Platform-Specific Setup

### Google Antigravity
In Antigravity, model tiering is configured dynamically when invoking subagents or per session:
- **Orchestrator**: Default parent agent or `inherit` with Gemini 3.8 Pro / Claude 3.7 Sonnet.
- **Subagents**: When invoking subagents via `invoke_subagent`, set `Model`:
  - `pro` for architectural planning or adversarial `/interrogate` runs.
  - `flash` for implementation worker tasks.
  - `flash_lite` for quick file searches or repetitive scans.

### Claude Code
In Claude Code, you can switch models or run subagent workflows:
- Use `/model` to set the primary model (`claude-3-7-sonnet-20250219`).
- Use thinking mode flags (`--thinking-budget`) during Phase 0 and Phase 1.
- Spawn lightweight subagent sessions for isolated builds and testing.

### Cursor
In Cursor, model allocations are specified in `.cursor/rules/`:
- In `.cursorrules` or `.cursor/rules/*.mdc`, specify the primary editor model.
- Use `composer` with thinking-enabled models (Claude 3.7 Sonnet with Thinking, o3-mini) for architecture.
- Use fast models (Claude 3.5 Sonnet / Gemini Flash) for localized function edits.

---

## 3. The Adversarial Isolation Rule

> [!IMPORTANT]
> **Avoid Builder Confirmation Bias**
> An agent that writes a diff will naturally rationalize its own blind spots.
> Whenever possible, `/interrogate` should be executed either:
> 1. By an entirely separate model family (e.g. Gemini auditing Claude's code, or vice versa).
> 2. In a fresh, isolated subagent conversation whose system prompt is strictly framed as an adversarial challenger.

