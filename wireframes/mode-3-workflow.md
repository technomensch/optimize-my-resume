# Mode 3 Workflow: JD Comparison

<!-- Version: 5.0 -->
<!-- Purpose: Visual workflow diagram for Mode 3 with fit assessment -->
<!-- Last Updated: December 2024 -->

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│           USER PROVIDES JOB DESCRIPTION FOR COMPARISON               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│              PHASE 1: INITIAL FIT ASSESSMENT                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Step 1: Extract Critical Requirements from JD                 │  │
│  │  - Domain expertise                                           │  │
│  │  - Specialized platforms                                      │  │
│  │  - Programming languages                                      │  │
│  │  - Technical specializations                                  │  │
│  │  - Certifications                                             │  │
│  │  - Industry experience                                        │  │
│  │                                                               │  │
│  │ Step 2: Compare Against Job History                           │  │
│  │  - Search job history file for each requirement               │  │
│  │  - Categorize: Direct / Tangential / Transferable / No Match  │  │
│  │                                                               │  │
│  │ Step 3: Calculate Preliminary Fit                             │  │
│  │  - Core qualifications (50%)                                  │  │
│  │  - Critical requirements (30%)                                │  │
│  │  - Preferred qualifications (20%)                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │  FIT PERCENTAGE │
                    │    DECISION     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┬────────────────────┐
        │                    │                    │                    │
        ▼                    ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ 90-100% │         │ 80-89%  │         │ 75-79%  │         │  ≤74%   │
   │         │         │         │         │         │         │         │
   │EXCELLENT│         │  GOOD   │         │  WEAK   │         │  POOR   │
   └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
        │                   │                   │                   │
        │                   │                   │                   │
        ▼                   ▼                   ▼                   ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
   │PROCEED  │         │PHASE 2  │         │PHASE 3A │         │PHASE 3B │
   │TO BULLET│         │GAP      │         │BRIEF    │         │ULTRA-   │
   │GENERATION         │INVESTIG.│         │EXIT     │         │BRIEF    │
   └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
        │                   │                   │                   │
        │                   ▼                   │                   │
        │    ┌─────────────────────────────┐    │                   │
        │    │     PHASE 2: GAP            │    │                   │
        │    │     INVESTIGATION           │    │                   │
        │    │  ┌───────────────────────┐  │    │                   │
        │    │  │ Show user:            │  │    │                   │
        │    │  │ - Fit assessment      │  │    │                   │
        │    │  │ - Critical gaps       │  │    │                   │
        │    │  │ - Questions about     │  │    │                   │
        │    │  │   missing experience  │  │    │                   │
        │    │  └───────────────────────┘  │    │                   │
        │    └─────────────┬───────────────┘    │                   │
        │                  │                    │                   │
        │         ┌────────┴────────┐           │                   │
        │         │ User confirms   │           │                   │
        │         │ experience?     │           │                   │
        │         └────────┬────────┘           │                   │
        │                  │                    │                   │
        │      ┌───────────┼───────────┐        │                   │
        │      │ YES       │           │ NO     │                   │
        │      ▼           │           ▼        │                   │
        │ ┌─────────┐      │    ┌─────────────┐ │                   │
        │ │Capture  │      │    │User chooses:│ │                   │
        │ │new      │      │    │A) Generate  │ │                   │
        │ │experience      │    │   anyway    │ │                   │
        │ │         │      │    │B) Skip      │ │                   │
        │ │Update   │      │    │   (Recomm.) │ │                   │
        │ │job      │      │    └──────┬──────┘ │                   │
        │ │history  │      │           │        │                   │
        │ └────┬────┘      │    ┌──────┴──────┐ │                   │
        │      │           │    │             │ │                   │
        │      │           │    ▼             ▼ │                   │
        │      │           │ ┌─────┐    ┌─────────┐                 │
        │      │           │ │ A   │    │ B       │                 │
        │      │           │ │     │    │         │                 │
        │      │           │ │Proc.│    │Exit     │                 │
        │      │           │ │w/   │    │         │                 │
        │      │           │ │warn │    │         │                 │
        │      │           │ └──┬──┘    └────┬────┘                 │
        │      │           │    │            │                      │
        │      ▼           │    │            │                      │
        │ ┌─────────┐      │    │            │                      │
        │ │Recalc.  │      │    │            │                      │
        │ │fit %    │      │    │            │                      │
        │ └────┬────┘      │    │            │                      │
        │      │           │    │            │                      │
        └──────┼───────────┼────┘            │                      │
               │           │                 │                      │
               ▼           │                 │                      │
┌──────────────────────────┴─────────────────┴──────────────────────┘
│                                                                    │
│                  PROCEED TO BULLET GENERATION                      │
│                                                                    │
└────────────────────────────┬───────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SECTION 1: HEADER                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ # **TAILORED BULLETS FOR [COMPANY] - [ROLE TITLE]**           │  │
│  │ **Organized by Position (Reverse Chronological)**             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SECTION 2: POSITION BLOCKS                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ FOR EACH relevant position:                                   │  │
│  │                                                               │  │
│  │   ### POSITION [N]: [Job Title] | [Company]                   │  │
│  │   Duration: [Date Range]                                      │  │
│  │                                                               │  │
│  │   BULLET 1 (STRONGEST):                                       │  │
│  │   [Optimized bullet in code block]                            │  │
│  │   Why this matches: ✅ [Match points]                         │  │
│  │   Verb category: [Category (Color)]                           │  │
│  │                                                               │  │
│  │   BULLET 2, 3, etc...                                         │  │
│  │                                                               │  │
│  │ END FOR                                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SECTION 3: EXECUTIVE SUMMARY                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Validation Report:                                            │  │
│  │  - Character count analysis (all bullets)                     │  │
│  │  - Word count analysis                                        │  │
│  │  - Bullet count distribution                                  │  │
│  │  - Action verb distribution                                   │  │
│  │  - Verb rebalancing recommendations (if needed)               │  │
│  │  - Validation against all requirements                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SECTION 4: QUALIFICATION ASSESSMENT                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ BOTTOM LINE:                                                  │  │
│  │  - Overall Fit: [X]%                                          │  │
│  │  - Why you're a strong candidate (✅ list)                    │  │
│  │  - Gaps or concerns (⚠️ list)                                 │  │
│  │  - Recommendation: APPLY / MAYBE / SKIP                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SECTION 5: PLAIN TEXT FILE                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Generate downloadable .txt file:                              │  │
│  │  - Title: "Optimized Resume Bullets for [Job] at [Company]"   │  │
│  │  - Bullets organized by position                              │  │
│  │  - Rebalancing changes applied                                │  │
│  │  - Save to /mnt/user-data/outputs/                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                       ┌───────────┐
                       │   DONE    │
                       └───────────┘


═══════════════════════════════════════════════════════════════════════
                        EXIT PATHS (STOP ROUTES)
═══════════════════════════════════════════════════════════════════════

PHASE 3A: BRIEF EXIT (75-79% fit)
┌─────────────────────────────────────────────────────────────────────┐
│ Output (~150-250 words):                                            │
│  - ⚠️ APPLICATION STOPPED - INSUFFICIENT MATCH                      │
│  - Job: [Title] at [Company]                                        │
│  - Overall Fit: [XX]%                                               │
│  - Why this isn't a match (1-2 sentences)                           │
│  - Critical missing requirements (4-6 items)                        │
│  - Your strengths (4-5 items)                                       │
│  - Recommendation for better role types                             │
│  - "Ready to analyze a better-fitting JD?"                          │
└─────────────────────────────────────────────────────────────────────┘

PHASE 3B: ULTRA-BRIEF EXIT (≤74% fit)
┌─────────────────────────────────────────────────────────────────────┐
│ Output (~50-100 words):                                             │
│  - ⚠️ APPLICATION STOPPED - FUNDAMENTAL MISMATCH                    │
│  - Job: [Title] at [Company]                                        │
│  - Overall Fit: [XX]%                                               │
│  - One sentence explaining mismatch                                 │
│  - Recommendation: Skip, focus on [role types]                      │
│  - "Ready to analyze your next JD?"                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Decision Matrix

| Fit % | Route | Output Type | Token Usage |
|-------|-------|-------------|-------------|
| **90-100%** | Proceed immediately | Full bullet generation (14+ bullets) | HIGH (~3000-5000) |
| **80-89%** | Ask user about gaps | Full investigation + bullets if proceed | MEDIUM-HIGH (~2000-5000) |
| **75-79%** | Stop with brief summary | Brief exit (~150-250 words) | LOW (~200-300) |
| **≤74%** | Stop with ultra-brief | Ultra-brief exit (~50-100 words) | MINIMAL (~100-150) |

---

## Token Savings from Fit Assessment

| Scenario | Without Assessment | With Assessment | Savings |
|----------|-------------------|-----------------|---------|
| 90%+ fit | ~4000 tokens | ~4000 tokens | 0% |
| 80-89% fit | ~4000 tokens | ~4500 tokens | -12% (investigation added) |
| 75-79% fit | ~4000 tokens | ~300 tokens | **92%** |
| ≤74% fit | ~4000 tokens | ~150 tokens | **96%** |

---

## Key Decision Points

| Phase | Decision | Outcome |
|-------|----------|---------|
| Phase 1 | Fit percentage? | Routes to appropriate phase |
| Phase 2 | User confirms experience? | Capture & recalculate OR exit |
| Phase 2 | User denies but wants bullets? | Proceed with warning |
| Section 3 | Verb imbalance? | Generate rebalancing recommendations |
