---
description: Generate optimized resume bullets using the centralized logic hub
---

# Generate Bullets Workflow

This workflow routes bullet generation requests to the centralized logic hub (`bo_bullet-generation-instructions.md`) following the "Bullet-First" execution order defined in ADR-009.

---

## When to Use This Workflow

Use this workflow when:
- User requests bullet optimization for a specific position
- Running the "Optimize My Application" flow (bullets must be generated before summary)
- Updating existing bullets to match a new JD

---

## Execution Steps

### Step 1: Verify Prerequisites
Ensure the following context is available:
- **Job History:** Either from uploaded file, `job-summaries/` directory, or PROJECT-INSTRUCTIONS.md context
- **JD (if applicable):** Either from uploaded file, `jd_parsed/` directory, or user-provided text

**Note:** File paths and names may vary by environment (Claude Desktop, Claude Web, other LLMs). The workflow adapts to whatever context is available.

### Step 2: Load the Logic Hub
Reference the authoritative bullet generation logic:
```
optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md
```

### Step 3: Execute Bullet Generation
Follow the logic hub instructions in order:
1. **Core Achievement Guardrails** (G1, G5, G11, G21, G29)
2. **Structural Integrity** (G8, G9, G12)
3. **Personal Project Optimization** (if Position 0)
4. **Specialized Logic** (G30, G33)
5. **Final Output Formatting**

### Step 4: Validate Output
Before returning bullets to the user:
- Verify all bullets are 100-210 characters
- Confirm no verb category repeats within a position (except 5+ bullet positions)
- Check that Position 1 has minimum 3 bullets
- Run Narrative Fit Audit (G33) against JD requirements

### Step 5: Return Results
Provide:
- Optimized bullets grouped by position
- Narrative Gap report (if any JD requirements are unaddressable)
- Metric indicators (✓ for quantified, - for qualitative)

---

## Execution Order: "Bullet-First" Priority

When running the full "Optimize My Application" flow:
1. **First:** Generate bullets using this workflow
2. **Then:** Generate professional summary using `ng_summary-generation.md`

This ensures the summary is an abstraction of the bullets, not a dictation.

---

## Related Documentation
- [ADR-009: Hub-and-Spoke Bullet Generation](../../docs/decisions/ADR-009-hub-and-spoke-bullet-generation.md)
- [Logic Map: Summary vs. Bullet](../../docs/enhancements/ENH-003/logic-map.md)
- [Bullet Generation Instructions Hub](../../optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md)
