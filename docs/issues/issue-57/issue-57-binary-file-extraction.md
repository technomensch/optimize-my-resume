# Issue #57: Binary File Content Extraction

**Status:** 🟡 PENDING  
**Type:** 🐛 Bug / Enhancement  
**Priority:** High  
**Created:** 2026-01-18  
**GitHub Issue:** #59

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebUI
- **Version:** v1.2.0
- **Target Version:** v1.4.0

---

## Problem Description

PDF and DOCX files are read as base64 and sent to Claude API, but the current implementation may not reliably extract text content from all binary formats.

### Current Behavior
- Files are read as base64 data URLs
- A note is appended indicating binary format
- Claude API attempts to process, but results may be inconsistent

### Expected Behavior
- Reliable text extraction from PDF and DOCX files
- Fallback messaging if extraction fails

---

## Affected Files

- `Should-I-Apply-webgui.jsx` (lines ~200-230, handleFileUpload function)

---

## Proposed Solution

1. Use pdf.js library for PDF text extraction in browser
2. Use mammoth.js for DOCX text extraction in browser
3. Add error handling for failed extractions
4. Provide user feedback on extraction status

---

## Workaround

Users can copy/paste resume text directly instead of uploading binary files.

---

## Related

- Part of Should-I-Apply WebUI v1.4.0 milestone
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/59
