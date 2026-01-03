# Local Memory & Learning System Implementation Plan

**Version:** v6.3.0 (MINOR - new features)
**Type:** Feature Development
**Estimated Effort:** 21-28 hours total (implement in phases)

---

## Executive Summary

Implement a four-pillar memory system that extends existing documentation patterns to create persistent knowledge capture across Claude Code sessions. This transforms ephemeral sessions into a searchable knowledge base.

**Four Pillars:**
1. **Enhanced Lessons Learned** - Categorized by architecture/debugging/process/patterns
2. **Architecture Decision Records (ADRs)** - Formal decision documentation with status tracking
3. **Knowledge Graph** - Quick-reference concepts, patterns, gotchas, workflows
4. **Session Summaries** - Auto-documented work context before compaction

**Three New Skills:**
- `/recall` - Unified search across all memory systems
- `/session-summary` - Auto-generate session documentation
- Enhanced `/lesson-learned` - Category-aware lesson creation

---

## Implementation Strategy: Phased Approach

### Phase 1: Foundation (HIGH Priority) - 4-6 hours
**Goal:** Create directory structure and templates

**Directories to create:**
```
docs/
├── decisions/           # NEW: ADRs
│   ├── README.md
│   └── template.md
├── knowledge/          # NEW: Knowledge graph
│   ├── README.md
│   ├── index.md
│   ├── concepts.md
│   ├── patterns.md
│   ├── gotchas.md
│   └── workflows.md
├── sessions/           # NEW: Session summaries
│   ├── README.md
│   └── 2026-01/       # Month-based
└── lessons-learned/   # ENHANCE: Add categories
    ├── README.md (enhanced)
    ├── architecture/
    ├── debugging/
    ├── process/
    └── patterns/
```

**Templates to create:**
- `docs/decisions/template.md` (60 lines) - Standard ADR format
- `docs/sessions/template.md` (45 lines) - Session summary format
- `docs/knowledge/template.md` (35 lines) - Knowledge entry format

**Files:** 8 files, ~400 lines total

---

### Phase 2: Skills Implementation (HIGH Priority) - 8-10 hours
**Goal:** Create three skills for memory capture and retrieval

**Skill 1: `/recall` - Memory Retrieval**
- File: `~/.claude/commands/recall.md` (73 lines)
- Search across lessons/decisions/knowledge/sessions
- Grep-based parallel search
- Ranked results with cross-references
- Output formats: summary/paths/detailed

**Skill 2: `/session-summary` - Session Documentation**
- File: `~/.claude/commands/session-summary.md` (95 lines)
- Auto-analyze chat context
- Extract: built, decided, solved, learned
- Month-based organization (YYYY-MM/)
- Update session index automatically

**Skill 3: Enhanced `/lesson-learned`**
- File: `~/.claude/commands/lesson-learned.md` (+120 lines to existing)
- Auto-detect category (architecture/debugging/process/patterns)
- Save to categorized subdirectory
- Update master index with tags
- Cross-reference with ADRs/sessions

**Files:** 3 skills, ~290 lines total

---

### Phase 3: Initial Content Migration (MEDIUM Priority) - 3-4 hours
**Goal:** Populate system with existing content

**Create ADRs from existing lessons:**
- ADR-001: Dual-Format Strategy (from existing lessons)
- ADR-002: Skills Global-Only (from Skills Architecture lesson)
- ADR-003: Surgical Updates Pattern (from update-history skill)

**Create knowledge graph entries:**
- `concepts.md` - Extract 15 core concepts
- `patterns.md` - Document 8 established patterns
- `gotchas.md` - Capture 6 common pitfalls
- `workflows.md` - Quick-reference for 4 SOPs

**Categorize existing lessons:**
- Move 3 existing lessons to appropriate categories
- Update master index with cross-references

**Files:** ~10 files, ~600 lines total

---

### Phase 4: Knowledge Graph Population (MEDIUM Priority) - 4-5 hours
**Goal:** Build comprehensive interconnections

**Complete all knowledge entries:**
- Full concept definitions with examples
- Pattern catalog with when-to-use guidance
- Gotchas with solutions
- Workflow quick-references

**Cross-reference linking:**
- Lessons ↔ ADRs bidirectional links
- ADRs ↔ Knowledge references
- Sessions ↔ All other types
- Update all indexes

**Files:** 4 files enhanced, ~800 lines total

---

### Phase 5: Workflow Integration (LOW Priority) - 2-3 hours
**Goal:** Integrate with existing workflows

**Update existing skills:**
- `/doc-update` - Suggest ADR for architectural changes
- `/patch` - Suggest /session-summary after completion
- `/chat-history` - Cross-link to /session-summary

**Documentation updates:**
- Update workflows SOPs with memory system integration
- Update main README with new directories
- Add memory system to PROJECT-INSTRUCTIONS.md

**Files:** ~5 files, ~150 lines total

---

## Critical Files to Implement

### Phase 1 - Foundation Files

1. **docs/decisions/README.md** - ADR index with status tracking
2. **docs/decisions/template.md** - Standard ADR template
3. **docs/knowledge/index.md** - Master navigation hub
4. **docs/knowledge/patterns.md** - Pattern catalog starter
5. **docs/sessions/README.md** - Session log index
6. **docs/lessons-learned/README.md** - Enhanced with categories

### Phase 2 - Skill Files

7. **~/.claude/commands/recall.md** - Unified search (NEW)
8. **~/.claude/commands/session-summary.md** - Auto-documentation (NEW)
9. **~/.claude/commands/lesson-learned.md** - Category enhancement (ENHANCE)

---

## Key Design Decisions

### 1. Categorized Lessons
**Decision:** Use subdirectories (architecture/, debugging/, process/, patterns/)
**Why:** Easier navigation, better organization as knowledge grows
**Alternative rejected:** Flat structure with tags only (harder to browse)

### 2. Sequential ADR Numbering
**Decision:** 001-999 sequential numbering
**Why:** Industry standard, clear ordering, no naming conflicts
**Pattern:** GitHub ADR repository, AWS ADR guidance

### 3. Simple Grep-Based Search
**Decision:** Use grep instead of full-text search database
**Why:** Fast enough for small-medium projects, no dependencies, git-friendly
**Future:** Can enhance if needed

### 4. Month-Based Session Organization
**Decision:** YYYY-MM/ directories for sessions
**Why:** Easy to archive, natural grouping, scalable
**Alternative rejected:** Flat directory (doesn't scale well)

### 5. Skills Global-Only
**Decision:** Install skills in ~/.claude/commands/ (not .claude/skills/)
**Why:** Architectural constraint - Claude Code only loads from global directory
**Note:** Keep .claude/skills/ as reference/distribution only

---

## Integration Points

**Before context limits (180K tokens):**
- Trigger: Auto-suggest /session-summary

**After /patch completion:**
- Suggest: /session-summary if complex work
- Suggest: /lesson-learned if new pattern discovered

**After architectural decision:**
- Create: Formal ADR if significant
- Link: ADR to implementation session

**During debugging:**
- Suggest: /lesson-learned (category: debugging)
- Update: knowledge/gotchas.md if quick fix

---

## Testing & Validation

**Phase 1 Testing:**
- Verify all directories exist
- Validate template markdown renders correctly
- Check README indexes are readable

**Phase 2 Testing:**
- Test /recall with existing lessons
- Generate /session-summary for this design session
- Create categorized lesson with enhanced /lesson-learned
- Verify file creation, indexing, cross-refs

**Phase 3 Testing:**
- Verify ADRs follow template
- Check knowledge entries have cross-refs
- Validate categorized lessons appear in index

**End-to-End Testing:**
- Full workflow: Problem → Solution → Document → Retrieve
- Test /recall finds relevant content
- Verify cross-references are bidirectional

---

## Success Criteria

1. ✅ All directories created with README files
2. ✅ Three skills functional and tested
3. ✅ At least 3 ADRs documenting existing decisions
4. ✅ Knowledge graph populated with 15+ entries
5. ✅ /recall successfully searches across all systems
6. ✅ /session-summary generates valid session docs
7. ✅ Cross-references link correctly
8. ✅ Master indexes auto-update

---

## Rollout Plan

**Week 1: Build Foundation (Phase 1-2)**
- Day 1-2: Create directories and templates (4-6 hours)
- Day 3-5: Implement three skills (8-10 hours)
- Test with real content, gather feedback

**Week 2: Validate & Populate (Phase 3)**
- Day 1-2: Create initial ADRs and knowledge entries (3-4 hours)
- Day 3-5: Use system for 1 week with real sessions
- Identify pain points and improvements

**Week 3: Complete & Integrate (Phase 4-5)**
- Only if Phase 1-2 validation successful
- Day 1-3: Populate knowledge graph (4-5 hours)
- Day 4-5: Workflow integration (2-3 hours)

---

## Template Repository Adaptation

After implementing in optimize-my-resume, create generalized version for template repo:

**Changes needed:**
- Replace specific examples with placeholders
- Generic ADR examples (not project-specific)
- Template-specific README
- Installation instructions
- Remove project-specific content from knowledge graph

**Files to export:**
- All directory structure
- All templates
- All three skills
- README with setup instructions

---

## Estimated Totals

| Phase | Priority | Files | Lines | Hours |
|-------|----------|-------|-------|-------|
| 1 - Foundation | HIGH | 8 | ~400 | 4-6 |
| 2 - Skills | HIGH | 3 | ~290 | 8-10 |
| 3 - Migration | MEDIUM | ~10 | ~600 | 3-4 |
| 4 - Knowledge Graph | MEDIUM | 4 | ~800 | 4-5 |
| 5 - Integration | LOW | ~5 | ~150 | 2-3 |
| **TOTAL** | - | **~30** | **~2240** | **21-28** |

**Recommended:** Start with Phase 1-2 (12-16 hours), validate for 1 week, then proceed based on feedback.

---

## Next Steps

1. User approval of this plan
2. Create feature branch: `v6.3.0-memory-system`
3. Implement Phase 1 (directories + templates)
4. Implement Phase 2 (skills)
5. Test and validate
6. Proceed with Phase 3-5 or iterate based on feedback

---

**Plan Created:** 2026-01-02
**Target Version:** v6.3.0
**Type:** MINOR (new features, backwards-compatible)
