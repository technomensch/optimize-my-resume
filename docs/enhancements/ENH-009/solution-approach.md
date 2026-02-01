# Solution Approach: Guardrail Registry (ENH-009)

## Strategy: "The Phonebook Pattern"

We will implement a **Centralized Registry Pattern** where the `guardrail-registry.md` acts as a lookup table (Index) but NOT the implementation repository.

### 1. The Registry Schema (`docs/governance/guardrail-registry.md`)
```markdown
| ID | Name | Type | Scope | SSoT Path | Criticality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| G-001 | Metric Traceability | Content | Resume Analyzer | `.../ra_quality-gates-guardrails.md` | HIGH |
| G-042 | Justified Access | Governance | Agent Core | `docs/governance/agent-governance.md` | CRITICAL |
```

### 2. ID Unification Strategy
- **Stage 1 (Mapping):** Keep existing IDs in code, but map them in the registry (e.g., `G-001 (Legacy #1)`).
- **Stage 2 (Normalization):** Update references in `PROJECT-INSTRUCTIONS.md` to use the unified `G-XX` format.
- **Stage 3 (Deprecation):** Remove legacy ID support.

**Decision for ENH-009:** We will perform **Stage 1 (Mapping)** and **Stage 2 (Normalization)** for high-priority rules immediately.

### 3. File Structure
- **New File:** `docs/governance/guardrail-registry.md`
- **Updated:** `PROJECT-INSTRUCTIONS.md` (Add reference to registry)
- **Updated:** `docs/governance/agent-governance.md` (Add Agent Governance rules to registry)

### 4. Integration with Agent Workflow
- Add a `<guardrail_lookup>` protocol to the System Prompts/Instructions:
  > "If a rule referencing 'G-XX' is cited but not found in context, consult `docs/governance/guardrail-registry.md` to locate the Source of Truth."

## Risks
- **Broken Links:** Moving rules might break existing "Silent Sync" markers.
- **Token Overhead:** Adding a large table might consume tokens.
  - *Mitigation:* The registry should be compact; full text remains in modules.
