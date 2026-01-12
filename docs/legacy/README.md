# Legacy Files Archive

This directory contains v5.0 files that have been superseded by v6.0+ architecture.

**Last Updated:** 2025-12-29 (v6.1.4)

---

## What's Here

### `/modes-v5/` - v5.0 Mode Definitions
Original mode files from v5.0 release. Superseded by `/optimization-tools/` modular architecture in v6.0.

**Files:**
- `mode-1-full-analysis.md` - Full resume analysis (v5.0)
- `mode-2-bullet-optimization.md` - Bullet optimization (v5.0)
- `mode-3-jd-comparison.md` - JD comparison (v5.0)

**Replaced by:**
- `/optimization-tools/resume-analyzer/` - Job history v2.0, JD parser, entry router (v6.0.1)
- `/optimization-tools/bullet-optimizer/` - Evidence matching, blocking gates (v6.0.2)
- `/optimization-tools/job-fit-analyzer/` - Workflow router, incremental updates (v6.0.3)
- `/optimization-tools/narrative-generator/` - Summary generation (v6.0.4)

---

### `/wireframes-v5/` - v5.0 Visual Diagrams
Original workflow wireframes from v5.0. Replaced by comprehensive ASCII + Mermaid diagrams in v6.1.3.

**Files:**
- `mode-1-workflow.md` (Already deleted in v6.1.3 commit)
- `mode-2-workflow.md` (Already deleted in v6.1.3 commit)
- `mode-3-workflow.md` (Already deleted in v6.1.3 commit)

**Replaced by:** `/wireframes/` (v6.1.3)
- 10 files: 5 ASCII + 5 Mermaid (phase-1 through phase-4 + complete workflow)

---

### `/shared-v5/` - v5.0 Shared Components
Legacy shared components from v5.0, pre-modular architecture.

**Files:**
- `initial-greeting.md` - User greeting template (v5.0)
- `job-summary-creation.md` - Job summary generator (v5.0)

**Replaced by:**
- `/optimization-tools/resume-analyzer/entry-router.md` - Handles greetings via routing (v6.0.1)
- `/optimization-tools/narrative-generator/summary-generation.md` - Professional summary (v6.0.4)

---

### `/implementation-prompts/` - One-Time Implementation Prompts
Terminal prompts used for implementing specific features. No longer needed after implementation.

**Files:**
- `ADD_REMOTE_WORK_LOGIC.md` - v5.1 remote work classification implementation prompt

**Status:** Feature implemented in v5.1, integrated into v6.0 system

---

### `CHANGELOG-v5.md` - Outdated Changelog
Root-level changelog from v5.0 (duplicate of `docs/CHANGELOG.md`).

**Why archived:**
- Duplicate file (canonical version is `docs/CHANGELOG.md`)
- Last updated Dec 27, 2024 (stops at v5.0)
- Superseded by comprehensive v6.0 changelog

**Current changelog:** `docs/CHANGELOG.md` (v6.0.0+)

---

## Why Archive Instead of Delete?

These files provide historical context for:
1. **Understanding evolution** - How v5.0 architecture evolved to v6.0
2. **Migration reference** - For users with v5.0 job history files
3. **Design decisions** - Why certain approaches were replaced
4. **Rollback capability** - If needed to reference v5.0 implementation

---

## Related Documentation

- **Current Architecture:** See `PROJECT-INSTRUCTIONS.md` (v6.0.0)
- **Version History:** See `docs/CHANGELOG.md`
- **Roadmap:** See `ROADMAP.md`
- **Plans:** See `docs/plans/v6.*.md`
