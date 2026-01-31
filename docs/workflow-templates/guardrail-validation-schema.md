# Layer 2: Proof of Work Schema (Guardrail Validation)

**Version:** 9.3.7
**Purpose:** Formalizes the JSON structure required for active guardrail enforcement. This schema forces the LLM to provide evidence for every claim.

---

## 1. Response Schema (JSON)

Every bullet generation response MUST follow this structure. If the response is not valid JSON or missing validation fields, it MUST be rejected.

```json
{
  "position_id": "P[N]",
  "job_title": "[Title] at [Company]",
  "bullets": [
    {
      "text": "[Optimized bullet text]",
      "charCount": [Integer 100-210],
      "verbCategory": "[Built|Lead|Managed|Improved|Collaborate]",
      "sourceEvidence": "[Quoted snippet from source job history]",
      "guardrailValidation": {
        "G1_MetricTraceability": {
          "status": "PASS",
          "metric_found": "[Value or 'None']",
          "validation_proof": "[Citation from source]"
        },
        "G24_CharacterLimit": {
          "status": "PASS",
          "actual_chars": [Number],
          "limit_range": "100-210"
        },
        "G35_GerundBan": {
          "status": "PASS",
          "first_word": "[Word]",
          "proof": "No gerund (-ing) at start"
        }
      }
    }
  ],
  "reconciliation": {
    "total_bullets_generated": [Number],
    "word_count_actual": [Number],
    "word_count_budget": [Number],
    "all_guardrails_passed": true,
    "insolvency_deadlock": false
  }
}
```

---

## 2. Validation Rejection Criteria

The output is considered **FAILED** and MUST be auto-rebounded if any of these success requirements are missing:

1. **Missing Schema:** Output is plain text instead of structured JSON.
2. **Invisible Validation:** `guardrailValidation` block is missing or hidden in a thinking block.
3. **Implicit Evidence:** `sourceEvidence` refers to "general experience" instead of a specific quote from the provided `job-history.txt`.
4. **Budget Violation:** `word_count_actual` > `word_count_budget`.
5. **Subjective Passing:** Using `✅/❌` icons for primary validation instead of raw numbers.

---

## 3. Reconciliation Table (Terminal Output)

After the JSON block, the system MUST output a human-readable table for final audit:

| Guardrail | Success Requirement | Actual Metric | Status |
| :--- | :--- | :--- | :--- |
| G8 | Word Budget (350-500) | [Word Count] | [PASS/FAIL] |
| G12 | 2 Bullets Min per Pos | [Bullet Count] | [PASS/FAIL] |
| G22 | Hyphen Integrity (No Em-dash) | [Violation Count] | [PASS/FAIL] |
| G37 | Verb Diversity (5% floor) | [Distribution %] | [PASS/FAIL] |

**Terminal Sentinel:**
"[RECOMMENDED] Perform a secondary grammar and spell check using tools like Google Docs, Microsoft Word, or another LLM session to ensure error-free presentation."
