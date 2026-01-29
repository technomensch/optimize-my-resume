# Enhancement Specification: ENH-007 (Skills Inventory Prep)

**Status:** 🔴 ACTIVE
**Local ID:** ENH-007
**GitHub Reference:** #98 (Proposed)
**Version:** v9.3.5.4

## Requirement Summary
Establish the logic for **Positional Evidence Gating** in Section 12 (Skills Inventory). 

## Technical Requirements
1. **Positional Anchoring:** 
   - Every skill listed MUST contain a `[P-ID]` citation.
   - For standardized job histories, `P-ID` = `pos_id` (1, 2, 3...).
   - For raw resumes, `P-ID` = `P1, P2...` (Assigned on-the-fly during parsing).
2. **Evidence Gate:** 
   - Reject any skill that cannot be found in the Bullet/Achievement text of at least one position.
   - Exception: Skills explicitly mentioned in Education/Certifications sections.

## Acceptance Criteria
- [ ] Parse a raw text resume and assign sequential `P1-Pn` identifiers to positions.
- [ ] Block the addition of "Hallucinated Skills" (skills not mentioned in any position).
- [ ] Output a "Skills Evidence Audit" showing the link between Skill X and Position Y.
