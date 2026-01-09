# Lessons Learned: Relative File Paths

**Date:** 2026-01-07
**Context:** Documentation and Implementation Planning (v6.5.1)
**Problem Solved:** Use of non-portable absolute file paths in documentation and reports.

---

## The Problem We Faced

When generating implementation plans, walkthroughs, and status reports, the AI assistant (Antigravity) frequently used absolute file paths (e.g., `/Users/[username]/Documents/...`) instead of paths relative to the project root.

**Issues Discovered:**
- **Portability:** Absolute paths are unique to the current user's machine and environment. They break when shared or viewed on other systems.
- **Readability:** Long absolute paths (often 50+ characters) clutter documentation, making it difficult to read and parse core intent.
- **Staging/Production Discrepancy:** Documentation generated on a local machine with absolute paths is invalid in other CI/CD or deployment contexts where the filesystem structure differs.

**Impact:**
- Users must manually correct paths before documentation can be shared or committed.
- Increased cognitive load during review cycles.

**Why This Matters:**
- High-quality documentation should be "environment-agnostic" and focus on the logical project structure rather than the physical storage location on a specific disk.

---

## What We Learned: Context-Agnostic File Referencing

### The Core Insight
File references in project documentation should always be relative to the repository root. This ensures that the documentation is a durable asset that remains valid regardless of where the repository is cloned. The AI should treat the workspace root as the source of truth for all paths.

**The Solution:**
Implemented a strict "Relative Path" enforcement rule and codified it into the project's permanent memory. Added a specific check during the "PLANNING" mode to verify that all proposed file links are relative.

---

## The Solution: Relative Path Enforcement and Verification

### Layer 1: Global AI Instruction
Updated the foundational AI instructions (or project specific rules) to explicitly prohibit absolute paths in any user-facing report or plan.

### Layer 2: Planning Phase Guardrail
During the creation of an `implementation_plan.md`, the AI must perform a "Path Sanitization" step:
1.  **Identify**: Scan all Markdown links `[text](path)`.
2.  **Verify**: Check if `path` contains machine-specific root directories (e.g., `/Users/`, `C:\`).
3.  **Correct**: Convert detected absolute paths to be relative to the current project-root.

### Layer 3: Formal Documentation
This "Lessons Learned" document serves as a persistent reminder. Any future violations are caught during the manual review of implementation plans, where the user can cite this lesson to enforce consistency.

---

## Implementation Results

### Problems Fixed
- ✅ Eliminated machine-specific pathing in versioned documentation.
- ✅ Consistent pathing across `PROJECT-INSTRUCTIONS.md` and `quick-start-phase.md` updates.

### Metrics of Success
**Before:**
- ❌ `[PROJECT-INSTRUCTIONS.md](file:///Users/mkaplan/Documents/GitHub/optimize-my-resume/PROJECT-INSTRUCTIONS.md)`
**After:**
- ✅ `[PROJECT-INSTRUCTIONS.md](PROJECT-INSTRUCTIONS.md)`

---

## Replication Pattern for Any Project

### Generic Rule
If a file `Target` is inside a repository `Root`, always refer to it as `path/to/Target` relative to `Root`.

### Implementation Code (Template)
When creating plans, use this logic:
```javascript
function toRelativePath(absolutePath, rootPath) {
    if (!absolutePath.startsWith(rootPath)) return absolutePath;
    return absolutePath.replace(rootPath, "").replace(/^\//, "");
}
```

---

## How to Implement in Your Project

### Step 1: Update System Instructions
Add to the `PLANNING` mode instructions:
> "Surgically ensure all file references in artifacts and plans use paths relative to the project root. DO NOT include absolute machine paths."

### Step 2: Peer Review Enforcement
During peer review (or automated linting), reject any documentation that includes system-specific file roots.

---

## Lessons for Future Features

### **Lesson 1: Portability as a First-Class Citizen**
**Pattern:** Abstracting away environment details.
**Application:** Applied to all file pathing to ensure documentation is a "moveable feast."
**Result:** Increased documentation trust and reduced manual cleanup.

---

## Conclusion
Documentation should survive a machine change. By using relative paths, we ensure that our plans and logs are as portable as the code they describe.

**Key Takeaway:**
*Absolute paths are for tools; relative paths are for humans and history.*

---

**Created:** 2026-01-07
**Version:** 1.1
**Related Docs:**
- [.claude/skills/lesson-learned.md](../../.claude/skills/lesson-learned.md)
- [implementation_plan.md](../../.gemini/antigravity/brain/d66d522e-e295-4cd0-a20a-cbcc7bb3de75/implementation_plan.md)
