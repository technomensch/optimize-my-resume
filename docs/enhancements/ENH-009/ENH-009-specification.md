# Enhancement Specification: Centralized Guardrail Registry

**ID:** ENH-009
**Title:** Centralized Guardrail Registry & ID Unification
**Type:** Hardening / Governance
**Status:** Planning
**Created:** 2026-01-29

## Objective
Initialize sections and synchronize a master registry (`docs/governance/guardrail-registry.md`) for all system guardrails to resolve ID inconsistencies (Numeric vs G-prefix vs Legacy) and fragmentation across files.

## Problem Statement
The current system has guardrails scattered across:
- `PROJECT-INSTRUCTIONS.md` (Gold Master)
- `optimization-tools/.../ra_quality-gates-guardrails.md`
- `wireframes/`
- various `v6.x` plans

IDs are inconsistent (e.g., "Guardrail #6", "G42", "G-10"). This makes it difficult for the AI to "reference" a rule definitively, leading to "Instructional Saturation" and "Vibe-Coding Drift."

## Proposed Solution
1. **Central Registry:** Create `docs/governance/guardrail-registry.md` as the "Phonebook" for all rules.
2. **Standard ID Format:** Unify all IDs to `G-XX` (or map existing ones to this standard).
3. **SSoT Mapping:** Explicitly link each ID to its modular definition file.
4. **Scope Definitions:** Tag each rule as "Content" (Resume Quality) or "Agent" (Behavioral Safety).

## Requirements
- Registry must reference the file path for every rule.
- Registry must clearly distinguish between the "Rule" (Logic) and the "Enforcer" (Validator).
- Must define a "Lookup Protocol" for the agent (e.g., "If unsure, check the registry").

## Success Criteria
- [ ] `guardrail-registry.md` exists.
- [ ] All 30+ existing guardrails are listed.
- [ ] `PROJECT-INSTRUCTIONS.md` references the registry.
