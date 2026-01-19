# Issue #61: Industry Transferability Display

**Status:** �� PENDING  
**Type:** ✨ Enhancement  
**Priority:** Medium  
**Created:** 2026-01-18  
**GitHub Issue:** #62

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebGUI
- **Version:** v1.2.0
- **Target Version:** v1.4.0

---

## Problem Description

The `jfa_job-fit-assessment.md` includes detailed industry context validation and transferability matrix, but the current UI doesn't prominently display this information.

### Current Behavior
- industryContext object returned in API response
- May or may not be displayed based on API output

### Expected Behavior
- Dedicated "Industry Context" section in results
- Show JD industry, candidate industry, transferability level
- Visual indicator (HIGH/MODERATE/LOW) with color coding

---

## Affected Files

### WebGUI Artifact
- `Should-I-Apply-webgui.jsx` - Add new collapsible section in results view (~line 1720)

### Reference Module
- `optimization-tools/job-fit-analyzer/jfa_job-fit-assessment.md` - Contains industry transferability logic

---

## Reference

See `jfa_job-fit-assessment.md` "\`<industry_context_validation>\`" section for full logic.

---

## Implementation Notes

This feature displays information that's already being calculated. The data exists in the analysis result; we just need to surface it in the UI.

---

## Related

- Part of Should-I-Apply WebGUI v1.4.0 milestone
- References module: jfa_job-fit-assessment.md
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/62
