# ADR-004: Shadow Modularization Strategy

**Status:** Accepted
**Date:** 2026-01-12
**Deciders:** User, Agent
**Tags:** #architecture #modularization #tokens #documentation

**Related:**
- **Lessons:** [Lessons_Learned_Shadow_Modularization_Strategy.md](../lessons-learned/architecture/Lessons_Learned_Shadow_Modularization_Strategy.md)
- **Sessions:** [2026-01/2026-01-12_v8-modularization-progress.md](../sessions/2026-01/2026-01-12_v8-modularization-progress.md)

---

## Context and Problem Statement

As the system grew, the `PROJECT-INSTRUCTIONS.md` (Gold Master) and `Project-GUI-Instructions.md` (GUI Entry Point) became too large, consuming excessive context tokens. We needed to modularize functionality into separate files (v8.0 goal). However, splitting the Gold Master posed a risk of breaking the "Source of Truth" or losing global context for the AI.

**Key Factors:**
- **Token Efficiency:** GUI entry point must be lightweight.
- **System Integrity:** Gold Master must remain the authoritative source.
- **Maintenance:** Synchronization between entry points must be manageable.

---

## Decision Drivers

- Reducing context window usage for GUI users.
- Maintaining a single, reliable source of truth for core logic.
- Avoiding the complexity of syncing multiple fragmented files for the Gold Master.

---

## Considered Options

1.  **Full Modularization:** Split both Gold Master and GUI into referencing modules.
2.  **Shadow Modularization (Selected):** Modularize ONLY the GUI Entry Point; keep Gold Master intact but marked with sync boundaries.
3.  **No Modularization:** Keep monolithic files (rejected due to token limits).

---

## Decision Outcome

**Chosen option:** "Shadow Modularization"

**Rationale:**
We prioritized system stability over architectural purity. By keeping the Gold Master monolithic, we ensure that the "Brain" (System Instructions) always has the full context without needing to hunt for references. By modularizing the GUI Entry Point, we significantly reduce token usage for the "User" channel.

**Positive Consequences:**
- significant token savings for GUI users (~700+ lines removed per module).
- Gold Master remains a robust, standalone source of truth.
- "Silent Sync" markers make manual synchronization easy.

**Negative Consequences:**
- Requires discipline to update both the Module and the Gold Master (Silent Sync).
- Risk of drift if "Silent Sync" boundaries are ignored.

---

## Detailed Analysis of Options

### Option 2: Shadow Modularization (Selected)

**Description:**
Extract logic into a module (e.g., `job-fit-assessment.md`). Replace that logic in `Project-GUI-Instructions.md` with a `<modular_reference>`. In `PROJECT-INSTRUCTIONS.md`, wrap the *original* logic in `<!-- SILENT SYNC -->` comments to explicitly link it to the module without removing it.

**Pros:**
- Best of both worlds: performance for GUI, integrity for System.
- Clear update paths.

**Cons:**
- Duplication of text (logic exists in Module and Gold Master), but this is intentional.

---

## Implementation Notes

**Protocol:**
1.  **Extract:** Move logic to `optimization-tools/module.md`.
2.  **Sync:** Wrap logic in `PROJECT-INSTRUCTIONS.md` with `<!-- SILENT SYNC: [Name] -->`.
3.  **Optimize:** Replace logic in `Project-GUI-Instructions.md` with `<modular_reference file="...">`.

**Created:** 2026-01-12
**Last Updated:** 2026-01-12

---

## Version Management Protocol

**Scope:** This protocol applies to version headers in `PROJECT-INSTRUCTIONS.md` and `Project-GUI-Instructions.md`.

**Problem:** The Shadow Modularization pattern handles logic synchronization but doesn't address version header synchronization. This led to version drift: both files remained at v7.1.1 while the project reached v8.4.0 because Gemini AI was updating logic via modular references but not updating version headers.

**Solution:**

### Version Header Locations
Both files have version information in three places:
- Line 1: `# Optimize-My-Resume System vX.X.X`
- Line 6: `<!-- Version: X.X.X (Date) -->`
- Line 7: `<!-- Last Updated: Date -->`

### Synchronization Rule
When releasing a new version:
1. Update `ROADMAP.md` with the new version
2. Update `CHANGELOG.md` with release notes
3. **Update version headers in BOTH instruction files** (PROJECT-INSTRUCTIONS.md and Project-GUI-Instructions.md)
4. Keep versions synchronized—both files must always show the same version number

### Why Both Files Need Version Headers
- `PROJECT-INSTRUCTIONS.md`: Used in LLM chatbot (users see this version)
- `Project-GUI-Instructions.md`: Used in Claude Artifact/local dev environments (users see this version)
- Both are independent deployments with separate visibility, so both need accurate version info

### When to Update
Update version headers when:
- Completing a versioned release (v8.x.x)
- Merging feature branches to main
- **NOT needed** for hotfixes or documentation-only changes to other files

**Created:** 2026-01-13
**Related:** v8.4.1 version synchronization fix
