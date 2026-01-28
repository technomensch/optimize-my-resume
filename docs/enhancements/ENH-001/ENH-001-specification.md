# ENH-001: Model Selection for Bullet Regeneration

**Type:** Enhancement
**Priority:** Medium
**Status:** Draft
**Created:** 2026-01-25
**Author:** User + Claude Opus 4.5

---

## Summary

Allow users to select a different LLM model and regenerate customized bullets without having to re-run the resume/job description comparison step.

---

## Problem Statement

### Current Behavior
1. User uploads resume and job description
2. System analyzes and compares them (generates fit score, keywords, etc.)
3. User requests customized bullets
4. System generates bullets using the configured LLM model
5. **If bullets fail to generate** (e.g., model returns empty/invalid JSON):
   - User sees empty bullets section
   - **Only option: Start entire process over from step 1**

### Pain Points
- Smaller LLM models (7B-13B) often fail to produce valid structured JSON
- Re-running the comparison is wasteful - that data is already computed
- No visibility into why generation failed
- No way to retry with same or different model

### User Story
> As a user, I want to switch to a different LLM model and regenerate bullets after seeing a failed generation, so that I don't have to re-upload and re-analyze my resume and job description.

---

## Proposed Solution

### Feature 1: Model Selector Dropdown
- Add dropdown/select in the "Optimize Your Application" section
- Shows available models (from Ollama or configured providers)
- Defaults to current model
- Persists selection for future generations

### Feature 2: Regenerate Button
- Add "Regenerate Bullets" button next to model selector
- Triggers bullet generation with current/new model selection
- Uses existing analysis data (no re-comparison needed)
- Shows loading state during generation

### Feature 3: Generation Status Feedback
- Show clear error when generation fails (not silent empty state)
- Display attempt count (e.g., "Attempt 3/3 failed")
- Suggest trying a different model on failure

---

## Acceptance Criteria

1. [ ] User can see available LLM models in a dropdown
2. [ ] User can select a different model from the dropdown
3. [ ] User can click "Regenerate" to re-run bullet generation
4. [ ] Regeneration uses existing analysis (fit score, keywords preserved)
5. [ ] Clear error message shown when all attempts fail
6. [ ] Model selection persists across regeneration attempts
7. [ ] Works in both local and webgui versions

---

## Out of Scope

- Model configuration/settings (temperature, tokens, etc.)
- Adding new model providers (use existing Ollama setup)
- Changing the comparison/analysis step
- Automatic model fallback (user-initiated only)

---

## Technical Notes

### Affected Components
- `Should-I-Apply-local.jsx` - Add UI elements, state management
- `Should-I-Apply-webgui.jsx` - Same changes for web version
- `generation-helpers.js` - May need model parameter support

### State to Preserve
When regenerating, keep:
- `fitAnalysis` (score, recommendations)
- `extractedKeywords` (use/avoid keywords)
- `jobHistoryData` (parsed positions)
- `honestLimitations`

Only regenerate:
- `customizedBullets`
- `professionalSummary`

---

## Related Issues

- **Issue #79:** GUI Customized Bullets Using Wrong Context
  - This enhancement arose from debugging Issue #79
  - User discovered 7B model couldn't generate valid bullets
  - No way to switch models without restarting

---

## References

- [Issue #79 Implementation Log](../../issues/issue-79/implementation-log.md)
- [generation-helpers.js](../../../src/validators/bullet-generation/generation-helpers.js)
