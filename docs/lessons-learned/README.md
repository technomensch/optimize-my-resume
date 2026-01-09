# Lessons Learned - Master Index

**Total Lessons:** 14
**Categories:** 4
**Last Updated:** 2026-01-07

---

## Quick Search

**By Category:**
- [Architecture](#architecture-lessons) (3)
- [Debugging](#debugging-lessons) (2)
- [Process](#process-lessons) (7)
- [Patterns](#patterns-lessons) (2)

**By Tag:** See [Tag Index](#tag-index)
**By Date:** See [Chronological](#chronological-index)

---

## Architecture Lessons

**3 lessons** - See [architecture/README.md](architecture/README.md) for full details

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
3. **[Relative File Paths](architecture/Lessons_Learned_Relative_File_Paths.md)**
   - Date: 2026-01-07
   - Tags: #architecture #documentation #best-practices #portability
   - Problem: Machine-specific absolute paths in versioned docs
   - Solution: Enforcement of relative paths from repository root for all documentation references

**Subdirectory:** [architecture/](architecture/)

---

## Debugging Lessons

**3 lessons** - See [debugging/README.md](debugging/README.md) for full details

1. **[Skills Not Loading Until Restart](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)**
   - Date: 2026-01-02
   - Tags: #debugging #skills #claude-code #loading-behavior #startup
   - Problem: Skills added during active session don't load
   - Solution: Claude Code loads skills at startup only - always restart after adding/modifying skills
2. **[GitHub Issue-Driven Planning](debugging/Lessons_Learned_GitHub_Issue_Driven_Planning.md)**
   - Date: 2026-01-07
   - Tags: #debugging #workflow #github-cli #automation #planning
   - Problem: Fragmentation of requirements across multiple issues and comments
   - Solution: Leverage `gh` CLI to Programmatically fetch bodies and comments for authoritative consolidation before implementation.

**Subdirectory:** [debugging/](debugging/)

---

## Process Lessons

**7 lessons** - See [process/README.md](process/README.md) for full details

1. **[SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)**
   - Date: 2026-01-03
   - Tags: #process #automation #hooks #memory-system #claude-code #workflow
   - Problem: Manual triggering overhead for memory system skills
   - Solution: Hook-based automation at workflow boundaries (SessionStart + git commit)

2. **[Patch Workflow and /patch Command](process/Lessons_Learned_Patch_Workflow.md)**
   - Date: 2025-12-11
   - Tags: #process #workflow #patch #planning
   - Problem: Jumping to implementation before analysis during patches
   - Solution: Always analyze → plan → implement, even for "simple" bug fixes

3. **[Branch Prompt Workflow Pattern](process/Lessons_Learned_Branch_Prompt_Workflow.md)**
   - Date: 2025-12-10
   - Tags: #process #workflow #prompts #iteration #git-hygiene
   - Problem: Testing AI prompt changes without breaking stable versions
   - Solution: Use branch-specific temporary prompts, never commit them

4. **[Chat History Export Workflow](process/Lessons_Learned_Chat_History_Workflow.md)**
   - Date: 2025-12-18
   - Tags: #process #workflow #chat-history #context-preservation #git-hygiene
   - Problem: Preserving conversation context before compaction
   - Solution: Track chat-history/ folder, ignore contents, export before compaction

5. **[Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)**
   - Date: 2025-12-10
   - Tags: #process #planning #file-organization #version-control
   - Problem: Plans created in temporary `.claude/plans/` instead of tracked `docs/plans/`
   - Solution: Move plans from `.claude/plans/` to `docs/plans/` for version control

6. **[Automated Validation for Documentation Consistency](process/Lessons_Learned_Automated_Validation.md)**
   - Date: 2025-12-10
   - Tags: #process #automation #validation #documentation #consistency
   - Problem: Documentation conflicts and version inconsistencies during rapid iteration
   - Solution: Automated validation scripts catch issues before they compound

7. **[Version Consistency Across Split Changelogs](process/Lessons_Learned_Split_Changelog_Versioning.md)**
   - Date: 2025-12-17
   - Tags: #process #versioning #changelog #consistency #automation
   - Problem: Maintaining version consistency with separate user/developer changelogs
   - Solution: Extract and compare versions from both changelogs to ensure synchronization

**Subdirectory:** [process/](process/)

---

## Patterns Lessons

**2 lessons** - See [patterns/README.md](patterns/README.md) for full details

1. **[Complete Memory System v6.3.0 Implementation](patterns/Lessons_Learned_Complete_Memory_System_v6.3.0_Implementation.md)**
   - Date: 2026-01-02
   - Tags: #patterns #v6.3.0 #memory-system #implementation #three-phase #skills #automation
   - Problem: Knowledge loss across sessions; complete end-to-end implementation
   - Solution: Three-phase implementation (Foundation → Skills → Content) with automation and populated content

2. **[Memory System Phase 1 - Foundation Architecture](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)**
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
- [Relative File Paths](architecture/Lessons_Learned_Relative_File_Paths.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#automation** (3 lessons)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)
- [Automated Validation](process/Lessons_Learned_Automated_Validation.md)
- [Split Changelog Versioning](process/Lessons_Learned_Split_Changelog_Versioning.md)

**#claude-code** (3 lessons)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)
- [Skills Architecture](architecture/Lessons_Learned_Claude_Code_Skills_Architecture.md)
- [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

**#debugging** (1 lesson)
- [Skills Not Loading](debugging/Lessons_Learned_Skills_Not_Loading_Until_Restart.md)

**#documentation** (2 lessons)
- [Automated Validation](process/Lessons_Learned_Automated_Validation.md)
- [Relative File Paths](architecture/Lessons_Learned_Relative_File_Paths.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#git-hygiene** (2 lessons)
- [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md)
- [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md)

**#hooks** (1 lesson)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)

**#knowledge-capture** (1 lesson)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#memory-system** (1 lesson)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)

**#optimization** (1 lesson)
- [ID-Based Architecture](architecture/Lessons_Learned_ID_Based_Architecture_Token_Optimization.md)

**#patterns** (2 lessons)
- [Complete Memory System v6.3.0](patterns/Lessons_Learned_Complete_Memory_System_v6.3.0_Implementation.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

**#planning** (2 lessons)
- [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)

**#process** (7 lessons)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)
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

**#workflow** (6 lessons)
- [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md)
- [Patch Workflow](process/Lessons_Learned_Patch_Workflow.md)
- [Branch Prompt Workflow](process/Lessons_Learned_Branch_Prompt_Workflow.md)
- [Chat History Workflow](process/Lessons_Learned_Chat_History_Workflow.md)
- [Plan File Locations](process/Lessons_Learned_Plan_File_Locations.md)
- [GitHub Issue-Driven Planning](debugging/Lessons_Learned_GitHub_Issue_Driven_Planning.md)
- [Memory System Phase 1](patterns/Lessons_Learned_Memory_System_Phase_1_Foundation.md)

---

## Chronological Index

**2026**
- 2026-01-07: [GitHub Issue-Driven Planning](debugging/Lessons_Learned_GitHub_Issue_Driven_Planning.md) - Programmatic requirement gathering
- 2026-01-07: [Relative File Paths](architecture/Lessons_Learned_Relative_File_Paths.md) - Context-agnostic file referencing
- 2026-01-03: [SessionStart Hook Automation](process/Lessons_Learned_SessionStart_Automation.md) - Hook-based automation at workflow boundaries
- 2026-01-02: [Complete Memory System v6.3.0](patterns/Lessons_Learned_Complete_Memory_System_v6.3.0_Implementation.md) - Full three-phase implementation
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
- Process: 7 lessons (58%)
- Architecture: 3 lessons (23%)
- Patterns: 2 lessons (17%)
- Debugging: 2 lessons (14%)

**Most Common Tags:**
1. #process (7 lessons)
2. #workflow (6 lessons)
3. #architecture, #automation, #claude-code, #documentation (3 lessons each)
4. #skills, #git-hygiene, #documentation, #planning (2 lessons each)

**Timeline:**
- First lesson: 2025-12-10
- Latest lesson: 2026-01-03
- Total span: 24 days
- Average: ~0.5 lessons per day

**Content:**
- Total lessons: 12
- Estimated total lines: ~9,000 lines
- Average per lesson: ~750 lines

---

## Related Resources

- **ADRs:** [../decisions/](../decisions/) - Formal architectural decisions
- **Sessions:** [../sessions/](../sessions/) - Context from past work sessions
- **Knowledge Graph:** [../knowledge/](../knowledge/) - Quick-reference concepts and patterns
- **Use /recall:** Search across all memory systems

---

**Created:** 2026-01-02
**Last Major Update:** 2026-01-07 (Added Relative File Paths lesson)
