# Optimize-My-Resume v5.0

A modular instruction system for AI-powered resume optimization across multiple LLMs.

---

## Overview

This system provides three modes of resume optimization:

| Mode | Purpose | Trigger |
|------|---------|---------|
| **Mode 1** | Full Resume Analysis | User uploads complete resume |
| **Mode 2** | Bullet Optimization | User provides 1-5 bullets to improve |
| **Mode 3** | JD Comparison | User provides job description for tailored bullets |

---

## File Structure

```
/optimize-my-resume/
  README.md                 ← You are here
  CHANGELOG.md              ← Version history and changes
  PROJECT-INSTRUCTIONS.md   ← Paste into Claude Project instructions
  quick-start-mode.md       ← Single file with all modes combined
  
  /core/                    ← Shared configuration
    fit-thresholds.md       ← Fit percentage thresholds for Mode 3
    format-rules.md         ← Character limits, formatting rules
    verb-categories.md      ← 5 action verb categories
    metrics-requirements.md ← Metrics and impact statement targets
    
  /modes/                   ← Individual mode instructions
    mode-1-full-analysis.md
    mode-2-bullet-optimization.md
    mode-3-jd-comparison.md
    
  /wireframes/              ← Visual workflow diagrams
    mode-1-workflow.md
    mode-2-workflow.md
    mode-3-workflow.md
    
  /shared/                  ← Reusable components
    job-summary-creation.md
    initial-greeting.md
```

---

## Quick Start

### For Claude Projects (Simplest)

1. Open your Claude Project
2. Go to Project Instructions
3. Copy entire contents of `PROJECT-INSTRUCTIONS.md`
4. Paste into instructions box
5. Save

### For Other LLMs

1. Use `quick-start-mode.md` as your system prompt
2. Or load individual modules based on context window limits

### For Customization

1. Edit files in `/core/` to change thresholds or rules
2. Edit files in `/modes/` to modify specific mode behavior
3. Combine modules as needed for your use case

---

## Cross-LLM Compatibility

| LLM | Recommended Approach |
|-----|---------------------|
| Claude (200K context) | Use `PROJECT-INSTRUCTIONS.md` or full `quick-start-mode.md` |
| GPT-4 Turbo (128K) | Use `quick-start-mode.md` |
| GPT-4 (8K) | Load individual mode files as needed |
| Gemini Pro (1M) | Use full `quick-start-mode.md` |
| Local models (8-32K) | Load `/core/` + one mode at a time |

---

## Dependencies

For full functionality, you need:

1. **Job History File** (optional but recommended)
   - File: `claude_generated_job_history_summaries.txt`
   - Location: `/mnt/project/` (for Claude Projects)
   - Purpose: Enables Mode 3 to pull from your documented experience

---

## Version

**Current Version:** 5.0  
**Last Updated:** December 2024

See `CHANGELOG.md` for full version history.

---

## License

Open source - free to use, modify, and distribute.
