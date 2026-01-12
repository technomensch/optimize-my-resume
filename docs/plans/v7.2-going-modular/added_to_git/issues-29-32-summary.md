# Issues #29-32: Modularization Extraction Tasks

**Created:** 2026-01-11  
**Project:** v7.1 Modularization  
**Status:** 📋 PLANNED

---

## Issue #29: Extract phase3-fit-assessment.md (8K tokens)

**Type:** Refactor | **Priority:** High | **Time:** 1 hour

**Content to Extract:**
- Pre-generation fit assessment
- Portfolio project weighting validation
- Role-type experience validation
- Adjacent technical definition
- Industry context validation
- Keyword context validation

**Expected Savings:** 8K tokens on non-JD-comparison sessions

**Reference to Add:**
```xml
<phase3_fit_assessment>
  <reference priority="high">
    For complete JD fit assessment methodology,
    see: /mnt/project/phase3-fit-assessment.md
  </reference>
  
  <when_to_load>
    Load this module when:
    - User provides job description
    - Running Phase 3 comparison
    - Calculating fit scores
  </when_to_load>
</phase3_fit_assessment>
```

**File:** docs/issues/issue-29/issue-29-extract-phase3-fit.md

---

## Issue #30: Extract quality-gates-guardrails.md (10K tokens)

**Type:** Refactor | **Priority:** Medium | **Time:** 1 hour

**Content to Extract:**
- All 28 system guardrails
- Quality gate logic
- Automatic validation rules
- Regeneration protocols
- Error detection patterns

**Expected Savings:** 10K tokens on normal sessions (loaded only for debugging)

**Reference to Add:**
```xml
<quality_gates>
  <reference priority="medium">
    Complete guardrail specifications in: /mnt/project/quality-gates-guardrails.md
  </reference>
  
  <when_to_load>
    Load this module when:
    - Debugging quality issues
    - User asks about validation rules
    - Investigating guardrail failures
  </when_to_load>
  
  <note>
    Quality gates apply automatically. Only load for debugging.
  </note>
</quality_gates>
```

**File:** docs/issues/issue-30/issue-30-extract-quality-gates.md

---

## Issue #31: Extract job-history-template-system.md (8K tokens)

**Type:** Refactor | **Priority:** Medium | **Time:** 1 hour

**Content to Extract:**
- Template system overview
- XML schema template
- Markdown template
- LLM generation instructions
- Validation scripts
- Conversion scripts
- Workflow skills (/md-job-history, /update-history)

**Expected Savings:** 8K tokens on sessions not involving job history generation

**Reference to Add:**
```xml
<job_history_template_system>
  <reference priority="medium">
    Complete template system documentation in: /mnt/project/job-history-template-system.md
  </reference>
  
  <when_to_load>
    Load this module when:
    - Generating new job history
    - Updating existing job history
    - Validating job history format
    - Converting between XML and Markdown
  </when_to_load>
</job_history_template_system>
```

**File:** docs/issues/issue-31/issue-31-extract-template-system.md

---

## Issue #32: Update PROJECT-INSTRUCTIONS.md with module references

**Type:** Documentation | **Priority:** High | **Time:** 1 hour

**Depends On:** Issues #28, #29, #30, #31 must be complete

**Tasks:**
1. Verify all 4 module files created
2. Verify all references added correctly
3. Update PROJECT-INSTRUCTIONS header with v7.1
4. Add module index at top of file
5. Remove duplicate PROJECT-INSTRUCTIONS-GUI.md
6. Final token count verification (~47K expected)
7. Test all workflows end-to-end

**Success Criteria:**
- [ ] All modules working
- [ ] All references correct
- [ ] Header shows v7.1
- [ ] Module index added
- [ ] GUI file deleted
- [ ] Token counts validated
- [ ] Full testing passed

**File:** docs/issues/issue-32/issue-32-update-references.md

---

**Created:** 2026-01-11  
**Version:** 1.0  
**Total Time:** 4 hours (Issues #29-32)
