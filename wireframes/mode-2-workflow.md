# Mode 2 Workflow: Bullet Optimization

<!-- Version: 5.0 -->
<!-- Purpose: Visual workflow diagram for Mode 2 -->
<!-- Last Updated: December 2024 -->

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│              USER PROVIDES BULLET(S) TO OPTIMIZE                     │
│                  (No Job Description)                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 1: INITIAL GREETING                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Display welcome message:                                      │  │
│  │  - Explain the optimization workflow                          │  │
│  │  - Set expectations (what we will/won't do)                   │  │
│  │  - Request bullet + optional context                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 2: PARSE AND DIAGNOSE                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ For each bullet, identify:                                    │  │
│  │  - Action: What was done?                                     │  │
│  │  - Scope: Team size, users, budget, frequency                 │  │
│  │  - Tools: Systems, methods, technologies                      │  │
│  │  - Outcome: Speed, revenue, cost, quality, risk               │  │
│  │  - Missing: Metrics, baseline, timeframe, business impact     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │ Fewer than 2    │
                    │ bullets for     │
                    │ this position?  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ YES          │              │ NO
              ▼              │              ▼
┌─────────────────────┐      │    ┌─────────────────────┐
│ Ask user preference:│      │    │ Continue to Step 3  │
│                     │      │    │                     │
│ Option 1: Optimize  │      │    └──────────┬──────────┘
│   just these        │      │               │
│                     │      │               │
│ Option 2: Create    │      │               │
│   full job summary  │      │               │
└──────────┬──────────┘      │               │
           │                 │               │
    ┌──────┴──────┐          │               │
    │             │          │               │
    ▼             ▼          │               │
┌───────┐   ┌───────────┐    │               │
│Opt 1  │   │Opt 2      │    │               │
│       │   │           │    │               │
│Continue   │Go to Job  │    │               │
│to Step 3  │Summary    │    │               │
│       │   │Creation   │    │               │
└───┬───┘   └─────┬─────┘    │               │
    │             │          │               │
    │             ▼          │               │
    │    ┌────────────────┐  │               │
    │    │See shared/     │  │               │
    │    │job-summary-    │  │               │
    │    │creation.md     │  │               │
    │    └────────────────┘  │               │
    │                        │               │
    └────────────────────────┼───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 3: ASK FOLLOW-UP QUESTIONS                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Ask 3-5 targeted questions:                                   │  │
│  │  - Baseline vs. After: "What changed before/after?"           │  │
│  │  - Magnitude: "How many per week/month?"                      │  │
│  │  - Scale: "How many users/customers/teammates?"               │  │
│  │  - Frequency: "Daily? Weekly? Per quarter?"                   │  │
│  │  - Targets: "Was there an SLA, quota, or KPI?"                │  │
│  │                                                               │  │
│  │ SKIP if user says "use safe proxies" or                       │  │
│  │ "I don't have exact numbers"                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │ User provides   │
                    │ answers?        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ YES          │              │ NO / DON'T KNOW
              ▼              │              ▼
┌─────────────────────┐      │    ┌─────────────────────┐
│ Use actual metrics  │      │    │ Use safe proxies:   │
│ from their answers  │      │    │  - Ranges: "~10-15%"│
│                     │      │    │  - Rates: "per week"│
│                     │      │    │  - Relative: "~⅓"   │
└──────────┬──────────┘      │    └──────────┬──────────┘
           │                 │               │
           └─────────────────┼───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 4: GENERATE OUTPUT                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ For each bullet, provide:                                     │  │
│  │                                                               │  │
│  │  BEFORE: [Original bullet]                                    │  │
│  │                                                               │  │
│  │  AFTER: [Optimized bullet with metrics]                       │  │
│  │                                                               │  │
│  │  ALTERNATES:                                                  │  │
│  │   - Leadership-focused version                                │  │
│  │   - Technical version                                         │  │
│  │   - Outcome-first version                                     │  │
│  │                                                               │  │
│  │  Character count: [X]/210                                     │  │
│  │  Verb category: [Category (Color)]                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STEP 5: OFFER NEXT STEPS                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Ask user:                                                     │  │
│  │                                                               │  │
│  │  - "Would you like to optimize more bullets?"                 │  │
│  │  - "Want to create a reusable job summary for this role?"     │  │
│  │  - "Ready to compare against a specific job description?"     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                   ┌─────────┼─────────┬─────────┐
                   │         │         │         │
                   ▼         ▼         ▼         ▼
              ┌────────┐ ┌───────┐ ┌───────┐ ┌──────┐
              │MORE    │ │CREATE │ │MODE 3 │ │ DONE │
              │BULLETS │ │SUMMARY│ │JD     │ │      │
              │        │ │       │ │COMPARE│ │      │
              │(Loop)  │ │       │ │       │ │      │
              └────────┘ └───────┘ └───────┘ └──────┘
```

---

## Key Decision Points

| Step | Decision | Outcome |
|------|----------|---------|
| Step 2 | < 2 bullets? | Offer job summary creation option |
| Step 3 | Has metrics? | Skip questions if user opts for proxies |
| Step 4 | Verb category? | Ensure diversity if multiple bullets |
| Step 5 | User choice? | Loop, create summary, or proceed to Mode 3 |

---

## Token Usage

| Phase | Estimated Tokens |
|-------|-----------------|
| Greeting | ~100 |
| Parse & Diagnose | ~150 per bullet |
| Follow-up Questions | ~100 |
| Generate Output | ~200 per bullet |
| **Total (single bullet)** | **~500-700** |
| **Total (5 bullets)** | **~1500-2000** |
