# Issue #69: Custom Keyword Validation & Evidence Check Guardrail

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement + 📝 Documentation
**Priority:** High
**Created:** 2026-01-18
**GitHub Issue:** #69

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebUI
- **Version:** v1.2.0
- **Target Version:** v1.3.0

---

## Problem Description
Need guardrails when users add custom keywords (via Issue #67 UI) to ensure they are defensible.
1. Validate custom keywords against job history evidence.
2. Warn users when custom keywords have no supporting evidence.
3. Require explicit confirmation before incorporating unevidenced keywords.
4. Document this behavior in project instructions (Guardrail #32).

---

## Affected Files
- `Should-I-Apply-webgui.jsx` (Enhancement)
- `optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md` (Documentation)

---

## Related
- Depends on Issue #67
- **SHADOW SYNC REQUIRED**
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/69
