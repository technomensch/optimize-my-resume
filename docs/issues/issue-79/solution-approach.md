# Solution Approach: Issue #79

## Diagnosis

The prompt in `generateCustomizedContent()` is ambiguous:
- Tells AI to "optimize for this specific job description"
- Schema says "position title from their experience" (unclear if this means job history or JD)
- No explicit instruction to parse ALL positions from job history
- Chronology depth logic mentioned but not emphasized as a FILTER

Result: AI thinks it should generate bullets FOR the JD position, not FROM the job history positions.

---

## Solution Design

### Prompt Rewrite Strategy

Replace generation prompt (lines 667-734) with explicit multi-position instructions:

1. **Opening Statement**: Change to "Generate customized resume bullets for positions in the candidate's job history that meet chronology depth criteria"
2. **Step 2 (NEW)**: Make chronology depth logic the FILTER (not just bullet count rule)
3. **Critical Instruction 1**: "PARSE ALL POSITIONS from the job history above"
4. **Critical Instruction 2**: "DO NOT use the job description's position/company"
5. **Position Loop Instruction**: "FOR EACH INCLUDED POSITION (after filtering)..."
6. **Output Schema Clarification**: Add comments "ONE OBJECT PER HISTORICAL POSITION"
7. **Concrete Example**: Show 3-position input → 3-position output

### Chronology Depth Logic (Guardrail)

Make explicit as FILTER before generation:

**INCLUDE positions that meet ANY:**
- a) Recent/Current (Years_Since_End ≤ 6 OR Job is "Present") → 3-5 bullets
- b) Tenure Exception (Years_Since_End > 6 AND Job_Duration ≥ 5 years) → 2-3 bullets

**EXCLUDE positions that meet:**
- c) Very Old, Short Tenure (Years_Since_End > 6 AND Job_Duration < 5 years) → Exclude

### Missing Guardrails to Add

1. **Guardrail #3 (Summary Abstraction)**
   - No sentence shares >50% keywords with any bullet
   - Must synthesize across roles
   - Start with outcome (Why) not action (How)

2. **Guardrail #13 (Metric Reconciliation)**
   - Every metric in summary traceable to bullets
   - Exception: Years from dates

3. **Guardrail #15 (Phrase Repetition)**
   - No 3+ word phrase repeated 3+ times
   - Across summary and all bullets

4. **portfolio_employment_labeling rule (CRITICAL)**
   - Append "(Independent Project)" to portfolio positions
   - Prevents misrepresentation during background checks

5. **Verb Category Distribution**
   - Target 13-27% per category (Built, Lead, Managed, Improved, Collaborate)

6. **Character Limit Correction**
   - Change "100-210 chars" to "≤210 characters" (hard ATS limit)

### Additional Changes

- Add clarifying comment before `experienceContent` preparation (line 655)
- Reference all guardrails in prompt and comment
- Maintain keyword evidence validation (existing functionality)
- Preserve narrative verification (Guardrail #33)

### Shadow Sync Considerations

- JSX artifacts are self-contained (no module imports)
- This is a prompt fix within JSX, no module changes needed
- No changes needed to PROJECT-INSTRUCTIONS.md or Project-GUI-Instructions.md
- If later extracted: Would go to `optimization-tools/bullet-optimizer/bo_multi-position-generation.md`

---

## Implementation Plan

1. Update Should-I-Apply-webgui.jsx prompt (lines 667-734)
2. Add clarifying comment (line 655)
3. Update Should-I-Apply-local.jsx (identical changes)
4. Test with 3-position job history
5. Verify chronology depth logic filtering works
6. Verify multi-position output structure
