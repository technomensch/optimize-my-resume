# Issue #68: Document v1.2.0 Per-JD Customization

**Status:** 🟢 CLOSED
**Type:** 📝 Documentation
**Priority:** Medium
**Created:** 2026-01-18
**Closed:** 2026-01-19
**GitHub Issue:** #68

---

## Context

- **Tool/Component:** Narrative Generator
- **Version:** v1.5.0
- **Target Version:** v9.1.0

---

## Problem Description
The v1.2.0 release added per-JD customized bullets and summary generation to the Should-I-Apply WebGUI, but the specific implementation details (conditional display, fitScore >= 50, output structure) were not fully documented in the project instructions.

## Requirement
Add `<webgui_implementation>` XML section to `ng_summary-generation.md` and trigger logic to `jfa_workflow-router.md`.

## Implementation Details (v9.1.0)
- **Guardrail #35 (Post-Analysis Customization Offer):** Formally codified the trigger logic in `jfa_workflow-router.md` to offer customization only when `Fit Score >= 50`.
- **Narrative Generator Update:** Added `<webgui_implementation>` to `ng_summary-generation.md` detailing the prompt structure and keyword evidence rules.
- **Shadow Sync:** Synchronized these rules to `PROJECT-INSTRUCTIONS.md` (Gold Master) and `Project-GUI-Instructions.md` (Entrypoint) to ensure consistency across the documentation stack.

---

## Affected Files
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`
- `PROJECT-INSTRUCTIONS.md` (Shadow Sync)
- `Project-GUI-Instructions.md` (Entrypoint Verification)

---

## Related
- **SHADOW SYNC COMPLETED**
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/68
