# Session: Hardened Guardrail Enforcement & Terminology Normalization

**Date:** 2026-01-28
**Type:** Bug Fix / Hardening
**Duration:** ~3 hours
**Status:** Completed (v9.3.5)

---

## Session Overview

This session successfully addressed **Issue #85 (GitHub #97)**, remediating "Vibe-Coding Drift" where the agent ignored established guardrails. We implemented aggressive defensive measures in the prompt architecture, including visible pre-flight execution gates, a terminal "Recency Anchor," and hard-coded symbol exclusion rules to prevent em-dash and metric-loss hallucinations. We also completed a broad terminology normalization to align the entire modular system.

## What We Built

- **Hardened Workflow Gate:** Updated `.agent/workflows/generate-bullets.md` with a mandatory visible "Pre-flight Guardrail Check" and a "Stop-on-Confusion" safety gate.
- **Terminal Recency Anchor:** Added a `<final_recency_anchor>` to `PROJECT-INSTRUCTIONS.md` to lock in terminology and formatting constraints at the end of the context window.
- **Negative Validator:** Created `optimization-tools/bullet-optimizer/bo_output-validator.md` (The Negative Checklist) to force agents to audit their own work for failures before delivery.
- **Action Verb Hardening (Phase 5):**
  - **G35 (Gerund Ban):** Hardened validator to reject "-ing" verbs.
  - **G36 (Math Integrity):** Enforced mathematical accuracy for visual bars.
  - **G37 (5% Floor):** Mandated minimum diversity threshold for verb categories.

## Decisions Made

1. **Visible Pre-flight:** Moved the guardrail check from "internal thinking" to a mandatory visible markdown table.
2. **"Three-Layer" Defense:** Formalized the Pre-flight -> Logic Hub -> Validator pattern in [ADR-010](../decisions/ADR-010-guardrail-hardening-pattern.md).
3. **Synthetic Metrics:** Codified "True Path" metrics for solo projects in the Knowledge Graph.
3. **Aggressive Disambiguation:** Updated the Workflow Router to force a binary choice between "Master Summary" and "Per-JD Optimization," preventing logic conflation.
4. **Tight Hyphenation Policy:** Explicitly banned em-dashes (`—`) in favor of tight hyphens (`-`) to eliminate agent-induced spacing errors in compound adjectives.

## Problems Solved

- **Vibe-Coding Drift:** Solved the issue where agents defaulted to general resume "vibes" instead of project-specific formatting (Duration lines, ASCII bars).
- **Logically Hallucinated Spacing:** Corrected a recurring error where the agent confused the Recency Rule (G12) with a non-existent spacing rule for dashes.
- **Metric Loss (G29):** Implemented a mandatory "Data Integrity Audit" as Step 0 in the logic hub to prevent loss of quantitative achievements during rewriting.
- **Terminology Drift:** Standardized the lexicon across modular files that were missed in previous cleanup passes.

## Files Touched

**Modified:**
- `PROJECT-INSTRUCTIONS.md` (v9.3.5)
- `Project-GUI-Instructions.md`
- `.agent/workflows/generate-bullets.md`
- `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md`
- `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`
- `optimization-tools/shared/shared_keyword_validation.md`
- `optimization-tools/webgui/webgui_artifact_config.md`
- `optimization-tools/resume-analyzer/ra_entry-router.md`
- `docs/knowledge/patterns.md` (Added Visual Pattern Audit)
- `docs/knowledge/gotchas.md` (Added Logic Conflation Trap)

**Created:**
- `optimization-tools/bullet-optimizer/bo_output-validator.md`
- `docs/plans/v9.3.5-issue-85-harden-guardrail-enforcement.md`
- `docs/issues/issue-85/issue-85-description.md`
- `docs/issues/issue-85/test-cases.md`

## Commits Created

```bash
a4a2ee3 - docs/feat: Harden guardrail enforcement and terminology normalization (Issue #85)
```

## Lessons Learned

- **Instructional Saturation:** Even explicit rules ("NEVER use em-dashes") fail in long context windows unless prioritized via "Recency Anchors" or visible pre-flight steps.
- **Logic Conflation Trap:** Subtle terminology overlap (e.g., "Summary") across different files can trigger conflated logic loops unless aggressively disambiguated at the router level.
- **ID Parallax:** Guardrail labels must be mapped to precise definitions in the active logic hub; otherwise, agents may attribute incorrect behaviors to specific ID codes based on "intuition."

## Next Steps

1. **Phase 7 Completion:** Final broad terminology normalization across remaining secondary documentation files.
2. **Regression Testing:** Perform a full 9-position test run using the "Bullet Optimizer" command to confirm zero regression.
3. **PR Finalization:** Finalize PR for Issue #85 once all normalization tasks are ✅.

---

**Session Stats:**
- Files modified: 14
- Files created: 4
- Commits: 1
- Version: v9.3.5
