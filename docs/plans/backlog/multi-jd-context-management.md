# Implementation Plan - v8.5.0: Multi-JD Context Management

Establish a formal system for managing multiple Job Descriptions (JDs) within a single optimization session. This includes context-switching commands and comparative scoring across multiple targets.

> [!NOTE]
> **Deferred Feature:** JD history archiving (`jd_v1.txt`, `jd_v2.txt`, etc.) and persistent storage in `job-data/jds/` is deferred to a future version for local test builds only (not the Claude artifact).

## Proposed Changes

### [JD Management Module]

#### [NEW] [jd-context-manager.md](../../optimization-tools/job-fit-analyzer/jd-context-manager.md)
- Define logic for `gh_issue_detect_jd` (automatic detection of multi-JD scenarios).
- Implement `<context_switching_commands>`: Allow user to say "Switch to the [Company] JD".
- Implement `multi_jd_comparative_scoring`: Compare one resume against all active JDs in a single report.

---

### [System Instructions]

#### [MODIFY] [PROJECT-INSTRUCTIONS.md](../../PROJECT-INSTRUCTIONS.md)
- Update Phase 3 (`jd_comparison`) to reference the new JD Context Manager module.
- Add `<multi_jd_guardrail>` to prevent context leakage between disparate job targets.

#### [MODIFY] [Project-GUI-Instructions.md](../../Project-GUI-Instructions.md)
- Add `<modular_reference file="optimization-tools/job-fit-analyzer/jd-context-manager.md" />` to the jd_comparison phase.

---

### [Documentation & Versioning]

#### [MODIFY] [ROADMAP.md](../../ROADMAP.md)
- Update v8.5.0 status to "In Development".

#### [MODIFY] [CHANGELOG.md](../CHANGELOG.md)
- Record the addition of Multi-JD Context Management.

## Verification Plan

### Manual Verification
- Perform a "Switch to JD 2" command simulation within a single session.
- Generate a "Comparative Fit Report" for two different companies.
