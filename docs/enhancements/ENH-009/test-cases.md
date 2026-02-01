# Test Cases: ENH-009 Guardrail Registry

## Test Strategy
Verify that the registry acts as a purely navigational layer without duplicating logic (Single Source of Truth violation).

## Test Cases

### TC-001: Registry Existence & Structure
- **Input:** Open `docs/governance/guardrail-registry.md`.
- **Expected:** File exists. Contains Markdown table with columns: ID, Name, Scope, SSoT.
- **Pass/Fail:** [ ]

### TC-002: ID Unification (G-42 Check)
- **Input:** Locate "Justified Access" rule in registry.
- **Expected:** ID is listed as `G-042` (or `G42` mapped to `G-042`).
- **Pass/Fail:** [ ]

### TC-003: Path Resolution
- **Input:** Click the link for `G-001` (Metric Traceability).
- **Expected:** Navigates correctly to `optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md`.
- **Pass/Fail:** [ ]

### TC-004: Gold Master Integration
- **Input:** Search `PROJECT-INSTRUCTIONS.md` for "Guardrail Registry".
- **Expected:** Found reference/link to `docs/governance/guardrail-registry.md`.
- **Pass/Fail:** [ ]

### TC-005: Agent Governance Integration
- **Input:** Check if `docs/governance/agent-governance.md` rules are indexed.
- **Expected:** G-031 (Workflow Lifecycle) and G-042 (Justified Access) are present in the table.
- **Pass/Fail:** [ ]
