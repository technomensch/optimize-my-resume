# Core Rules and Guardrails

This directory contains the central "Rules-as-Code" modules that govern the Optimize-My-Resume logic. These modules are invoked at different phases of the workflow to ensure data integrity, content authenticity, and output quality.

## Core Modules

| Module | Purpose | Phase Impact |
| :--- | :--- | :--- |
| [`adjacent-technical.md`](adjacent-technical.md) | Distinguishes between hands-on engineering and technical-adjacent roles. | Phase 2 |
| [`fit-thresholds.md`](fit-thresholds.md) | Defines scoring calibration and stop-score penalties. | Phase 1 & 2 |
| [`format-rules.md`](format-rules.md) | Enforces character limits, symbol usage, and verb diversity. | Phase 3 & 4 |
| [`industry-context.md`](industry-context.md) | Manages transferability matrices between industries (e.g., Gov to SaaS). | Phase 2 |
| [`keyword-context.md`](keyword-context.md) | Validates "Working WITH" vs. "Writing ABOUT" a technology. | Phase 2 |
| [`metrics-requirements.md`](metrics-requirements.md) | Defines standards for quantifiable impact and metric density. | Phase 1 & 4 |
| [`portfolio-weighting.md`](portfolio-weighting.md) | Applies a 50% discount to personal projects vs. professional experience. | Phase 1 & 2 |
| [`role-type-validation.md`](role-type-validation.md) | Prevents conflating distinct roles (e.g., BA vs. PM tenure). | Phase 2 |
| [`verb-categories.md`](verb-categories.md) | Categorizes action verbs into Built, Lead, Managed, Improved, and Collaborate. | Phase 3 & 4 |

## Guardrail Hierarchy

The system uses a 3-layer defense strategy:

1.  **Integrity Gates (Red)**: Fondational safety (Data loss prevention, plan consolidation).
2.  **Validation Core (Blue)**: Content calibration (Role-type validation, industry context).
3.  **Production Hardening (Green)**: Output quality (Budget enforcement, symbol validation).

For a visual representation, see `wireframes/rules-and-guardrails-ascii.md`.
