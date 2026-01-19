# Issue #68: Document v1.2.0 Per-JD Customization

**Status:** 🟡 PENDING
**Type:** 📝 Documentation
**Priority:** Medium
**Created:** 2026-01-18
**GitHub Issue:** #68

---

## Context

- **Tool/Component:** Narrative Generator
- **Version:** v1.5.0
- **Target Version:** v1.5.0

---

## Problem Description
The v1.2.0 release added per-JD customized bullets and summary generation to the Should-I-Apply WebGUI, but the specific implementation details (conditional display, fitScore >= 50, output structure) are not fully documented in the project instructions.

## Requirement
Add `<webgui_implementation>` XML section to `ng_summary-generation.md` and trigger logic to `jfa_workflow-router.md`.

---

## Affected Files
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`

---

## Related
- **SHADOW SYNC REQUIRED**
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/68
