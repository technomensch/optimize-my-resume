# Issue Report: Harden Guardrail Enforcement

**Local Tracking ID:** issue-85
**GitHub Issue:** [#97](https://github.com/technomensch/optimize-my-resume/issues/97)
**Title:** [BUG] Bullet Generation Ignores Guardrails and Formatting Instructions

## Context
- **Environment:** Claude.ai Artifacts, Antigravity (Gemini), Claude Code (Sonnet)
- **Tool/Phase:** Bullet Optimizer, Job Fit Analyzer
- **Version:** v9.3.4 → v9.3.5

## Description
When generating resume bullets, multiple LLMs (Claude Sonnet, Gemini) consistently ignore project-specific guardrails and formatting instructions despite them being explicitly defined in:
- `PROJECT-INSTRUCTIONS.md`
- `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md`
- `.agent/workflows/generate-bullets.md`

This results in "Vibe-Coding Drift" where the model defaults to its training bias on resume formatting rather than the project's documented architecture.

## Symptoms Observed (Across Multiple Sessions)
1. **Terminology:** Uses "Phase 1" instead of "Resume Analysis"
2. **Header Format:** Missing the two-line position header schema (Job Title | Dates + Duration line)
3. **Verb Diversity:** Repeats verb categories within a single position (violates G9)
4. **ASCII Visuals:** Missing the verb distribution bars (████░░░░░░)
5. **Metric Indicators:** Uses shorthand `✓ [Verb]` instead of explicit `✓ [Has Metrics] [[Category]] [Verb]`
6. **Terminal Anchor:** Response ends with generic sign-off instead of the mandatory grammar recommendation
7. **Export Persistence:** No plain text file exported to output path
8. **Workflow Routing Confusion:** Model ran `ng_summary-generation.md` (Job History Summary) instead of `bo_bullet-generation-instructions.md` (Bullet Generation)

## Gemini-Specific Failures (Reported by Agent)
- "Too many guardrails" - cognitive overload from stacked rules
- "Couldn't remember everything" - context window saturation
- "Did things in different order" - non-sequential instruction confusion
- "Made assumptions" - implicit instructions not made explicit

## Steps to Reproduce
1. Load PROJECT-INSTRUCTIONS.md context
2. Provide job history and JD
3. Request bullet generation using `/generate-bullets` workflow
4. Observe output formatting

## Expected Behavior
- All bullets formatted per `bo_bullet-generation-instructions.md` Section 5
- Pre-flight guardrail check **visible in output** (not hidden in thinking)
- All 8 validation points in `bo_output-validator.md` pass
- Agent asks for clarification if confused by any rule

## Actual Behavior
- Model generates "polished" resume bullets using generic formatting
- Project-specific structure (headers, ASCII bars, explicit indicators) ignored
- No pre-flight check visible
- Agent proceeds with assumptions instead of stopping

## Root Cause Analysis
1. **Instructional Saturation:** In 4,000+ line context windows, critical guardrails lose attention weight
2. **Training Bias Override:** LLMs revert to their training on "what a resume looks like"
3. **Negative Constraint Failure:** Rules stated as "do not" are less effective than positive execution gates
4. **Implicit "Reference" Language:** Workflow said "Reference" (passive) instead of "READ NOW" (active)
5. **Hidden Pre-flight:** Pre-flight table allowed in "thinking", invisible and unaccountable
6. **Missing Stop-on-Confusion Gate:** No instruction to stop if overwhelmed
7. **Too Many Indirection Layers:** 4 files to read in sequence, each hop a chance to lose context
8. **Summary Workflow Confusion:** `ng_summary-generation.md` and bullet generation both mention "summary"

## Solution Implemented (Phase 2 Workflow Hardening)
| Fix | Description |
|-----|-------------|
| **Stop-on-Confusion Gate** | Added explicit "If confused, STOP and ask" section at top of workflow |
| **Visible Pre-flight** | Changed from "in thinking" to "AS THE FIRST THING IN ITS RESPONSE" |
| **READ NOW Language** | Changed "Reference" to "⚠️ ACTION REQUIRED: OPEN AND READ" |
| **CHECKPOINT Confirmations** | Added explicit confirmation checklist after file reads |
| **Per-JD vs Master Clarification** | Fixed line 73 to specify Per-JD Summary section (lines 229-473), not Master Summary |
| **Hardened Output Validator** | Added explicit FAIL conditions to `bo_output-validator.md` for G24 (Char Limits), G29 (Metric Preservation), and G14 (Density/Sequence). |
| **Pre-flight Table Expansion** | Expanded the visible pre-flight table in `generate-bullets.md` to include G14, G24, and G29 as mandatory verification steps. |
| **Centralized Audit Logic** | Hardened G29 in the logic hub (`bo_bullet-generation-instructions.md`) by requiring a visible "Data Integrity Audit" Step 0 in thinking. |
| **Mandatory Disambiguation** | Updated `jfa_workflow-router.md` with aggressive warnings for "Optimize my resume," forcing a choice between Master Summary and Per-JD optimization. |
| **Symbol & Spacing Gate** | Hardened G22 in the logic hub and pattern catalog, explicitly banning em-dashes (`—`) and enforcing tight hyphenation for compound adjectives. |
| **G22 Validator Hardening** | Added explicit FAIL conditions to `bo_output-validator.md` for em-dashes and spaced hyphens in compound adjectives. |

## Additional Info
- Chat history from Gemini session (Jan 28) was lost, but captured symptoms are documented above
- Same issues observed with Sonnet (Jan 27)
- Pattern documented in `Lessons_Learned_Effective_LLM_Constraints.md` v1.1
