# Layer 3: Two-Turn Constrained Workflow

**Version:** 9.3.7
**Purpose:** Breaks the monolithic generation process into a reviewable sequence to prevent instruction drift and catch impossible constraints early.

---

## Turn 1: Structural Planning (The Budget)

**Input:**
- Target JD
- Validated Job History (v2.0 Schema)
- Total Word Budget (e.g., 500 words)

**Success Requirements (Turn 1 Output):**
1. **Unified Planning Table:**
   - Position ID | Est. Word Count | Bullet Count Allocation.
   - Summed total MUST be <= word budget.

   **Example:**
   ```
   | Position | Recency | Bullets | Est. Words |
   |----------|---------|---------|------------|
   | 0        | Recent  | 5       | 150        |
   | 1        | Prior   | 4       | 120        |
   | 2        | Prior   | 3       | 100        |
   | 3        | Prior   | 2       | 75         |
   | 4        | Prior   | 1       | 55         |
   | TOTAL    |         | 15      | 500        |
   ```

2. **Chronological Map:**
   - Position order (0, 1, 2...) sorted by Start Date DESC.
3. **Keyword Distribution Plan:**
   - Mapping of Top 5 matched keywords to specific positions.
4. **Feasibility Assessment:**
   - Explicitly state: "Constraints are logically possible" OR "Deadlock detected (reason)".

**USER ACTION:** Manual confirmation or "re-allocate" command.

---

## Turn 2: Constrained Generation (The Execution)

**Input:**
- Approved Planning Table from Turn 1.
- Mandatory Guardrail Code (Layer 4 Injection).

**Success Requirements (Turn 2 Output):**
1. **Proof of Work JSON:**
   - Follow `guardrail-validation-schema.md` exactly.
   - Use only the word budget allocated in Turn 1.
2. **Visible Validation Gates:**
   - Every bullet must show its own internal audit.
3. **Final Reconciliation Table:**
   - Compare Actual vs. Planned numbers from Turn 1.

   **Example:**
   ```
   | Position | Planned Words | Actual Words | Bullets | Status |
   |----------|---------------|--------------|---------|--------|
   | 0        | 150           | 148          | 5       | ✓      |
   | 1        | 120           | 122          | 4       | ✓      |
   | 2        | 100           | 98           | 3       | ✓      |
   | 3        | 75            | 76           | 2       | ✓      |
   | 4        | 55            | 56           | 1       | ✓      |
   | TOTAL    | 500           | 500          | 15      | ✓      |
   ```

4. **Compliance Sentinel:**
   - Conclude with the terminal recency anchor.

---

## Error Handling: The Deadlock Loop

If Turn 1 reveals that constraints are impossible (e.g., 10 positions x 2 bullets/pos x 210 chars/bullet exceeds 500 words):
1. **DO NOT** attempt a "best effort" generation.
2. **STOP.**
3. Output: `══════ HALT: LOGIC DEADLOCK (G41) ══════`.
4. Explain the math failure.
5. Provide 3 alternatives (reduce positions, increase word budget, or reduce character limits).
6. Wait for user decision before proceeding to Turn 2.
