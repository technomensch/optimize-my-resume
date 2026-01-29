# Test Cases: v9.3.5.2 Unified Hardening

## TC-001: The Unified Pressure Test
**Scenario:** 10 Positions | 50 Bullets Requested.
**Expected:**
1. **Stage 1 Table:** Shows word count plan AND Category Distribution plan.
2. **Stage 2 Thinking:** Explicitly audits a "Gerund" word in thinking and replaces it (Gerund Ban detection).
3. **Stage 3 Table:** Shows a row for "Math Integrity (G36)" and "Symbol Consistency (G22)" with [PASS].

## TC-002: Fallback Deletion
**Scenario:** Generation results in 510 words.
**Expected:** Automatic removal of P10 bullets until total < 500, followed by a RE-RECONCILIATION table.
