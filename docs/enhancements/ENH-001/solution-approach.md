# Solution Approach: ENH-001 Model Selection for Bullet Regeneration

**Enhancement:** ENH-001
**Created:** 2026-01-25
**Status:** Draft

---

## Overview

Add model selection dropdown and regenerate button to the "Optimize Your Application" section, allowing users to switch models and regenerate bullets without re-running the comparison.

---

## Current Architecture

### Existing Model Selection
The components already have model selection infrastructure:

```javascript
// Should-I-Apply-local.jsx:40
const [selectedModel, setSelectedModel] = useState('');

// Used in analysis:
const result = await OllamaService.generate(selectedModel, analysisPrompt, {...});
```

### Current Flow
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Model Selection │ ──> │ Analyze (Compare)│ ──> │ Generate Bullets│
│ (top of page)   │     │ fitScore, etc.   │     │ customizedBullets│
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Problem:** Model selection is only at the top. No way to change it for regeneration.

---

## Proposed Architecture

### New Flow
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Model Selection │ ──> │ Analyze (Compare)│ ──> │ Generate Bullets│
│ (top of page)   │     │ fitScore, etc.   │     │ (first attempt) │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────▼─────────┐
                        │ Optimize Your Application Section          │
                        │ ┌─────────────────┐  ┌───────────────────┐│
                        │ │ Model Dropdown  │  │ Regenerate Button ││
                        │ │ [qwen2.5-14b ▼] │  │ [↻ Regenerate]    ││
                        │ └─────────────────┘  └───────────────────┘│
                        │                                            │
                        │ [Generated Bullets Display]                │
                        └────────────────────────────────────────────┘
```

---

## Implementation Plan

### Task 1: Add State for Generation Model

**File:** `src/components/Should-I-Apply-local.jsx`

Add new state to track the model used for bullet generation (separate from analysis model):

```javascript
// After line 40 (existing selectedModel state)
const [generationModel, setGenerationModel] = useState('');

// Initialize when analysis completes
useEffect(() => {
  if (selectedModel && !generationModel) {
    setGenerationModel(selectedModel);
  }
}, [selectedModel]);
```

### Task 2: Create Regeneration Function

**File:** `src/components/Should-I-Apply-local.jsx`

Extract bullet generation into a reusable function:

```javascript
const regenerateBullets = async (modelToUse) => {
  // Use existing analysis data (fitAnalysis, extractedKeywords, etc.)
  // Only regenerate customizedBullets and professionalSummary

  setGenerating(true);
  try {
    const loopResult = await generateWithValidationLoop(
      modelToUse,  // Use passed model, not selectedModel
      baseGenerationPrompt,
      referenceHistory,
      maxAttempts
    );
    setGeneratedContent(loopResult.content);
  } catch (err) {
    setError(`Generation failed: ${err.message}`);
  } finally {
    setGenerating(false);
  }
};
```

### Task 3: Add UI Components

**File:** `src/components/Should-I-Apply-local.jsx`

Add to "Optimize Your Application" section (around line 1550):

```jsx
{/* Model Selection & Regenerate - Show after initial generation */}
{generatedContent && (
  <div className="flex items-center gap-4 mb-4 p-3 bg-slate-800 rounded-lg">
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-400">Model:</label>
      <select
        value={generationModel}
        onChange={(e) => setGenerationModel(e.target.value)}
        className="bg-slate-700 text-white rounded px-3 py-1.5 text-sm"
        disabled={generating}
      >
        {availableModels.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>
    </div>

    <button
      onClick={() => regenerateBullets(generationModel)}
      disabled={generating || !generationModel}
      className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700
                 disabled:bg-slate-600 rounded text-sm font-medium transition-colors"
    >
      {generating ? (
        <>
          <span className="animate-spin">↻</span>
          Generating...
        </>
      ) : (
        <>
          <span>↻</span>
          Regenerate Bullets
        </>
      )}
    </button>

    {/* Generation status feedback */}
    {lastGenerationResult && !lastGenerationResult.success && (
      <span className="text-amber-400 text-sm">
        ⚠️ Last attempt failed ({lastGenerationResult.attempts}/3) - try a different model
      </span>
    )}
  </div>
)}
```

### Task 4: Add Generation Status Tracking

**File:** `src/components/Should-I-Apply-local.jsx`

Track last generation result for user feedback:

```javascript
const [lastGenerationResult, setLastGenerationResult] = useState(null);

// In regenerateBullets function:
setLastGenerationResult({
  success: loopResult.success,
  attempts: loopResult.attempts,
  model: modelToUse,
  timestamp: new Date().toISOString()
});
```

### Task 5: Apply Same Changes to WebGUI

**File:** `claude-artifacts/Should-I-Apply-webgui.jsx`

Mirror all changes from local.jsx to webgui.jsx for consistency.

---

## Files to Modify

| File | Changes | Lines (Est.) |
|------|---------|--------------|
| `src/components/Should-I-Apply-local.jsx` | Add state, regenerate function, UI | +80 |
| `claude-artifacts/Should-I-Apply-webgui.jsx` | Same changes | +80 |
| `src/validators/bullet-generation/generation-helpers.js` | Accept model parameter (if not already) | +5 |

---

## Risk Assessment

### Low Risk
- UI-only changes in existing components
- Uses existing Ollama infrastructure
- No changes to validation pipeline

### Medium Risk
- State management complexity (two model states)
- Need to ensure analysis data persists correctly

### Mitigations
- Keep `selectedModel` for analysis, add `generationModel` for bullets
- Don't modify existing analysis flow
- Clear error messaging guides users

---

## Alternatives Considered

### Option A: Single Model State (Selected)
Keep one `selectedModel` state, just add regenerate button.
- **Pro:** Simpler
- **Con:** Changing model affects both analysis and generation

### Option B: Separate Generation Model (Selected)
Add `generationModel` state, defaults to `selectedModel`.
- **Pro:** Clear separation of concerns
- **Con:** Slightly more complex

### Option C: Full Model Configuration Modal
Add modal with model settings (temperature, tokens, etc.)
- **Pro:** More control
- **Con:** Over-engineering for this use case

**Decision:** Option B - separate generation model state

---

## Success Metrics

1. User can regenerate bullets in <5 seconds (just LLM call, no re-analysis)
2. Clear feedback when generation fails
3. Model selection persists correctly
4. No regressions in existing functionality
