# ADR-008: Two-Step Evidence Verification Policy

- **Status:** Proposed
- **Date:** 2026-01-19
- **Deciders:** mkaplan, Claude
- **Consulted:** ADR-007 (Keyword Hub), G29 (Metric Preservation)
- **Informed:** Core Optimization Engine

---

## Context and Problem

When a user manually requests a keyword (e.g., "I know Python, add it") that is not found in their provided Job History, the AI faces a dilemma:
1.  **Fabricate:** Invent a project or task that uses Python to satisfy the user.
2.  **Reject:** Refuse to include Python, frustrating the user.
3.  **Bridge:** Mention Python vaguely without evidence.

Blindly satisfying user requests for unverified skills leads to resumes that fail background checks or technical interviews, damaging the project's reputation for "defensible impact."

## Decision Drivers

- **Integrity:** The system must not lie.
- **Supportiveness:** The system should help the user present their *entire* relevant skill set, even if the primary resume doc is incomplete.
- **Safety:** The user must be warned of the "Liability Gap" created by unverified claims.

## Decision Outcome

**Chosen Solution: The Two-Step Verification & Lightweight Integration Pattern**

We will enforce a two-step policy for all custom/unverified keyword requests:

### Step 1: Verification & Warning
The system must scan the Job History for evidence of the requested skill. if no evidence is found:
1.  **Visual Flag:** Mark the skill as "Unverified."
2.  **Blocking Confirmation:** Require the user to click a "Proceed Anyway" acknowledgment before generation.

### Step 2: Lightweight Integration
If the user confirms they want to use an unverified skill, the generation prompt MUST NOT fabricate an achievement. Instead, it must follow "Lightweight Integration":
- **Pattern:** `exposure to`, `familiarity with`, `leveraged [Skill] to support [Workflow]`.
- **Constraint:** Use unverified keywords only in contexts where specific "wins" are not claimed (e.g., Skills Summary or secondary bullet clauses).

## Consequences

- **Pros:**
    - Resumes remain 100% defensible.
    - Users can still include minor skills or those from older roles without full evidence.
    - Prevents the AI from hallucinating metrics for unverified tools.
- **Cons:**
    - Requires more complex prompt engineering to ensure the AI differentiates between "Verified" and "Unverified" lists.

## Relationship to Guardrails

This policy is codified as **G32: Custom Keyword Evidence**.

## Alternatives Considered

- **Automatic Lightweighting:** AI automatically switches to lightweight mode for any unrecorded skill. (Rejected: Deprives the user of the chance to provide missing metrics).
- **Hard Rejection:** Refuse all unverified keywords. (Rejected: Too restrictive; users often have minor skills they haven't written bullets for yet).
