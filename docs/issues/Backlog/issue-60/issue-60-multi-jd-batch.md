# Issue #60: Multi-JD Batch Analysis

**Status:** ⚪ DEFERRED  
**Type:** ✨ Enhancement  
**Priority:** Low  
**Created:** 2026-01-18  
**GitHub Issue:** #61

---

## Context

- **Environment:** Claude Web Artifacts
- **Tool/Component:** Should-I-Apply WebUI
- **Version:** v1.2.0
- **Target Version:** v2.0.0

---

## Problem Description

Users applying to multiple jobs must run analysis one at a time.

### Expected Behavior
- Upload multiple JDs
- Run batch analysis
- Compare fit scores across all JDs
- Prioritize which jobs to apply for

---

## Affected Files

- `Should-I-Apply-webgui.jsx` - Major refactor: add multi-JD state, batch analysis loop, comparison UI

---

## Reason for Deferral

Token usage would be significant for batch analysis. Consider for v2.0 with proper token budgeting.

### Estimated Token Cost
- Single analysis: ~2,000-4,000 tokens
- Batch of 5 JDs: ~10,000-20,000 tokens
- Need token budget management system first

---

## Future Considerations

Before implementing:
1. Add token usage tracking
2. Implement smart caching (avoid re-analyzing same resume)
3. Add batch progress indicator
4. Consider concurrent vs sequential processing

---

## Related

- Part of Should-I-Apply WebUI v2.0.0 milestone
- Requires token budget management system
- Documentation: docs/issues/issue-tracker-should-i-apply.md
- GitHub: https://github.com/technomensch/optimize-my-resume/issues/61
