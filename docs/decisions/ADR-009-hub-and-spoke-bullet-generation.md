# ADR-009: Hub-and-Spoke Bullet Generation Architecture

- **Status:** Proposed
- **Date:** 2026-01-28
- **Deciders:** mkaplan, Claude
- **Consulted:** ADR-004 (Shadow Modularization), Guardrail #29, ENH-002
- **Informed:** Core GUI Developers, Bullet Optimizer Module

---

## Context and Problem

The project currently supports two primary interfaces for job application optimization:
1.  **Local GUI:** `src/components/Should-I-Apply-local.jsx` (React)
2.  **Web Artifact:** `claude-artifacts/Should-I-Apply-webgui.jsx` (Mirror)

As the logic for bullet generation becomes increasingly complex (e.g., handling solo portfolio projects, synthetic metrics, and specific verb constraints), maintaining duplicate prompt logic in both files leads to "Logic Drift." Updates made to the local version are often missed in the web version, or vice versa, resulting in inconsistent resume quality depending on the interface used.

## Decision Drivers

- **Maintainability:** Logic should be defined once and reused.
- **Consistency:** Users should get the same high-quality resume bullets regardless of which UI they use.
- **Scalability:** New guardrails should be easy to inject into all generation flows simultaneously.

## Decision Outcome

**Chosen Solution: The Hub-and-Spoke Delegation Pattern**

We will implement a "Hub-and-Spoke" model for all content generation:

### The Hub: Modular Logic Module
- All instructions, guardrails, and formatting rules for bullet generation are consolidated into a single Markdown-based logic module: `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md`.
- This file is the "Single Source of Truth."

### The Spokes: GUI Components
- The GUI components (`Should-I-Apply-local.jsx` and `Should-I-Apply-webgui.jsx`) serve only as **Orchestrators**.
- Their prompts are updated to **delegate** the heavy lifting:
  - *"Follow the instructions defined in @[bo_bullet-generation-instructions.md] to generate the optimized content."*
- Metadata like Job History and JD are passed from the Spokes to the Hub.

## Consequences

- **Pros:**
    - Zero duplication of complex prompt logic.
    - Synchronized updates: One change to the Hub immediately updates all Spokes.
    - Improved testability: The Hub can be tested independently of the React UI.
- **Cons:**
    - Requires robust "Context Management" to ensure the logic module is always loaded into the LLM's workspace before generation is triggered.

## Implementation Plan
1.  Create the Hub (`bo_bullet-generation-instructions.md`).
2.  Update the Spokes to reference the Hub.
3.  Enforce consistency via the Shadow Sync protocol.

## Alternatives Considered

- **Hard-Coded JavaScript Validators:** (Partially implemented in Conversation 78b652ec) - While good for structural validation, JS is less effective at high-level narrative and tone enforcement compared to a structured Markdown prompt.
- **Symmetric Mirroring:** Manually keeping the two GUI files identical. (Rejected: High human error probability and overhead).
