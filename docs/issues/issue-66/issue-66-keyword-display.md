# Issue #66: Add JD Keywords Display to Project Instructions

**Status:** 🟡 PENDING
**Type:** 📝 Documentation
**Priority:** Low
**Created:** 2026-01-18
**GitHub Issue:** #66

---

## Context

- **Tool/Component:** Resume Analyzer / Narrative Generator
- **Version:** v1.5.0
- **Target Version:** v1.5.0

---

## Problem Description
The v1.2.0 WebGUI displays ATS keywords (matched/missing), but this feature is not documented in the project instructions. The feature should be formally added to ensure consistency across implementations.

## Requirement
Add `<keyword_display_after_analysis>` XML section to documentation.
- Document purpose: help user understand ATS optimization opportunities
- Document display sections: matched_keywords (green), missing_keywords (red)

---

## Affected Files
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `optimization-tools/resume-analyzer/ra_jd-parsing.md`

---

## Related
- **SHADOW SYNC REQUIRED**
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/66
