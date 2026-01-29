# Centralized Guardrail Registry

**Version:** 1.0
**Created:** 2026-01-29
**Status:** Active (Source of Truth)
**Purpose:** Single registry for all system guardrails, resolving ID inconsistencies and providing unified lookup

---

## Overview

This registry serves as the **"Phonebook"** for all guardrails across the system. Each guardrail is catalogued with:
- **Unified ID** (G-prefix format)
- **Scope** (Content or Agent)
- **Type** (Validation, Behavioral, or Infrastructure)
- **Priority** (CRITICAL, HIGH, MEDIUM, LOW)
- **Source of Truth** (SSoT link to implementation)

---

## Guardrail Mapping Table

### Content Guardrails (Resume Quality & Formatting)

| G-ID | Name | Scope | Type | Priority | Enforcer | SSoT Link |
|---|---|---|---|---|---|---|
| G1 | Metric Traceability | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G5 | Limitation Visibility | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G8 | Budget Enforcement / Header Schema | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:2` |
| G9 | Verb Diversity | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:3` |
| G11 | Metric Plausibility | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:10` |
| G12 | Recency & Distribution Rules | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:5` |
| G14 | Density & Sequence / Chronology | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:11` |
| G15 | Phrase Uniqueness | Content | Validation | MEDIUM | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:13` |
| G20 | Acronym Expansion | Content | Validation | MEDIUM | bo_bullet-generation-instructions | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G21 | Limitation Visibility (Pre-flight) | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G22 | Symbol & Spacing | Content | Validation | MEDIUM | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:12` |
| G24 | Character Limits | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:9` |
| G29 | Metric Preservation / Data Integrity | Content | Validation | CRITICAL | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:10` |
| G30 | Industry & Role Tuning | Content | Validation | MEDIUM | bo_bullet-generation-instructions | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G33 | Personal Project Metrics | Content | Validation | MEDIUM | bo_bullet-generation-instructions | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G35 | Action Verb Tense Enforcement | Content | Validation | HIGH | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:14` |
| G36 | Visual/Actual Verification | Content | Validation | MEDIUM | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:4` |
| G37 | 5% Threshold Enforcement | Content | Validation | MEDIUM | bo_output-validator | `optimization-tools/bullet-optimizer/bo_output-validator.md:15` |

### System Guardrails (Validation Architecture)

| G-ID | Name | Scope | Type | Priority | Enforcer | SSoT Link |
|---|---|---|---|---|---|---|
| G40 | 3-Layer Unified Redundancy Framework | Agent | Architecture | CRITICAL | Implicit | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` / `docs/knowledge/patterns.md` |
| G41 | Insolvency Deadlock Logic | Agent | Architecture | CRITICAL | Explicit (STOP) | `optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md` |
| G42 | Justified Data Access | Agent | Behavioral | CRITICAL | Manual | `docs/governance/agent-governance.md` |
| G43 | Positional Anchoring | Agent | Behavioral | HIGH | Manual | `docs/knowledge/patterns.md` |
| G44 | Evidence Gate | Agent | Behavioral | HIGH | Manual | `optimization-tools/bullet-optimizer/bo_output-validator.md` |

### Infrastructure & Process Guardrails

| G-ID | Name | Scope | Type | Priority | Enforcer | SSoT Link |
|---|---|---|---|---|---|---|
| G31 | Git Governance & Workflow Lifecycle | Agent | Infrastructure | CRITICAL | Manual | `docs/governance/agent-governance.md` |
| G36* | Local Tracking Persistence | Agent | Infrastructure | HIGH | Manual | `docs/governance/agent-governance.md` |

---

## Scope Definitions

### Content Scope
Guardrails affecting **resume bullet quality, formatting, and presentation**. Enforced during generation via `bo_output-validator.md` checklist.

**Examples:** G1 (Metric Traceability), G9 (Verb Diversity), G24 (Character Limits)

### Agent Scope
Guardrails affecting **agent behavior, access patterns, and system integrity**. Enforced during development via agent protocols.

**Examples:** G40 (3-Layer Validation), G41 (Deadlock Logic), G42 (Justified Access)

---

## Lookup Protocol

When unsure about a guardrail:

1. **Identify the Context:**
   - Are you generating resume content? → Check **Content Guardrails**
   - Are you modifying agent behavior? → Check **Agent Scope**
   - Are you changing system architecture? → Check **System Guardrails**

2. **Locate the Guardrail:**
   - Search this table by G-ID (e.g., "G24")
   - Or search by Name (e.g., "Character Limits")

3. **Access the Source of Truth:**
   - Follow the **SSoT Link** to the implementation file
   - Read the full rule definition and examples

4. **Apply the Rule:**
   - Implement the specific validation or behavior
   - If unsure, **STOP and ask for clarification** (per project governance)

---

## ID Reconciliation

### Legacy to Unified Mapping

**Complete Dual-ID Resolution Map** (Legacy ↔ Modern):

| Legacy ID | G-Prefix ID | Name | Scope | Status |
|---|---|---|---|---|
| 1 | G1 | Metric Traceability | Content | ✅ ACTIVE |
| 2 | G2 | Chronological Validation | Content | ✅ ACTIVE |
| 3 | G3 | Summary Abstraction | Content | ✅ ACTIVE |
| 4 | G4 | Validity Heuristic Check | Content | ✅ ACTIVE |
| 5 | G5 | Limitation Enforcement | Content | ✅ ACTIVE |
| 6 | G6 | Data Loss Prevention | Content | ✅ ACTIVE |
| 7 | G7 | Skill Classification | Content | ✅ ACTIVE |
| 8 | G8 | Budget Enforcement | Content | ✅ ACTIVE |
| 9 | G9 | Position Verb Diversity | Content | ✅ ACTIVE |
| 10 | G10 | Keyword Density | Content | ✅ ACTIVE |
| 11 | G11 | Metric Plausibility | Content | ✅ ACTIVE |
| 12 | G12 | Recency Weighting | Content | ✅ ACTIVE |
| 13 | G13 | Summary Metric Reconciliation | Content | ✅ ACTIVE |
| 14 | G14 | Quality Gate Failure Protocol | Content | ✅ ACTIVE |
| 15 | G15 | Phrase Repetition Enforcement | Content | ✅ ACTIVE |
| 16 | G16 | Master Skills Inventory | Content | ✅ ACTIVE |
| 17 | G17 | Scope Attribution | Content | ✅ ACTIVE |
| 18 | G18 | Cross-Phase Consistency | Content | ✅ ACTIVE |
| 19 | G19 | Fit Score Consistency | Content | ✅ ACTIVE |
| 20 | G20 | Acronym Expansion | Content | ✅ ACTIVE |
| 21 | G21 | Limitation Bullet Cross-Check | Content | ✅ ACTIVE |
| 22 | G22 | Em-Dash Validation | Content | ✅ ACTIVE |
| 23 | G23 | User State Persistence | Content | ✅ ACTIVE |
| 24 | G24 | Alternatives Presentation | Content | ✅ ACTIVE |
| 25 | G25 | Confirmation Tracking | Content | ✅ ACTIVE |
| 26 | G26 | Output Structure Consistency | Content | ✅ ACTIVE |
| 27 | G27 | Input Type Detection | Content | ✅ ACTIVE |
| 28 | G28 | Bullet Grouping Verification | Content | ✅ ACTIVE |
| 29 | G29 | Metric Preservation | Content | ✅ ACTIVE |
| 30 | G30 | Industry & Role Tuning | Content | ✅ ACTIVE |
| 31 | G31 | Git Governance & Workflow Lifecycle | Agent | ✅ ACTIVE |
| 32 | G32 | Custom Keyword Evidence | Content | ✅ ACTIVE |
| (new) | G33 | Personal Project Metrics / Narrative Fit | Content | ✅ ACTIVE |
| 34 | G34 | Markdown Bullet Enforcement | Content | ✅ ACTIVE |
| (new) | G35 | Action Verb Tense Enforcement | Content | ✅ ACTIVE |
| 36 | G36 | Visual Math Integrity / Local Tracking | Agent | ✅ ACTIVE |
| 37 | G37 | Verb Distribution Threshold | Content | ✅ ACTIVE |

**Standardization Status:** All 37 legacy IDs (1-37) mapped to G-prefix format (G1-G37). Standardization completed **2026-01-29 (v9.3.5.6)**. Primary SSoT file (ra_quality-gates-guardrails.md) updated.

---

## Related Documentation

- **Agent Governance:** [docs/governance/agent-governance.md](./agent-governance.md)
- **Output Validator:** [optimization-tools/bullet-optimizer/bo_output-validator.md](../../optimization-tools/bullet-optimizer/bo_output-validator.md)
- **Bullet Generation Hub:** [optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md](../../optimization-tools/bullet-optimizer/bo_bullet-generation-instructions.md)
- **Design Patterns:** [docs/knowledge/patterns.md](../knowledge/patterns.md)
- **Quality Gates:** [optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md](../../optimization-tools/resume-analyzer/ra_quality-gates-guardrails.md)

---

## Guardrail Creation Standards (For Future Guardrails)

### Naming Convention
**All guardrails MUST use G-prefix numeric format:** `G#` (e.g., G1, G45, G100)

**Policy Effective:** 2026-01-29 (v9.3.5.6+)

### Required Metadata for New Guardrails
When creating a new guardrail, document:

```xml
<guardrail id="G##" priority="CRITICAL|HIGH|MEDIUM|LOW">
  <name>Descriptive Name</name>
  <scope>Content|Agent|Infrastructure</scope>
  <type>Validation|Behavioral|Architecture|Policy</type>
  <sot_file>path/to/implementation.md</sot_file>
  <description>Brief description of what the guardrail enforces</description>
  <version>1.0 (created YYYY-MM-DD)</version>
</guardrail>
```

### ID Assignment Rules
- **G1-G39:** Content & Validation (Resume Quality)
- **G40-G49:** System & Architecture (Validation Framework)
- **G50-G69:** Agent & Behavioral (Development Protocols)
- **G70-G99:** Infrastructure & Process (Git, Workflows, etc.)
- **G100+:** Reserved for future expansion

### Adding a New Guardrail (Process)
1. **Determine ID:** Check registry for next available number in appropriate range
2. **Create in SSoT file:** Add full definition to the implementation file (e.g., bo_output-validator.md)
3. **Register:** Add entry to guardrail-registry.md with all required metadata
4. **Cross-reference:** Update any files that reference the guardrail
5. **Document in changelog:** Add version history entry

### Deprecation Process
1. Mark guardrail as `[DEPRECATED]` in registry
2. Create replacement guardrail with new ID
3. Update all references to point to replacement
4. Archive old guardrail definition to docs/archive/

---

## Revision History

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-01-29 | 1.0 | Initial registry creation (ENH-009) + standardization schema | @claude-haiku-4-5 |
