# Solution Approach: Narrative Fit Verification

## Overview
Implement narrative fit verification in **both** the WebGUI (client-side) and the LLM Prompts (server-side generation).

---

## 1. WebGUI Implementation (Client-Side)
- **Logic:** `verifyNarrativeFit(jobHistory, jdRequirements)`
- **UI:** NarrativeFitSummary component (Matrix, Gap Indicators).

---

## 2. Prompt Implementation (Shadow Sync Required)
We must instruct the LLM to perform this verification during bullet generation.

### Module: `optimization-tools/narrative-generator/ng_summary-generation.md`
Add logic to the generation prompt instructions:

```xml
<narrative_fit_verification>
  AFTER generating bullets, perform a self-audit:
  1. Check if the top 3 hard requirements from the JD are addressed by at least one bullet.
  2. If a top requirement is missing, explicitly note this in the "Optimization Notes" section as a "Narrative Gap".
  3. Ensure the collective story aligns with the target role level.
</narrative_fit_verification>
```

### Shadow Sync Protocol
1. **MODULE (Update First):** `optimization-tools/narrative-generator/ng_summary-generation.md`
   - Add `<narrative_fit_verification>` block.
2. **GOLD MASTER (Sync Second):** `PROJECT-INSTRUCTIONS.md`
   - Copy content using `<!-- SILENT SYNC -->`.
3. **ENTRYPOINT:** `Project-GUI-Instructions.md`
   - Verify reference.

---

## Files to Modify
- `Should-I-Apply-webgui.jsx`
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `PROJECT-INSTRUCTIONS.md`
- `Project-GUI-Instructions.md`

---

## Testing
See `test-cases.md`
