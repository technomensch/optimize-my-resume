# Core Rules and Guardrails

This directory contains the central "Rules-as-Code" modules that govern the Optimize-My-Resume logic. These modules are invoked at different phases of the workflow to ensure data integrity, content authenticity, and output quality.

## Core Modules

| Module | Purpose | Phase Impact |
| :--- | :--- | :--- |
| [`adjacent-technical.md`](adjacent-technical.md) | Distinguishes between hands-on engineering and technical-adjacent roles. | Bullet Optimizer |
| [`fit-thresholds.md`](fit-thresholds.md) | Defines scoring calibration and stop-score penalties. | Resume Analysis & Bullet Optimizer |
| [`format-rules.md`](format-rules.md) | Enforces character limits, symbol usage, and verb diversity. | Job Fit Analyzer & Narrative Generator |
| [`industry-context.md`](industry-context.md) | Manages transferability matrices between industries (e.g., Gov to SaaS). | Bullet Optimizer |
| [`keyword-context.md`](keyword-context.md) | Validates "Working WITH" vs. "Writing ABOUT" a technology. | Bullet Optimizer |
| [`metrics-requirements.md`](metrics-requirements.md) | Defines standards for quantifiable impact and metric density. | Resume Analysis & Narrative Generator |
| [`portfolio-weighting.md`](portfolio-weighting.md) | Applies a 50% discount to personal projects vs. professional experience. | Resume Analysis & Bullet Optimizer |
| [`role-type-validation.md`](role-type-validation.md) | Prevents conflating distinct roles (e.g., BA vs. PM tenure). | Bullet Optimizer |
| [`verb-categories.md`](verb-categories.md) | Categorizes action verbs into Built, Lead, Managed, Improved, and Collaborate. | Job Fit Analyzer & Narrative Generator |

## Guardrail Hierarchy

The system uses a 3-layer defense strategy:

1.  **Integrity Gates (Red)**: Fondational safety (Data loss prevention, plan consolidation).
2.  **Validation Core (Blue)**: Content calibration (Role-type validation, industry context).
3.  **Production Hardening (Green)**: Output quality (Budget enforcement, symbol validation).

For a visual representation, see `wireframes/rules-and-guardrails-ascii.md`.
