# ADR-007: Keyword Verification Hub Architecture

- **Status:** Proposed
- **Date:** 2026-01-19
- **Deciders:** mkaplan, Claude
- **Consulted:** ADR-004 (Shadow Modularization), Shadow Sync Protocol
- **Informed:** Narrative Generator, Resume Analyzer

---

## Context and Problem

In previous versions of the "Should-I-Apply" WebGUI, keyword optimization was a black box. The system extracted keywords from the Job Description (JD) and automatically tried to integrate them into the optimized resume. Users had no way to:
1.  **Prioritize** specific skills they knew they had but weren't in the JD.
2.  **Suppress** irrelevant keywords that were incorrectly extracted.
3.  **Verify** if their job history actually supported the keywords being integrated.

This led to "keyword stuffing" where the AI would sometimes fabricate achievements to satisfy a JD keyword, making the resume indefensible in an interview.

## Decision Drivers

- **Authenticity:** Resumes must be defensible; don't claim what can't be proved.
- **User Agency:** Users must be in control of which keywords are emphasized.
- **Token Efficiency:** Avoid generating optimization for low-fit roles.
- **Maintainability:** Follow the Hub-and-Spoke modular architecture (ADR-004).

## Considered Options

1.  **Strict JD Extraction:** (Status Quo) AI chooses keywords solely from JD. Low control.
2.  **Free-Text Custom Keywords:** User types keywords, AI accepts them blindly. High risk of hallucination.
3.  **The Keyword Hub (Three-List Manager):** Interactive curation with automated background validation.

## Decision Outcome

**Chosen Option: The Keyword Hub (Three-List Manager)**

The Keyword Hub implements a centralized management layer with the following logic:

### 1. Three-List State Management
Keywords are organized into three mutually exclusive states:
- **EXTRACTED:** Default state for AI-extracted JD keywords.
- **USE (Prioritize):** Explicit user intent to include (Green).
- **IGNORE (Exclude):** Explicit user intent to suppress (Gray).

### 2. Interactive Tag Toggling
A two-column UI allows users to move keywords between "Active" and "Inactive" lists with a single click, providing a low-friction curation experience.

### 3. Automated Evidence Validation
Any keyword in the "USE" list triggers a background scan of the Job History (specifically `tools_technologies` and `key_achievements`).
- **Verified:** Evidence found in history.
- **Unverified:** No documented evidence found. Shows visual warning.

### 4. G32 (The Safety Gate)
If "Unverified" keywords are selected for generation, the system triggers a blocking modal. The user must explicitly confirm they want to proceed, acknowledging the interview risk.

## Consequences

- **Pros:**
    - Dramatically reduces the risk of AI-fabricated achievements.
    - Increases user trust by making the optimization process transparent.
    - Allows users to target "hidden" skills that the initial JD extraction might have missed.
- **Cons:**
    - Adds complexity to the WebGUI state management.
    - Requires additional background compute for evidence scanning.

## Pros and Cons of the Options

### Strict JD Extraction
- **Pros:** simple, zero user effort.
- **Cons:** Inflexible, prone to missing context.

### Free-Text Custom Keywords
- **Pros:** Maximum flexibility.
- **Cons:** Highest risk of data loss or hallucination; no safety net.

## Related ADRs & Lessons
- **ADR-004:** Shadow Modularization (The Hub-and-Spoke pattern).
- **Lesson:** [Relative File Paths](../lessons-learned/architecture/Lessons_Learned_Relative_File_Paths.md)
- **Rule:** [G32](../../PROJECT-INSTRUCTIONS.md#guardrail-32)
