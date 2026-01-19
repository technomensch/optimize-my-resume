# Solution Approach: Keyword Validation

## Overview
Implement validation guardrails in both the WebGUI (pre-generation check) and the LLM System Prompt (generation-time check).

---

## 1. WebGUI Implementation
- **Logic:** `checkKeywordEvidence(keyword)`
- **UI:** Warning indicators & Confirmation Modal.

---

## 2. Prompt Implementation (Shadow Sync Required)
We must ensure the LLM validates custom keywords even if the user bypasses the GUI (or uses the "Confirm" override).

### Module: `optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md`
Add Guardrail #32:
```xml
<custom_keyword_evidence_guardrail id="32">
  IF user manually requests a keyword that is NOT in the job history:
  1. **Validation:** Check job history for evidence (synonyms allowed).
  2. **Warning:** If no evidence is found, you MUST warn the user: "I cannot find evidence of [keyword] in your history. Including it may not be defensible in an interview."
  3. **Override:** Only proceed if the user explicitly confirms (e.g., "Use it anyway").
  4. **Integration:** If confirmed but unverified, incorporate it LIGHTLY (do not make it the central theme).
</custom_keyword_evidence_guardrail>
```

### Module: `optimization-tools/narrative-generator/ng_summary-generation.md`
- Reference Guardrail #32 in the generation instructions.

### Shadow Sync Protocol
1. **MODULE:** `ra_quality-gates-guardrails.md` (Add XML).
2. **MODULE:** `ng_summary-generation.md` (Add reference).
3. **GOLD MASTER:** `PROJECT-INSTRUCTIONS.md` (Sync).
4. **ENTRYPOINT:** `Project-GUI-Instructions.md` (Verify).

---

## Files to Modify
- `Should-I-Apply-webgui.jsx`
- `optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md`
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `PROJECT-INSTRUCTIONS.md`
- `Project-GUI-Instructions.md`

---

## Testing
See `test-cases.md`
