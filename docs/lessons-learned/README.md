# Lessons Learned - Master Index

**Total Lessons:** 10
**Categories:** 4
**Last Updated:** 2026-01-02

---

## Quick Search

**By Category:**
- [Architecture](#architecture-lessons) (2)
- [Debugging](#debugging-lessons) (1)
- [Process](#process-lessons) (6)
- [Patterns](#patterns-lessons) (1)

**By Tag:** See [Tag Index](#tag-index)
**By Date:** See [Chronological](#chronological-index)

---

## Architecture Lessons

**2 lessons** - See [architecture/README.md](architecture/README.md) for full details

1. **[Claude Code Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)**
   - Date: 2025-12-29
   - Tags: #architecture #skills #claude-code #global-directory
   - Problem: Skills not appearing despite existing in project
   - Solution: Skills MUST be in `~/.claude/commands/` (global), not `.claude/skills/` (project reference only)

2. **[ID-Based Architecture for Token Optimization](architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)**
   - Date: 2025-12-17
   - Tags: #architecture #optimization #token-management #ai-pipeline
   - Problem: Token bloat and display redundancy in AI pipeline
   - Solution: Universal ID-based architecture eliminates redundancy by referencing entities by ID

**Subdirectory:** [architecture/](architecture/)

---

## Debugging Lessons

**1 lesson** - See [debugging/README.md](debugging/README.md) for full details

1. **[Skills Not Loading Until Restart](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)**
   - Date: 2026-01-02
   - Tags: #debugging #skills #claude-code #loading-behavior #startup
   - Problem: Skills added during active session don't load
   - Solution: Claude Code loads skills at startup only - always restart after adding/modifying skills

**Subdirectory:** [debugging/](debugging/)

---

## Process Lessons

**6 lessons** - See [process/README.md](process/README.md) for full details

1. **[Patch Workflow and /patch Command](process/Lessons_Learned_Patch_Workflow.md)**
   - Date: 2025-12-11
   - Tags: #process #workflow #patch #planning
   - Problem: Jumping to implementation before analysis during patches
   - Solution: Always analyze → plan → implement, even for "simple" bug fixes

2. **[Branch Prompt Workflow Pattern](process/Lessons_Learned_Branch_Prompt_Workflow.md)**
   - Date: 2025-12-10
   - Tags: #process #workflow #prompts #iteration #git-hygiene
   - Problem: Testing AI prompt changes without breaking stable versions
   - Solution: Use branch-specific temporary prompts, never commit them

3. **[Chat History Export Workflow](process/Lessons_Learned_Chat_History_Workflow.md)**
   - Date: 2025-12-18
   - Tags: #process #workflow #chat-history #context-preservation #git-hygiene
   - Problem: Preserving conversation context before compaction
   - Solution: Track chat-history/ folder, ignore contents, export before compaction

4. **[Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)**
   - Date: 2025-12-10
   - Tags: #process #planning #file-organization #version-control
   - Problem: Plans created in temporary `.claude/plans/` instead of tracked `docs/plans/`
   - Solution: Move plans from `.claude/plans/` to `docs/plans/` for version control

5. **[Automated Validation for Documentation Consistency](process/Lessons_Learned_Automated_Validation.md)**
   - Date: 2025-12-10
   - Tags: #process #automation #validation #documentation #consistency
   - Problem: Documentation conflicts and version inconsistencies during rapid iteration
   - Solution: Automated validation scripts catch issues before they compound

6. **[Version Consistency Across Split Changelogs](process/Lessons_Learned_Split_Changelog_Versioning.md)**
   - Date: 2025-12-17
   - Tags: #process #versioning #changelog #consistency #automation
   - Problem: Maintaining version consistency with separate user/developer changelogs
   - Solution: Extract and compare versions from both changelogs to ensure synchronization

**Subdirectory:** [process/](process/)

---

## Patterns Lessons

**1 lesson** - See [patterns/README.md](patterns/README.md) for full details

1. **[Memory System Phase 1 - Foundation Architecture](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)**
   - Date: 2026-01-02
   - Tags: #patterns #architecture #memory-system #knowledge-capture #documentation
   - Problem: Knowledge loss and tribal knowledge evaporation across sessions
   - Solution: Four-pillar memory architecture (ADRs + Knowledge + Sessions + Lessons) with templates

**Subdirectory:** [patterns/](patterns/)

---

## Tag Index

**#architecture** (3 lessons)
- [Claude Code Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)
- [ID-Based Architecture](architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#automation** (2 lessons)
- [Automated Validation](process/Lessons_Learned_Automated_Validation.md)
- [Split Changelog Versioning](process/Lessons_Learned_Split_Changelog_Versioning.md)

**#claude-code** (2 lessons)
- [Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)
- [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

**#debugging** (1 lesson)
- [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

**#documentation** (2 lessons)
- [Automated Validation](process/Lessons_Learned_Automated_Validation.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#git-hygiene** (2 lessons)
- [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md)
- [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md)

**#knowledge-capture** (1 lesson)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#optimization** (1 lesson)
- [ID-Based Architecture](architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)

**#patterns** (1 lesson)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#planning** (2 lessons)
- [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)

**#process** (6 lessons)
- [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md)
- [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md)
- [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)
- [Automated Validation](process/Lessons_Learned_Automated_Validation.md)
- [Split Changelog Versioning](process/Lessons_Learned_Split_Changelog_Versioning.md)

**#skills** (2 lessons)
- [Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)
- [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

**#version-control** (1 lesson)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)

**#versioning** (1 lesson)
- [Split Changelog Versioning](process/Lessons_Learned_Split_Changelog_Versioning.md)

**#workflow** (5 lessons)
- [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md)
- [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md)
- [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

## Chronological Index

**2026**
- 2026-01-02: [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md) - Four-pillar memory architecture
- 2026-01-02: [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md) - Startup-only loading behavior

**2025**
- 2025-12-29: [Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md) - Global vs. project-local skills
- 2025-12-18: [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md) - Context preservation before compaction
- 2025-12-17: [ID-Based Architecture](architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md) - Token optimization pattern
- 2025-12-17: [Split Changelog Versioning](process/Lessons_Learned_Split_Changelog_Versioning.md) - Version consistency
- 2025-12-11: [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md) - Analyze before implementing
- 2025-12-10: [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md) - Safe prompt iteration
- 2025-12-10: [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md) - Tracked vs. temporary plans
- 2025-12-10: [Automated Validation](process/Lessons_Learned_Automated_Validation.md) - Documentation consistency

---

## Usage

**Find a lesson:**
```bash
# Search by keyword across all systems
/recall <topic>

# Browse by category
ls docs/lessons-learned/architecture/
ls docs/lessons-learned/process/

# Search by tag
grep -r "#architecture" docs/lessons-learned/
```

**Create a lesson:**
```bash
/lesson-learned
```

**Update this index:**
[Auto-updated when /lesson-learned creates new lessons with v1.2+]

---

## Statistics

**By Category:**
- Process: 6 lessons (60%)
- Architecture: 2 lessons (20%)
- Patterns: 1 lesson (10%)
- Debugging: 1 lesson (10%)

**Most Common Tags:**
1. #process (6 lessons)
2. #workflow (5 lessons)
3. #architecture (3 lessons)
4. #skills, #claude-code, #automation, #git-hygiene, #documentation, #planning (2 lessons each)

**Timeline:**
- First lesson: 2025-12-10
- Latest lesson: 2026-01-02
- Total span: 23 days
- Average: ~0.4 lessons per day

**Content:**
- Total lessons: 10
- Estimated total lines: ~4,000 lines
- Average per lesson: ~400 lines

---

## Related Resources

- **ADRs:** [../decisions/](../decisions/) - Formal architectural decisions
- **Sessions:** [../sessions/](../sessions/) - Context from past work sessions
- **Knowledge Graph:** [../knowledge/](../knowledge/) - Quick-reference concepts and patterns
- **Use /recall:** Search across all memory systems

---

**Created:** 2026-01-02
**Last Major Update:** 2026-01-02 (Phase 3: Categorization complete)
