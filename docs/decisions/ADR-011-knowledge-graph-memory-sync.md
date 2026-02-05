# ADR-011: Bidirectional Sync Between Knowledge Graph and Project Memory

**Status:** Accepted

**Date:** 2026-02-05

**Authors:** Claude Code (v9.3.8 Enhancement)

---

## Context

The project uses two complementary knowledge systems:

1. **Knowledge Graph** (`docs/knowledge/*.md`) - Quick-reference index of patterns, concepts, and gotchas
   - Fast lookups (5-10 seconds)
   - Discoverable via grep/search
   - Links to deep-dive lessons-learned files

2. **Project Memory** (`~/.claude/projects/[project]/memory/MEMORY.md`) - Persistent governance context
   - Loaded into Claude Code system prompt each session
   - Provides immediate context without searching
   - Acts as institutional memory across sessions

Previously, these systems evolved independently:
- When new patterns were discovered → Added to KG only
- When new insights emerged → Added to memory (if remembered, ad-hoc)
- Result: Knowledge drift, missed governance sync, patterns unknown to future sessions

The v9.3.8 enhancement recognized this gap during `/update-knowledge-graph` execution: **the skill should trigger memory updates automatically**.

## Problem

Current workflow stops at knowledge graph creation:
```
Discover pattern → Create KG entry → ✅ Complete
                                    ↓
Memory update:   (forgotten, ad-hoc, or missed)
```

Risk: Future sessions don't know the pattern exists because it's not in memory.

## Decision

Enhance `/update-knowledge-graph` skill with **Step 7: Check Project Memory Sync Requirements**

This ensures bidirectional synchronization:
```
Discover pattern → Create KG entry → Check memory → Update memory → Complete
                      ↓              ↓             ↓
                   Quick-ref    Discovery      Persistence
                   (5-10 sec)   mechanism      (system prompt)
```

### Implementation Details

**Step 7 Workflow:**
1. After KG entry is created, determine if memory should update
2. Check memory update triggers (gotchas, practices, failures, workflows, architecture decisions)
3. Update appropriate MEMORY.md section with consistent formatting
4. Link back to knowledge graph entry and lesson-learned source
5. Verify line count stays under ~250 lines
6. Stage both KG + memory updates in single commit

**Memory Update Categories:**
- New **Gotcha Pattern** → `Common Failure Patterns & Fixes` table
- New **Best Practice** → `Best Practices` checklist
- New **Common Failure Pattern** → `Common Failure Patterns & Fixes` table
- New **Workflow Change** → `Workflow Skills & Their Purpose` table
- New **Architecture Decision** → `Core Governance Patterns` subsection

## Rationale

### Why This Matters

1. **System Prompt Loading**: Memory file is automatically loaded into Claude Code system prompt
   - If not updated, future sessions miss critical governance patterns
   - Leads to repeated mistakes, lost discipline

2. **Bidirectional Sync Prevents Drift**: KG is discovery mechanism, Memory is persistence layer
   - Without sync: Knowledge lives only in one place
   - With sync: Pattern is discoverable AND persistent

3. **Closes Feedback Loop**:
   ```
   Session 1: Discover pattern → KG entry → Memory entry
   Session 2: Load memory → Know pattern exists → Use it correctly
   Session 3: Refine pattern → Update both → Better guidance
   ```

4. **Formalizes Best Practice**: Prevents ad-hoc memory updates
   - Step 7 makes memory updates automatic, not optional
   - Consistent, repeatable process

### Alternative Approaches Considered

1. **Manual memory updates**: ❌ Requires discipline, easy to forget
2. **Separate memory sync skill**: ❌ Adds process step, breaks integration
3. **Automated script**: ❌ Can't understand semantic differences
4. **No sync** (current state): ❌ Causes knowledge drift

## Consequences

### Positive

- ✅ Memory always synchronized with knowledge graph
- ✅ Future sessions inherit governance patterns automatically
- ✅ Pattern documentation becomes end-to-end (discovery → persistence)
- ✅ Prevents "lost knowledge" between sessions
- ✅ Closes governance loop: pattern → documentation → action

### Negative

- ⚠️ Adds ~2-3 minutes to knowledge graph updates (memory format + verification)
- ⚠️ Memory file needs discipline to maintain conciseness (200-250 lines)
- ⚠️ Requires careful classification of what triggers memory updates

### Constraints

- Memory file must stay under ~250 lines (linked to detail files for larger topics)
- Not all KG entries trigger memory updates (e.g., one-time project patterns, career strategy concepts)
- Updates must maintain consistent formatting with existing memory sections

## Implementation

### Files Modified

1. **`.agent/workflows/update-knowledge-graph.md`**
   - Added Step 7 with detailed workflow, triggers, categories, and examples

2. **`docs/knowledge/patterns.md`**
   - Added new pattern entry: "Knowledge Graph ↔ Memory Bidirectional Sync"
   - Updated entry count: 28 → 29
   - Added Quick Navigation link

3. **`~/.claude/projects/-Users-mkaplan-Documents-GitHub-optimize-my-resume/memory/MEMORY.md`**
   - Updated Workflow Skills table for `/update-knowledge-graph`
   - Added "Knowledge Graph ↔ Memory Synchronization" to Core Governance Patterns

### Deployment

**Deployed:** 2026-02-05

**Branch:** `v9.3.8-meta-issue-case-study-structure`

**Related Commits:**
- Skill enhancement + pattern + ADR + memory update

## Testing

When testing Step 7:

1. Run `/update-knowledge-graph` to create new KG entry
2. Verify Step 7 executes (checks memory update triggers)
3. Manually update MEMORY.md per Step 7 workflow
4. Verify bidirectional links (KG → Memory, Memory → KG)
5. Git diff to confirm both files staged together

## Future Enhancements

1. **Script-based verification**: Create validation script to check bidirectional links
2. **Automatic template insertion**: Auto-format memory updates per table/checklist structure
3. **Memory metrics**: Track memory growth over time (prevent exceeding 250 line limit)
4. **ADR linking**: Integrate ADR creation with memory updates for architecture decisions

## References

- [update-knowledge-graph Skill - Step 7](../../.agent/workflows/update-knowledge-graph.md#step-7-check-project-memory-sync-requirements)
- [Knowledge Graph ↔ Memory Pattern](../knowledge/patterns.md#knowledge-graph--memory-bidirectional-sync)
- [Project Memory System Pattern](../knowledge/patterns.md#project-memory-system)
- [v9.3.8 Plan - Phase 9](../plans/fuzzy-finding-torvalds.md#phase-9-enhance-update-knowledge-graph-skill-with-project-memory-integration)

---

**Decision Made:** 2026-02-05

**Status:** Ready for Deployment

**Next Review:** After first 3 cycles of `/update-knowledge-graph` with Step 7
