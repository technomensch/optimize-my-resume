# Solution Approach: Keyword Display Documentation
**Branch:** `feat/issue-66-keyword-display`

## Shadow Sync Protocol
This issue requires updates following the Shadow Modularization pattern (ADR-004) to ensure keyword visibility in **both** GUI and LLM Chat.

### Update Order:

1. **MODULE (Update First):** `optimization-tools/resume-analyzer/ra_jd-parsing.md`
   - Update `<output_format>` requirements.
   - **Instruction:** "You MUST list the top 5 'Matched Keywords' and top 5 'Missing Keywords' in the analysis summary so the user can see them."

2. **MODULE (Update First):** `optimization-tools/narrative-generator/ng_summary-generation.md`
   - Add `<keyword_display_after_analysis>` section.
   - Define how keywords should be presented to the user to inform their customization choices.

3. **GOLD MASTER (Sync Second):** `PROJECT-INSTRUCTIONS.md`
   - Sync changes from both modules.
   - Maintain `<!-- SILENT SYNC -->` boundaries.

4. **OPTIMIZED ENTRYPOINT:** `Project-GUI-Instructions.md`
   - Verify references point to updated modules.

---

## Files Modified
- [ ] `optimization-tools/narrative-generator/ng_summary-generation.md`
- [ ] `optimization-tools/resume-analyzer/ra_jd-parsing.md`
- [ ] `PROJECT-INSTRUCTIONS.md`
- [ ] `Project-GUI-Instructions.md`
