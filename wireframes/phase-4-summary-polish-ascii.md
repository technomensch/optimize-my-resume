# Phase 4: Summary & Polish - ASCII Workflow

**Version:** 1.1 <!-- v1.1 Change: Added Budget Enforcement & Quality Gates -->
**Last Updated:** 2026-01-05
**Related Modules:** `phases/phase-4/`, `core/format-rules.md`

---

## Overview
Phase 4 creates high-impact professional summaries and enforces final document standards. It applies v6.3.0 "Output Hardening" guardrails to ensure every character and word complies with ATS and professional best practices.

## Diagram

```text
  [ Complete Job History ]     [ Gap Analysis Result ]
            |                          |
            +------------+-------------+
                         |
                         v
+---------------------------------------------------+
|            SUMMARY & POLISH ENGINE               |
|---------------------------------------------------|
| 1. Synthesize Achievement-Oriented Summaries      |
| 2. Apply Budget Enforcement (v6.3.0 Rule)         |--> 100-210 Char / Bullet
| 3. Run Quality Gate (Verb Diversity / Repetition)  |--> Mandatory Re-gen Loop
| 4. Validate Symbols & Punctuation (No Em-Dashes)   |--> G22 Scan
+---------------------------------------------------+
                         |
            +------------+-------------+
            |                          |
            v                          v
+-----------------------+      +-----------------------+
|    MASTER SUMMARY     |      |    PER-JD SUMMARY     |
+-----------------------+      +-----------------------+
| - Comprehensive       |      | - Optimized keywords  |
| - High-level metrics  |      | - Target-specific     |
+-----------------------+      +-----------------------+
                         |
                         v
                [ FINAL QUALITY GATE ]
                ( Loop Limit: 3 tries )
                         |
                         v
                  [ FINAL OUTPUT ]
             ( Plain Text + Grammar Warn )
```

## Key Decision Points
- **Budget Compliance:** Guardrail #8 forces a reduction strategy if total word count > 500 or individual bullets > 210 chars.
- **Freshness Priority:** Guardrail #12 ensures the most recent position has a higher bullet density than older roles.
- **Symbol Sanitization:** Guardrail #22 automatically strips em-dashes (—) that break some ATS parsers.

## Inputs
- Full Job History v2.0
- Phase 2 Match Analysis
- Character/Word Budget Rules (`format-rules.md`)

## Outputs
- Master & Per-JD Professional Summaries
- Validated Resume Bullet Set
- Plain Text Export (Auto-generated)
- Secondary Grammar Check Warning

## Files Involved
- `phases/phase-4/summary-generation.md`
- `core/format-rules.md` (Guardrails #8, #12, #14, #22)

## Related Phases
- **Previous:** **Phase 3: Router & Workflows**
- **Next:** N/A (Project Exit)
