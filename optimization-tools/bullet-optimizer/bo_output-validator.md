# Guardrail Output Validator (The Negative Checklist)

**Version:** 1.0 (2026-01-28)
**Purpose:** Forced verification layer to prevent "Vibe-Coding" drift and instruction bypass.

---

## CRITICAL: DISCARD AND REGENERATE IF ANY FAIL
The agent MUST scan its drafted output against this checklist. If a "FAIL" condition is met, the draft is invalid and must be corrected before delivery.

### 1. Terminology (Rule: Mandatory)
- [ ] **FAIL:** Output contains the words "Phase 1", "Bullet Optimization", or "Job Fit Analysis".
- [ ] **PASS:** Uses "Resume Analysis", "Job Fit Analyzer", or "Bullet Optimizer".

### 2. Header Schema (Rule: G8 / FMT)
- [ ] **FAIL:** Position header missing the "Duration: X years/months" line.
- [ ] **FAIL:** Position header missing start/end dates.
- [ ] **PASS:** Header follows: 
      `Job Title at Company | Month YYYY - Month YYYY`
      `Duration: X years/months`

### 3. Verb Diversity (Rule: G9)
- [ ] **FAIL:** Position has < 5 bullets, but includes two verbs from the same category (e.g., "Architected" and "Implemented" are both [Built]).
- [ ] **PASS:** Every verb in a < 5-bullet position represents a unique category.

### 4. Visual Elements (Rule: Action Verb Visuals)
- [ ] **FAIL:** ASCII distribution bars (e.g., ████░░░░░░) are missing from the summary section.
- [ ] **PASS:** Visual distribution is present and matches the calculation.

### 5. Chronology Depth (Rule: G12)
- [ ] **FAIL:** Any position with an end date of 2020 or later is missing.
- [ ] **PASS:** Full 6-year history is included.

### 6. Indicators (Rule: Metric Detection)
- [ ] **FAIL:** Uses shorthand `✓ [Verb]` or `- [Verb]`.
- [ ] **PASS:** Uses explicit tags: `✓ [Has Metrics] [[Category]] [Verb]` or `- [No Metrics] [[Category]] [Verb]`.

### 7. Recency Anchor (Rule: The System Closer)
- [ ] **FAIL:** Output ends with a "thank you" or generic sign-off.
- [ ] **PASS:** Output ends with the hard-coded "[RECOMMENDED] Perform a secondary grammar..." recommendation.

### 8. Export Persistence (Rule: Rule #103)
- [ ] **FAIL:** Only chat output provided; no plain text file written or offered.
- [ ] **PASS:** Export handled per environment:
  - **Claude.ai Artifacts:** `write_to_file` used to create export in `/mnt/user-data/outputs/`
  - **Local Dev (Claude Code, Antigravity):** Export to `./outputs/` or user directory
  - **Other LLM Chats:** Plain text version provided in chat response (acceptable fallback)

### 9. Character Limits (Rule: G24)
- [ ] **FAIL:** Any bullet exceeds 210 characters.
- [ ] **PASS:** All bullets are between 100-210 characters.

### 10. Metric Preservation (Rule: G29)
- [ ] **FAIL:** A metric (number, %, $) found in the source (`v12.1.txt`) is missing in the optimized bullet.
- [ ] **PASS:** Every performance-impacting metric from the source is preserved or explicitly improved.

### 11. Density and sequence (Rule: G14 / Chronology)
- [ ] **FAIL:** Positions are merged or displayed in non-reverse-chronological order.
- [ ] **FAIL:** Any position has < 3 or > 5 bullets.
- [ ] **PASS:** Distinct positions accurately separated, most recent first, with correct bullet density.

### 12. Symbols & Spacing (Rule: G22)
- [ ] **FAIL:** Output contains em-dashes (`—`) or spaced hyphens (` - `) inside bullets.
- [ ] **FAIL:** Compound adjectives use spaces (e.g., `multi — agent`) instead of tight hyphens (`multi-agent`).
- [ ] **PASS:** Tight hyphenation only; zero em-dash presence.

---

## Failure Protocol
If any of the above fails, you have drifted into "Vibe-Coding."
1. Acknowledge the failure internally.
2. Review `PROJECT-INSTRUCTIONS.md` and `bo_bullet-generation-instructions.md`.
3. Regenerate the specific position or section until it passes 100%.
