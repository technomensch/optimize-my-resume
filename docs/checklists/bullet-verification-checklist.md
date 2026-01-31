# Bullet Verification Checklist (User Guide)

**Version:** 1.0 (v9.3.7.1)
**Purpose:** Simple manual checklist to spot-check generated bullets before sending to applications.

Use this checklist to verify your optimized bullets follow key quality standards. This complements the automated validator (`scripts/validate_bullets.py`).

---

## Pre-Generation Checklist

Before starting bullet optimization, verify you have:

- [ ] **Job Description:** Clear target position description
- [ ] **Job History:** Recent work history with dates and metrics
- [ ] **Keyword List:** Top 5-10 skills/keywords from the target JD
- [ ] **Time Budget:** 350-500 words total for all bullet content
- [ ] **Position Count:** Know how many previous positions to include (typically 5-8)

---

## Stage 1: Budget Allocation Table

After the optimization starts, you should see a **Budget Allocation Table** that shows:

- [ ] **Positions listed in order** (Most recent first: Position 1, 2, 3, etc.)
- [ ] **Word estimates for each position** (Total should be 350-500 words)
- [ ] **Bullet counts per position** (Usually 2-5 bullets per role)
- [ ] **Total adds up correctly** (Sum of estimated words ≤ 500)

**Example of what you should see:**
```
| Position | Recency | Bullets | Est. Words |
|----------|---------|---------|------------|
| 1        | Recent  | 5       | 150        |
| 2        | Prior   | 4       | 120        |
| 3        | Prior   | 3       | 100        |
| TOTAL    |         | 12      | 370        |
```

---

## Stage 2: Per-Position Verification

For each position in the output, check:

### Formatting
- [ ] **Job Title line:** Shows "Job Title at Company" format
- [ ] **Duration line:** Shows "Duration: X years/months"
- [ ] **Date range:** Shows "Month YYYY - Month YYYY" (or "Present")

**Example of correct header:**
```
Software Engineer at Acme Corp
July 2022 - Present
Duration: 1 year 7 months
```

### Bullet Quality
- [ ] **Bullet format:** Each starts with a dash (`-`) or bullet point (`•`)
- [ ] **Bullet length:** Each is roughly 100-210 characters (2-3 sentences)
- [ ] **Verb variety:** Different action verbs in this position
  - Built, Designed, Architected, Created (for "Built" category)
  - Led, Directed, Managed, Oversaw (for "Lead" category)
  - Improved, Optimized, Accelerated, Streamlined (for "Improved" category)
  - Collaborated, Partnered, Supported, Worked with (for "Collaborate" category)

**NOT allowed at start of bullets:**
- ❌ Words ending in "-ing" (Managing, Leading, Developing, Running, Creating)
- ❌ "Responsible for..."
- ❌ "Worked on..."

**Example of correct bullets:**
```
- ✓ Led cross-functional team of 5 to deliver Q3 product launch, increasing revenue by 15%
- ✓ Designed new onboarding workflow reducing setup time from 2 hours to 30 minutes
- ✓ Improved system performance by 40% through database optimization
- ✓ Collaborated with product team to implement 3 customer-requested features
```

**Example of INCORRECT bullets:**
```
- ❌ Managing a team of engineers (starts with -ing word)
- ❌ Worked on improving system performance (contains "Worked on")
- ❌ Responsible for database maintenance (contains "Responsible for")
- ❌ Built a system that managed data very efficiently (too vague, missing metrics)
```

### Metrics
- [ ] **Numbers present:** Each bullet contains at least one metric or quantifiable outcome
- [ ] **Metrics formatted:** Numbers include units ($, %, years, people, etc.)
- [ ] **Metrics plausible:** Numbers make sense (e.g., not 250% improvement without explanation)

**Example of good metrics:**
- ✓ "increased revenue by $2M"
- ✓ "reduced latency from 500ms to 50ms (90% improvement)"
- ✓ "managed team of 8 engineers"
- ✓ "processed 10M+ transactions daily"

**Example of BAD metrics:**
- ❌ "improved system performance by 1000%" (implausibly high)
- ❌ "managed team of engineers" (no number)
- ❌ "increased revenue" (no amount)

---

## Stage 3: Final Reconciliation

Before accepting the output, verify the **Final Reconciliation Table** at the end:

- [ ] **Total word count:** Shows actual count and confirms 350-500 words
- [ ] **Position count:** Shows how many positions included
- [ ] **Bullet distribution:** Matches the budget plan from Stage 1
- [ ] **All checks marked PASS** (or explained if any are FAIL)

**Example of what you should see:**
```
| Requirement | Actual | Status |
|-------------|--------|--------|
| Word Count  | 385    | ✓ PASS (350-500) |
| Positions   | 5      | ✓ PASS |
| Bullets     | 15     | ✓ PASS (2+ per position) |
| Formatting  | OK     | ✓ PASS |
```

---

## Final Output Verification

At the very end of the output:

- [ ] **Recency anchor present:** Output ends with recommendation to "Perform a secondary grammar and spell check..."
- [ ] **No thank you message:** Does NOT end with "Let me know if you need..." or generic sign-off
- [ ] **Verb distribution shown:** ASCII bars show percentage breakdown of verb categories

**Example of correct ending:**
```
Verb Distribution:
Built:        ██████░░░░░░░░░░░░░ (30%)
Lead:         ████████░░░░░░░░░░░░ (33%)
Managed:      ██████░░░░░░░░░░░░░░ (20%)
Improved:     ████░░░░░░░░░░░░░░░░ (13%)
Collaborate:  ████░░░░░░░░░░░░░░░░ (13%)

[RECOMMENDED] Perform a secondary grammar and spell check using tools
like Google Docs, Microsoft Word, or another LLM session to ensure
error-free presentation.
```

---

## Hyphenation Check

- [ ] **Hyphenation:** Uses tight hyphens only (`-`), not em-dashes (`—`) or spaced hyphens (` - `)
  - Correct: `multi-agent system`, `Jan-Feb 2024`, `first-time user`
  - Wrong: `multi — agent system`, `Jan - Feb 2024`, `first — time user`

---

## Phrase Uniqueness Check

- [ ] **No repeated phrases:** A 3+ word phrase should not appear more than 2 times in your entire output
  - ✓ OK: "improved system performance" appears 1-2 times
  - ❌ NOT OK: "improved system performance" appears 3+ times

---

## Character Count Sample Check

Pick 2-3 random bullets and count characters (rough estimate):

| Bullet | Approx Chars | Status |
|--------|--------------|--------|
| Example 1 | ~150 chars | ✓ OK (100-210 range) |
| Example 2 | ~180 chars | ✓ OK (100-210 range) |
| Example 3 | ~90 chars | ❌ TOO SHORT |

---

## Optional: Run External Validator

If you have Python installed, you can run the automated validator:

```bash
cat bullets.txt | python scripts/validate_bullets.py
```

This will show a detailed report including:
- Pass/fail status for each guardrail
- Overall compliance rate
- Specific violations needing fixes

---

## Summary: Quick Pass/Fail

**Your bullets PASS if:**
- ✅ All positions have correct headers with dates
- ✅ All bullets start with past-tense action verbs (no "-ing" words)
- ✅ All bullets contain quantifiable metrics or outcomes
- ✅ Total word count is 350-500 words
- ✅ Each bullet is roughly 100-210 characters
- ✅ Verb variety across each position
- ✅ No repeated 3+ word phrases
- ✅ Ends with grammar check recommendation

**Your bullets FAIL if:**
- ❌ Missing position headers or dates
- ❌ Bullets start with "-ing" words, "Responsible for", or "Worked on"
- ❌ Bullets lack specific metrics or numbers
- ❌ Total word count exceeds 500 words
- ❌ Bullets too short (<100 chars) or too long (>210 chars)
- ❌ Same verb appears multiple times in short positions
- ❌ Same phrase repeats 3+ times across all bullets

---

## Getting Help

If you find issues:
1. Review your optimized bullets for the specific problem
2. Make small edits to fix the violation
3. Re-check using this checklist
4. When everything passes, you're ready to submit!

**For technical details:** See `optimization-tools/bullet-optimizer/bo_output-validator.md`
