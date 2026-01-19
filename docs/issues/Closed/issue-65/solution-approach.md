# Solution Approach: Update Prompt Wording

## Shadow Sync Protocol
This issue requires updates following the Shadow Modularization pattern (ADR-004):

### Update Order (CRITICAL):
1. **MODULE (Update First):** `optimization-tools/narrative-generator/ng_summary-generation.md`
   - Update prompt text.
   
2. **GOLD MASTER (Sync Second):** `PROJECT-INSTRUCTIONS.md`
   - Copy updated content to Gold Master.
   - Wrap in `<!-- SILENT SYNC: Narrative Generator -->`.
   
3. **OPTIMIZED ENTRYPOINT (Reference Third):** `Project-GUI-Instructions.md`
   - Verify `<modular_reference>` points to correct module section.

---

## Files Modified
- [ ] `optimization-tools/narrative-generator/ng_summary-generation.md`
- [ ] `PROJECT-INSTRUCTIONS.md`
- [ ] `Project-GUI-Instructions.md`
