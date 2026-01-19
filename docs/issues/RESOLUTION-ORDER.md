# Should-I-Apply WebUI Issues - Resolution Order

## v1.3.0 - Keyword Management & Validation (Phase 1)
**Dependencies:** None
**Milestone:** Core interactive features

1. **Issue #67** - Interactive Keyword Management UI
   - Complexity: Medium
   - No dependencies
   - **Start here**

2. **Issue #69** - Custom Keyword Validation & Evidence Check
   - Complexity: High
   - **Depends on:** #67
   - **Blocks:** Nothing
   - Includes Shadow Sync for new Guardrail #32

---

## v1.4.0 - Refinements (Phase 2)
**Dependencies:** None (can be done in parallel)
**Milestone:** UX improvements

3. **Issue #57** - Binary File Content Extraction
   - Complexity: Medium
   - Libraries: pdf.js, mammoth.js

4. **Issue #61** - Industry Transferability Display
   - Complexity: Low
   - References: jfa_job-fit-assessment.md

5. **Issue #62** - Loading State Progress Indicators
   - Complexity: Low
   - Pure UI enhancement

6. **Issue #64** - Post-Analysis Narrative Fit Verification
   - Complexity: Medium
   - No additional API calls

---

## v1.5.0 - Documentation Sync (Phase 3)
**Dependencies:** None
**Milestone:** Formal documentation alignment

7. **Issue #65** - Update Post-Analysis Prompt Wording
   - Complexity: Low
   - **Shadow Sync Required**
   - Module: ng_summary-generation.md

8. **Issue #66** - Add JD Keywords Display to Project Instructions
   - Complexity: Low
   - **Shadow Sync Required**
   - Modules: ng_summary-generation.md, ra_jd-parsing.md

9. **Issue #68** - Document v1.2.0 Per-JD Customization
   - Complexity: Medium
   - **Shadow Sync Required**
   - Modules: ng_summary-generation.md, jfa_workflow-router.md

---

## v2.0.0 - Advanced Features (Phase 4)
**Dependencies:** Significant refactoring required
**Milestone:** Major enhancements

10. **Issue #58** - Check for Existing Project Files
    - Complexity: High
    - May be impossible in artifact environment
    - Needs feasibility study

11. **Issue #60** - Multi-JD Batch Analysis
    - Complexity: High
    - Major refactor required
    - Token budget implications

---

## Resolution Strategy

### Recommended Approach:
1. **Start with v1.3.0** (#67, #69) - Core functionality
2. **Parallel work on v1.4.0** (#57, #61, #62, #64) - Can assign multiple devs
3. **Follow with v1.5.0** (#65, #66, #68) - Documentation cleanup
4. **Defer v2.0.0** (#58, #60) - Future major release

### Critical Path:
#67 → #69 (must be sequential)

All other issues can be worked in parallel or any order.
