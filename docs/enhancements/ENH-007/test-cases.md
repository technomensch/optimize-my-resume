# Test Cases: ENH-007 (Skills Inventory Prep)

## Scenario 1: Raw Resume Parsing (Format Agnostic)
- **Input:** Raw text block containing 3 jobs with no XML tags.
- **Action:** Initiate Section 12 logic.
- **Expected Result:** Logic assigns `P1`, `P2`, `P3` to the 3 jobs and allows skills to cite these IDs correctly.

## Scenario 2: Hallucination Blocking (The Evidence Gate)
- **Input:** JD requiring "Python", Job History with 2 jobs, no Python mention.
- **Action:** User requests adding "Python" to Section 12.
- **Expected Result:** [REJECT] Logic notifies user: "No evidence of Python found in P1 or P2. Bullet generation must include Python before it can enter Section 12."

## Scenario 3: Cross-Format Mapping
- **Input:** Standard v12.1 Job History with `pos_id="1"`.
- **Action:** Verify skill citation.
- **Expected Result:** Skill maps to `[P1]` successfully.
