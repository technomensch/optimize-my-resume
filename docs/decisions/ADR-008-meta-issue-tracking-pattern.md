# ADR-008: Meta-Issue Tracking Pattern for Complex Problems

**Date:** 2026-02-02
**Status:** Accepted
**Implements:** v9.3.8 feature
**Related:** v9.3.x enforcement saga (case study for this pattern)

---

## Context

The v9.3.x enforcement saga revealed gaps in documenting complex problems that span multiple versions and require 3+ solution attempts:

**Problem:**
- Single case study file (ENFORCEMENT_SYSTEM_FAILURE_CASE_STUDY.md) insufficient for multi-attempt tracking
- Root cause understanding evolved over 9 attempts, but evolution wasn't documented
- No clear traceability between plans and outcomes
- No reusable pattern for future complex issues
- Knowledge graph and case study documentation disconnected

**Scope:**
- v9.3.x enforcement saga: 9 attempts across v9.3.4 through v9.3.7.1+
- Root cause evolution: 5 major belief shifts as new evidence emerged
- Future applicability: Performance investigations, data migrations, system redesigns

---

## Decision

**Establish a generalized Meta-Issue Tracking Pattern** for documenting complex, multi-attempt problems that evolve understanding over time.

### Core Components

1. **Structured Directory:** `docs/issues/[meta-issue-name]/`
   - README.md (navigation hub)
   - description.md (living document)
   - implementation-log.md (all attempts with plan references)
   - test-cases.md (validation scenarios)
   - related-issues/ (GitHub issue links)
   - attempts/ (numbered folders with attempt details)
   - analysis/ (root cause evolution, timeline, lessons)

2. **Reusable Templates** (7 total):
   - Meta-issue core files (README, description, implementation-log, test-cases)
   - Attempt files (solution-approach, attempt-results, plan-reference)

3. **Standard Operating Procedures** (5 SOPs):
   - SOP 0: Creating new meta-issue (decision criteria)
   - SOP 1: Creating new attempt folder
   - SOP 2: Documenting attempt results
   - SOP 3: Updating KG with meta-issue context
   - SOP 4: Troubleshooting with meta-issue reference

4. **Knowledge Graph Integration:**
   - Bidirectional synchronization (KG ↔ meta-issue)
   - Evidence linking (patterns → attempt-results)
   - Automatic sync workflow

5. **Naming Convention:**
   - Format: `[version-range]-[domain]-saga/` OR `[domain]-investigation/`
   - Examples: `v9.3.x-enforcement-saga/`, `v2.x-performance-investigation/`

---

## Rationale

### Why This Pattern

1. **Captures Root Cause Evolution**
   - Enforcement saga showed understanding shifted 5 times
   - Living documents (description.md, root-cause-evolution.md) track shifts
   - Prevents lost context between sessions

2. **Generalized & Reusable**
   - Templates work for ANY problem domain
   - SOPs apply to ANY meta-issue type
   - Investment now pays dividends for future complex problems
   - Not enforcement-specific, not one-off solution

3. **Creates Traceability Chain**
   - Issue → Plan → Attempt → Results → KG
   - Complete audit trail for future stakeholders
   - Evidence linking prevents guessing about decisions

4. **Enables Knowledge Graph Bidirectionality**
   - Patterns discovered from attempts feed KG
   - KG updates explicitly reference attempt evidence
   - Single source of truth with multiple access points
   - Eliminates duplicate documentation

5. **Provides Structured Investigation**
   - Clear process for documenting each attempt
   - Consistent structure prevents confusion
   - Templates ensure completeness
   - SOPs guide when/how to use pattern

### Trade-offs

**Benefits:**
- ✅ Reusable across problems and domains
- ✅ Root cause evolution explicitly documented
- ✅ Complete audit trail for stakeholders
- ✅ Bidirectional KG integration
- ✅ Structured investigation process

**Costs:**
- ❌ Higher initial setup cost (7 templates, 5 SOPs)
- ❌ Requires discipline to maintain bidirectional links
- ❌ More comprehensive than simple case study
- ❌ Learning curve for new team members

**Mitigation:**
- Templates make creation easier
- SOPs provide step-by-step guidance
- Quick Start Guide for new meta-issues
- Examples (v9.3.x enforcement saga) demonstrate usage

---

## Implementation

### Applied to v9.3.x Enforcement Saga

**Created:**
- 7 reusable templates in `docs/issues/templates/`
- Complete v9.3.x-enforcement-saga directory with:
  - Core files (README, description, implementation-log, test-cases)
  - 9 attempt folders (001-009) with detailed results for critical attempts
  - Analysis files (root-cause-evolution, related-issues)
  - Knowledge graph integration (patterns.md updated with evidence links)

**Committed:**
- Commit 4b41f99 (v9.3.8): Meta-issue case study tracking system
- 2,690+ lines of documentation
- Plan file: docs/plans/v9.3.8-meta-issue-case-study-structure.md

---

## Consequences

### Positive

1. **Root Cause Understanding Documented**
   - Enforcement saga evolution visible (5 belief shifts documented)
   - Future meta-issues will capture same insights
   - Prevents repeating same failed approaches

2. **Reusable Infrastructure**
   - Templates and SOPs ready for next complex problem
   - Lower friction for v2.x performance issues, migrations, etc.
   - Investment amortized across multiple uses

3. **Knowledge Graph Fully Integrated**
   - Meta-issue evidence feeds patterns
   - Pattern updates reference specific attempts
   - Single source of truth with multiple perspectives

4. **Clear Decision Audit Trail**
   - Why approaches were chosen (plan-reference.md)
   - Why they failed (attempt-results.md)
   - What we learned (analysis/root-cause-evolution.md)

### Negative

1. **Requires Discipline**
   - Bidirectional links must be maintained manually
   - SOPs must be followed consistently
   - Risk of staleness if not kept updated

2. **Learning Curve**
   - Team members need to understand 5 SOPs
   - Template customization can be confusing
   - Initial application slower than ad-hoc documentation

3. **More Documentation**
   - Higher maintenance burden
   - Potential for information overload
   - Requires careful organization

---

## Related Decisions

- **ADR-001:** Dual-Format Documentation (applicable to meta-issue files)
- **ADR-003:** Surgical Updates Pattern (for living documents)
- **Knowledge Graph Integration:** Bidirectional sync workflow

---

## Future Considerations

1. **Automation Opportunities**
   - Auto-detect when to create meta-issue (3+ attempts, evolving KC)
   - Auto-generate attempt folders from plan files
   - Auto-sync KG when meta-issue updated

2. **Scalability**
   - How to handle 20+ attempts (pagination, archival)
   - How to track multiple concurrent meta-issues
   - Dashboard or index for meta-issue overview

3. **Integration with Other Systems**
   - Link to GitHub issues/PRs in automation
   - Integration with project management tools
   - Dashboard for meta-issue status across organization

---

## Acceptance Criteria

✅ **Implemented in v9.3.8:**
- [x] 7 reusable templates created
- [x] 5 SOPs documented
- [x] v9.3.x-enforcement-saga fully implemented
- [x] Knowledge graph updated with pattern
- [x] Bidirectional sync workflow defined
- [x] Lesson learned documented
- [x] Reusable for future meta-issues

✅ **First Application (v9.3.x Enforcement):**
- [x] 9 attempts documented with plan references
- [x] Root cause evolution captured
- [x] Traceability chain complete (Issue → Plan → Attempt → Results → KG)
- [x] Evidence linking to KG patterns

---

## References

- [v9.3.8 Plan](../plans/v9.3.8-meta-issue-case-study-structure.md)
- [Lesson Learned: Meta-Issue Tracking System](../lessons-learned/knowledge-capture/v9.3.8-meta-issue-tracking-system.md)
- [v9.3.x Enforcement Saga](../issues/v9.3.x-enforcement-saga/)
- [Meta-Issue Tracking Pattern](../knowledge/patterns.md#meta-issue-tracking-pattern)
- [Root Cause Evolution Analysis](../issues/v9.3.x-enforcement-saga/analysis/root-cause-evolution.md)

---

**Decision Made:** 2026-02-02
**Last Updated:** 2026-02-02
**Status:** Accepted and Implemented
