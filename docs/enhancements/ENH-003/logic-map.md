# Logic Map: Summary vs. Bullet Generation (v9.3.1)

This document formalizes the separation of concerns between the **Professional Summary Hub** (`ng_summary-generation.md`) and the **Bullet Optimizer Hub** (`bo_bullet-generation-instructions.md`).

## 1. Governance & Separation of Concerns

| Concern | Responsibility | Hub |
|---|---|---|
| **Executive Synthesis** | Professional Summary | Summary Hub |
| **Quantified Achievement** | Resume Bullets | Bullet Hub |
| **Narrative Synthesis** (Synthesis across roles) | Professional Summary | Summary Hub |
| **Metric Traceability** (Summary to Bullets) | Cross-Hub Verification | **Bullet Hub (Source)** -> Summary Hub |
| **Keyword Optimization** | Both | Shared Logic / Hub Delegation |

---

## 2. Guardrail Mapping

| Guardrail ID | Name | Assigned Hub | Reason |
|---|---|---|---|
| **#3** | Summary Abstraction | Summary Hub | Prevents summary from mirroring bullets. |
| **#13** | Metric Reconciliation | Summary Hub | Verifies summary claims against bullet facts. |
| **#15** | Phrase Repetition | Shared / Global | Audit across all visible content. |
| **#29** | Metric Preservation | Bullet Hub | Core data integrity for achievements. |
| **#30** | Industry Tuning | Bullet Hub | Contextualizes specific technical wins. |
| **#32** | Keyword Evidence | Shared | Validates user intent against history. |
| **#33** | Narrative Fit | Bullet Hub | Ensures achievements align with JD requirements. |

---

## 3. Transition Trigger: "Bullet-First" Priority

To ensure the Professional Summary is an **abstraction** and not a **dictation**, the following execution order is enforced during the `Optimize My Application` flow:

1. **Step 1: Bullet Optimization (Bullet Hub)**
   - Generate/Update resume bullets based on JD requirements.
   - Run Narrative Fit (#33) and Metric Preservation (#29).
   - *Result:* Verifiable foundation of facts.

2. **Step 2: Summary Generation (Summary Hub)**
   - **Trigger:** Bullet optimization output is passed as context.
   - **Requirement:** Generate summary using the optimized bullets as primary source.
   - **Verification:** Run Summary Abstraction (#3) and Metric Reconciliation (#13) against the *newly optimized* bullets.

---

## 4. Rogue Logic Cleanup (Action Items for v9.3.2)

- **Move from `ng_summary-generation.md` to `bo_bullet-generation-instructions.md`:**
  - Instructions for addressing JD requirements in individual bullets.
  - Bullet-specific keyword placement logic.
- **Refactor in `ng_summary-generation.md`:**
  - Update `Step 2: Extract JD Keywords` (Lines 298+) to ensure it doesn't try to "optimize" bullets.
  - Update `Step 5: Maintain Metrics` (Lines 376+) to explicitly reference the Bullet Hub's output.
