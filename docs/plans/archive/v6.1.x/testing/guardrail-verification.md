# Guardrail Verification Suite

**Version:** 1.0
**Last Updated:** 2026-01-05

This test suite is designed to verify that the integrated guardrails are correctly identifying, flagging, and preventing invalid outputs or logic errors.

## Integrity Gate Tests (Red)

### TEST-ID: GUARD-INT-001 (Data Loss Prevention)
- **Input:** Simulate a file save where the new history count is >10% lower than the cached count without an explicit delete command.
- **Expected:** Guardrail #6 triggers. Prompt asks for confirmation: "DANGER: You are about to save a history that has [X] fewer positions than currently recorded."
- **Failure:** File saves silently.

### TEST-ID: GUARD-INT-002 (Score Consistency)
- **Input:** 4 Critical Gaps identified, but manual score override attempted to 85%.
- **Expected:** Guardrail #19 triggers. Score is capped at 79% (Stop Tier) based on gap density.
- **Failure:** Score displays as 85%.

## Validation Core Tests (Blue)

### TEST-ID: GUARD-VAL-001 (Portfolio Weighting)
- **Input:** Candidate has 5 years of personal portfolio projects and 2 years of professional experience. Role requires 5 years.
- **Expected:** `portfolio-weighting.md` applies 50% discount to projects. Total calculated years = 2 + (5 * 0.5) = 4.5. Match status = [PARTIAL].
- **Failure:** Match status = [MATCHED] (direct summation).

### TEST-ID: GUARD-VAL-002 (Keyword Context)
- **Input:** Resume says: "Documented the team's transition to AWS." JD requires: "Hands-on experience building in AWS."
- **Expected:** `keyword-context.md` identifies "Documented" as an adjacent technical verb. Penalty applied. Status = [MISSING] or [PARTIAL].
- **Failure:** Status = [MATCHED] based on "AWS" keyword match.

## Production Hardening Tests (Green)

### TEST-ID: GUARD-HARD-001 (Budget Enforcement)
- **Input:** Generate a bullet with 250 characters.
- **Expected:** Guardrail #8 triggers. System automatically prunes the bullet to <210 characters before presentation.
- **Failure:** Bullet displays at 250 characters.

### TEST-ID: GUARD-HARD-002 (Symbol Validation)
- **Input:** Resume text contains an em-dash (—) or escaped char (\~).
- **Expected:** Guardrail #22/Symbol Consistency Rule triggers. Output displays standardized hyphen (-) or unescaped tilde (~).
- **Failure:** Unicode symbols or backslashes remain in output.
