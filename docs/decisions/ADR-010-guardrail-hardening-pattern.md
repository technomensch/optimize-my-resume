# ADR-010: Three-Layer Guardrail Hardening Pattern

- **Status:** Accepted
- **Date:** 2026-01-28
- **Deciders:** mkaplan, Antigravity
- **Consulted:** Issue #97, Issue #85
- **Related:** ADR-009 (Hub-and-Spoke), ADR-005 (Recency Anchors)

---

## Context and Problem

In long-context interactions (4,000+ lines of codebase context), LLMs exhibit "Instructional Saturation," where they ignore passive constraints buried in large system prompts. This leads to "Vibe-Coding Drift," where the model defaults to its training data training rather than adhering to project-specific rules (e.g., using "Phase 1" instead of "Resume Analysis", failing to use Markdown lists).

Single-layer enforcement (putting rules in `PROJECT-INSTRUCTIONS.md`) proved insufficient, with failure rates reaching ~40% for specific formatting rules like G9 (Verb Diversity) and G35 (Gerund Ban).

## Decision Drivers

- **Reliability:** The system must enforce negative constraints 100% of the time.
- **Auditability:** Errors must be self-detected by the agent without user intervention.
- **Consistency:** Outputs must match the spec regardless of the underlying model (Sonnet, Gemini).

## Decision Outcome

We are adopting a **Three-Layer Guardrail Hardening Pattern** for all generative workflows.

### Layer 1: Visible Pre-Flight Verification
The agent **MUST** output a visible table or list acknowledging the specific rules it is about to follow *before* generating content.
*   **Mechanism:** Forced output instruction (e.g., "Step 0: Pre-flight Check").
*   **Purpose:** Primes the model's attention mechanism on the constraints.

### Layer 2: Logic Hubs (Single Source of Truth)
General instructions are moved out of the system prompt and into task-specific Markdown modules (Logic Hubs) that are read JIT (Just-In-Time).
*   **Mechanism:** `view_file` on `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md`.
*   **Purpose:** Reduces context noise; ensures the active instructions are at the top of the "Active Memory" stack.

### Layer 3: Output Validator (Negative Checklist)
A mandatory, separate inspection step performed *after* generation but *before* final delivery.
*   **Mechanism:** `bo_output-validator.md`.
*   **Purpose:** Catches "hallucinations" and "drift" by checking for specific failure modes (e.g., "Contains em-dash", "Bar graph % != actual count").

## Consequences

- **Pros:**
    - Dramatically reduces "hallucination" of formats.
    - Forces self-correction without user prompts.
    - Decouples rule complexity from the main system prompt.
- **Cons:**
    - Increases token consumption (requires reading 2-3 extra files per turn).
    - Adds latency to the generation loop.

## Compliance
All future generative workflows (Cover Letters, LinkedIn Profiles) MUST implement this 3-layer pattern.
