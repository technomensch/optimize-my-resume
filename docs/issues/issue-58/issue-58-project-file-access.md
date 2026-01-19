# Issue #58: Check for Existing Project Files

**Status:** 🟡 PENDING  
**Type:** ✨ Enhancement  
**Priority:** Medium  
**Created:** 2026-01-18  
**GitHub Issue:** #60

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebUI
- **Version:** v1.2.0
- **Target Version:** v2.0.0

---

## Problem Description

The project instructions specify:
> "This tool should also check to see if any of these already exist in the project as an uploaded file, and ask the user if that should be used, or if the user wants to upload a new one."

This feature was partially implemented in v1.1.0 (user can type filename) but direct file access is not available in artifacts.

### Current Behavior
- User can type filename and click "Load File"
- System shows guidance to copy/paste instead (artifacts can't access project files directly)

### Expected Behavior
- Ideally: List available project files for selection
- Reality: May need to remain as manual filename entry with guidance

---

## Affected Files

- `Should-I-Apply-webgui.jsx` - Update `loadProjectFile()` function (~lines 165-180)

---

## Implementation Notes

- Claude artifacts have limited file system access
- This may be a fundamental limitation of the artifact environment
- Consider marking as "Won't Fix" if confirmed impossible

---

## Feasibility Study Required

Before implementation, need to research:
1. Can Claude artifacts access `/mnt/project/` directory?
2. Can we use File System Access API in browser?
3. Alternative: GitHub API integration to list files?

---

## Related

- Part of Should-I-Apply WebUI v2.0.0 milestone
- May require moving to standalone web app (not artifact)
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/60
