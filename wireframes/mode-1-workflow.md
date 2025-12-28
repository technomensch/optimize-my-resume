# Mode 1 Workflow: Full Resume Analysis

<!-- Version: 5.0 -->
<!-- Purpose: Visual workflow diagram for Mode 1 -->
<!-- Last Updated: December 2024 -->

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│              USER PROVIDES FULL RESUME FOR ANALYSIS                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 1: STRUCTURAL ANALYSIS                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Analyze Resume Structure:                                     │  │
│  │  - Contact information present?                               │  │
│  │  - Professional summary/objective?                            │  │
│  │  - Work experience section?                                   │  │
│  │  - Education section?                                         │  │
│  │  - Skills section?                                            │  │
│  │  - Additional sections (certs, awards, etc.)                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 2: EXPERIENCE CALCULATION                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Calculate Years of Experience:                                │  │
│  │  1. Find earliest relevant professional position              │  │
│  │  2. Find end date (Present or most recent end)                │  │
│  │  3. Calculate: End Date - Start Date                          │  │
│  │  4. Classify:                                                 │  │
│  │     - 0-1 years: New Graduate                                 │  │
│  │     - 1-5 years: Early Career                                 │  │
│  │     - 6-15 years: Mid-Career                                  │  │
│  │     - 15+ years: Senior/Executive                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 3: POSITION-BY-POSITION LOOP                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ FOR EACH POSITION in work experience:                         │  │
│  │                                                               │  │
│  │  1. Assess each individual bullet (Strong/Medium/Weak)        │  │
│  │  2. Analyze bullets collectively as a set                     │  │
│  │  3. Compare against requirements for position number          │  │
│  │  4. Generate reordering recommendations                       │  │
│  │  5. Identify consolidation opportunities                      │  │
│  │  6. Note cross-position redundancies                          │  │
│  │  7. Count action verb categories                              │  │
│  │                                                               │  │
│  │ END FOR                                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 4: SCORING                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Calculate scores across 4 categories:                         │  │
│  │                                                               │  │
│  │  1. ATS Format (/40 points)                                   │  │
│  │     - Section presence, order, bullet count, word count       │  │
│  │                                                               │  │
│  │  2. Content Quality (/20 points)                              │  │
│  │     - Character length, date format, formatting consistency   │  │
│  │                                                               │  │
│  │  3. Quantifiable Impact (/20 points)                          │  │
│  │     - Metric density, impact statements                       │  │
│  │                                                               │  │
│  │  4. Skills & Keywords (/20 points)                            │  │
│  │     - Hard skills, soft skills, distribution                  │  │
│  │                                                               │  │
│  │  TOTAL: /100 points                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 5: CROSS-RESUME ANALYSIS                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ After analyzing ALL positions:                                │  │
│  │                                                               │  │
│  │  1. Compile cross-position redundancy report                  │  │
│  │  2. Create capability inventory                               │  │
│  │  3. Identify skill/tool repetition across positions           │  │
│  │  4. Calculate total consolidation opportunities               │  │
│  │  5. Generate overall optimization strategy                    │  │
│  │  6. Resume-wide verb distribution summary                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 6: OUTPUT REPORT                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Generate comprehensive analysis report:                       │  │
│  │                                                               │  │
│  │  1. Executive Summary (score, grade, experience level)        │  │
│  │  2. Section-by-section analysis                               │  │
│  │  3. Position-by-position analysis with recommendations        │  │
│  │  4. Redundancy report                                         │  │
│  │  5. Priority fixes (Critical/High/Medium/Optional)            │  │
│  │  6. Specific recommendations with before/after examples       │  │
│  │  7. Action verb distribution analysis                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 7: NEXT STEPS OPTIONS                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Options for user:                                            │  │
│  │                                                               │  │
│  │   A) Optimize specific bullets (Mode 2)                       │  │
│  │   B) Compare resume against a job description (Mode 3)        │  │
│  │   C) Provide revised full resume for re-analysis              │  │
│  │   D) Focus on specific section/position for deep dive         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                   ┌─────────┼─────────┬─────────┬─────────┐
                   │         │         │         │         │
                   ▼         ▼         ▼         ▼         ▼
              ┌────────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌──────┐
              │MODE 2  │ │MODE 3 │ │RE-    │ │DEEP   │ │ DONE │
              │Bullet  │ │JD     │ │ANALYZE│ │ DIVE  │ │      │
              │Optimize│ │Compare│ │       │ │       │ │      │
              └────────┘ └───────┘ └───────┘ └───────┘ └──────┘
```

---

## Key Decision Points

| Step | Decision | Outcome |
|------|----------|---------|
| Step 1 | Missing sections? | Flag as critical issues |
| Step 2 | Experience level? | Determines word count and bullet targets |
| Step 3 | Bullet quality? | Categorize as Strong/Medium/Weak |
| Step 4 | Score thresholds? | Determines overall grade |
| Step 7 | User choice? | Routes to appropriate next mode |

---

## Token Usage

| Phase | Estimated Tokens |
|-------|-----------------|
| Structural Analysis | ~200 |
| Experience Calculation | ~100 |
| Position Loop (per position) | ~300 |
| Scoring | ~200 |
| Cross-Resume Analysis | ~300 |
| Output Report | ~800-1500 |
| **Total (6 positions)** | **~2500-3500** |
