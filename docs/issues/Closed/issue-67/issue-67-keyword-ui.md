# Issue #67: Interactive Keyword Management UI

**Status:** 🟡 PENDING
**Type:** ✨ Enhancement
**Priority:** Medium
**Created:** 2026-01-18
**GitHub Issue:** #67

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebUI
- **Version:** v1.2.0
- **Target Version:** v1.3.0

---

## Problem Description
Users cannot modify the keywords used for content generation. They should be able to:
1. Add custom keywords not extracted from the JD
2. Ignore/exclude keywords they don't want incorporated
3. See which keywords will be used BEFORE generating content

### Current Behavior
- Keywords extracted from JD automatically
- User has no control over usage

### Expected Behavior
Interactive two-column keyword manager:
- "USE" column (Green border): Keywords to include
- "IGNORE" column (Gray/Muted): Keywords to exclude
- Add Keywords input: User can add terms
- Click-to-toggle: Move items between columns

---

## Affected Files
- `Should-I-Apply-webgui.jsx`

---

## Related
- Part of Should-I-Apply UI v1.3.0 milestone
- Prerequisite for Issue #69 (Validation)
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/67
