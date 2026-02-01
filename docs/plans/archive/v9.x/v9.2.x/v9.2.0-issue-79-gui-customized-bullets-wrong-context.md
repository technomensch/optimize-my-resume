# Issue #79: GUI Customized Bullets Using Wrong Context

**Status:** 🔴 IN PROGRESS
**Type:** 🐛 Bug
**Priority:** High
**Created:** 2026-01-22
**GitHub Issue:** #79

---

## Context

- **Tool/Component:** Should-I-Apply WebGUI
- **Version:** v1.2.0
- **Target Version:** v1.2.1

---

## Problem Description

After job fit analysis, clicking "Optimize Your Application" generates bullets with:
- Job title from JD (not job history)
- Company from JD (not job history)
- Only 1 position (not all positions)

## Root Cause

Ambiguous prompt in `generateCustomizedContent()` (line 667-734):
- Says "optimize for this specific job description"
- No explicit instruction to extract ALL positions from job history
- AI interprets "position from their experience" as the JD position

## Solution

Rewrite generation prompt to explicitly:
1. Instruct: "PARSE ALL POSITIONS from job history"
2. Clarify: "DO NOT use the job description's position/company"
3. Add example showing multi-position output structure
4. Add missing guardrails (#3, #13, #15, portfolio_employment_labeling)
5. Make chronology depth logic prominent as FILTER

---

## Affected Files

**Code Changes:**
- `claude-artifacts/Should-I-Apply-webgui.jsx` (lines 655-734)
- `src/components/Should-I-Apply-local.jsx` (same lines)

**Module References:**
- `optimization-tools/bullet-optimizer/bo_bullet-generation-logic.md` (chronology depth)
- `optimization-tools/bullet-optimizer/bo_evidence-matching.md` (position extraction)
- `optimization-tools/bullet-optimizer/bo_keyword_handling.md` (evidence validation)
- `optimization-tools/narrative-generator/ng_summary-generation.md` (Guardrails #3, #13, #15, #33)
- `core/format-rules.md` (character limits)
- `core/verb-categories.md` (distribution targets)

---

## Related

- **GitHub Issue:** https://github.com/technomensch/optimize-my-resume/issues/79
- **Branch:** `fix/issue-79-gui-customized-bullets-wrong-context`
