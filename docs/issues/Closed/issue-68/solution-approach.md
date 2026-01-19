# Solution Approach: Document v1.2.0

## Shadow Sync Protocol
This issue requires updates following the Shadow Modularization pattern (ADR-004):

### Update Order:
1. **MODULE (Update First):** `optimization-tools/narrative-generator/ng_summary-generation.md`
   - Add `<webgui_implementation>` XML section (UI documentation).
   - **Update Prompt Instructions:** Ensure the "Per-JD Customization" workflow is clearly defined for LLM interactions (e.g., "If user asks to customize for this JD, invoke this workflow").
   
2. **MODULE (Update First):** `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`
   - Add `<post_analysis_customization_offer>` trigger.
   - Define the conversational trigger: "After analysis, ask: 'Would you like customized content?'"

3. **GOLD MASTER (Sync Second):** `PROJECT-INSTRUCTIONS.md`
   - Sync changes from both modules with proper boundaries.

4. **OPTIMIZED ENTRYPOINT:** `Project-GUI-Instructions.md`
   - Verify references.

---

## Files Modified
- [ ] `optimization-tools/narrative-generator/ng_summary-generation.md`
- [ ] `optimization-tools/job-fit-analyzer/jfa_workflow-router.md`
- [ ] `PROJECT-INSTRUCTIONS.md`
- [ ] `Project-GUI-Instructions.md`
