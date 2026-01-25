# Implementation Plan: ENH-001 Model Selection for Bullet Regeneration

**Enhancement:** ENH-001
**Priority:** Medium
**Status:** Ready for Implementation
**Created:** 2026-01-25
**Version:** TBD (to be assigned at implementation)

---

## Summary

Add model selection dropdown and regenerate button to the "Optimize Your Application" section, enabling users to switch LLM models and regenerate customized bullets without re-running the resume/job description comparison.

---

## Problem

When bullet generation fails (common with smaller 7B-13B models), users must:
1. Refresh the page
2. Re-upload resume/job description
3. Re-run comparison analysis
4. Wait for fit score calculation again
5. Then try generation with a different model

**This is wasteful** - the comparison data is already computed and valid.

---

## Solution

Add two UI elements to the "Optimize Your Application" section:

1. **Model Dropdown** - Select from available Ollama models
2. **Regenerate Button** - Re-run bullet generation with selected model

Preserves all analysis data (fit score, keywords, job history) - only regenerates bullets.

---

## Implementation Tasks

### Task 1: Add Generation Model State
**File:** `src/components/Should-I-Apply-local.jsx`
```javascript
const [generationModel, setGenerationModel] = useState('');
const [lastGenerationResult, setLastGenerationResult] = useState(null);
```

### Task 2: Create Regeneration Function
**File:** `src/components/Should-I-Apply-local.jsx`
- Extract bullet generation into `regenerateBullets(modelToUse)`
- Use existing analysis data
- Track generation result for user feedback

### Task 3: Add UI Components
**File:** `src/components/Should-I-Apply-local.jsx`
- Model dropdown in "Optimize Your Application" section header
- Regenerate button with loading state
- Failure feedback message

### Task 4: Mirror Changes to WebGUI
**File:** `claude-artifacts/Should-I-Apply-webgui.jsx`
- Apply identical changes for web version

---

## Files to Modify

| File | Purpose |
|------|---------|
| `src/components/Should-I-Apply-local.jsx` | Main implementation |
| `claude-artifacts/Should-I-Apply-webgui.jsx` | Web version mirror |

---

## Acceptance Criteria

- [ ] Model dropdown visible after bullet generation
- [ ] Dropdown shows all available Ollama models
- [ ] Regenerate button triggers new generation
- [ ] Analysis data preserved on regeneration
- [ ] Clear error message on generation failure
- [ ] Works in both local and webgui versions

---

## Verification Steps

1. Run `npm run dev`
2. Complete analysis with any model
3. Generate bullets (success or fail)
4. Change model in new dropdown
5. Click "Regenerate"
6. Verify fit score unchanged
7. Verify new bullets generated

---

## Related Documentation

- [ENH-001 Specification](../enhancements/ENH-001/ENH-001-specification.md)
- [Solution Approach](../enhancements/ENH-001/solution-approach.md)
- [Test Cases](../enhancements/ENH-001/test-cases.md)

---

## Context

This enhancement arose from Issue #79 debugging, where a user discovered their 7B model couldn't generate valid `customizedBullets` JSON. The only workaround was restarting the entire flow.

---

## Branch

```bash
git checkout -b ENH-001-model-regeneration
```
