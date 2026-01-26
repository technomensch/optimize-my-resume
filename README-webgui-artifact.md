# WebGUI Artifact Upload Guide

> **Quick Reference**: Files to upload to Claude Projects for each WebGUI artifact

---

## Overview

Both WebGUI artifacts (`ResumeAnalyzer-webgui.jsx` and `Should-I-Apply-webgui.jsx`) are **self-contained React components**. They make direct API calls to the Anthropic API and don't require file imports at runtime.

However, to get **full system behavior** (guardrails, rules, thresholds), you should upload supporting documentation to your Claude Project.

---

## ResumeAnalyzer-webgui.jsx (v8.5.3)

### Full Resume Analysis & Job History Generation

**Required Files (3 files):**
| File | Path | Purpose |
|------|------|---------|
| ResumeAnalyzer-webgui.jsx | `/claude-artifacts/` | Main artifact code |
| Project-GUI-Instructions.md | `/` (root) | System rules & routing |
| Your Resume | User-provided | Analysis input |

**Optional - Enhanced Context (9 files):**
| File | Path | Purpose |
|------|------|---------|
| ra_job-history-creation.md | `/optimization-tools/resume-analyzer/` | 12-section schema |
| ra_quality-gates-guardrails.md | `/optimization-tools/resume-analyzer/` | Quality checks |
| ra_report_structure.md | `/optimization-tools/resume-analyzer/` | Report structure & section ordering |
| ra_resume-analyzer-display.md | `/optimization-tools/resume-analyzer/` | Display rules & formatting |
| shared_core_principles.md | `/optimization-tools/shared/` | Universal optimization principles |
| shared_verb_taxonomy.md | `/optimization-tools/shared/` | Verb categories (Built, Lead, etc.) |
| webgui_artifact_config.md | `/optimization-tools/webgui/` | Model selection & error handling |
| format-rules.md | `/core/` | Character limits, ATS rules |
| verb-categories.md | `/core/` | Verb distribution thresholds |

---

## Should-I-Apply-webgui.jsx (v1.3.0) <!-- v1.3.0 Change: Added model regeneration and error feedback -->

### Job Fit Assessment & Application Customization

**Required Files (3 files):**
| File | Path | Purpose |
|------|------|---------|
| Should-I-Apply-webgui.jsx | `/claude-artifacts/` | Main artifact code |
| Project-GUI-Instructions.md | `/` (root) | System rules & routing |
| Your Job History | From Resume Analyzer output | Analysis input |

**Optional - Enhanced Context (10 files):**
| File | Path | Purpose |
|------|------|---------|
| bo_keyword_handling.md | `/optimization-tools/bullet-optimizer/` | Keyword evidence & coverage reporting |
| jfa_job-fit-assessment.md | `/optimization-tools/job-fit-analyzer/` | Fit score logic |
| jfa_workflow-router.md | `/optimization-tools/job-fit-analyzer/` | Routing scenarios |
| ng_summary-generation.md | `/optimization-tools/narrative-generator/` | Per-JD customization |
| shared_core_principles.md | `/optimization-tools/shared/` | Universal optimization principles |
| shared_keyword_validation.md | `/optimization-tools/shared/` | Keyword evidence rules |
| webgui_artifact_config.md | `/optimization-tools/webgui/` | Model selection & error handling |
| fit-thresholds.md | `/core/` | Score thresholds (50+, 75+, etc.) |
| industry-context.md | `/core/` | Industry transferability |
| keyword-context.md | `/core/` | Keyword validation rules |

---

## Minimal Setup (2 files + resume)

For quick testing, upload only:

1. **The JSX artifact** you want to use
2. **Project-GUI-Instructions.md** (system rules)
3. **Your resume** (for analysis)

The artifacts contain embedded prompts that will produce functional results even without the optional modules.

---

## File Naming in Claude Projects

When uploading to Claude Projects, files become accessible as `/files/[filename]`:

| Local Path | Claude Project Path |
|------------|---------------------|
| `optimization-tools/resume-analyzer/ra_job-history-creation.md` | `/files/ra_job-history-creation.md` |
| `core/format-rules.md` | `/files/format-rules.md` |

The JSX artifacts will auto-resolve paths based on context (see `<path_resolution>` in Project-GUI-Instructions.md).

---

## Version Compatibility

| Artifact | Version | Last Updated | Compatible With |
|----------|---------|--------------|-----------------|
| ResumeAnalyzer-webgui.jsx | v8.5.3 | Jan 16, 2026 | v9.2.0 instructions |
| Should-I-Apply-webgui.jsx | v1.3.0 | Jan 26, 2026 | v9.2.1 instructions |

---

## Guardrails Referenced

Both artifacts respect these project guardrails (embedded in prompts):

- **Guardrail #29**: Metric Preservation (never lose metrics)
- **Guardrail #32**: Custom Keyword Evidence Check
- **Guardrail #33**: Narrative Verification
- **Guardrail #34**: JD Keyword Visibility (top 5 matched/missing)
- **Guardrail #35**: Post-analysis customization offer (fit ≥ 50)

---

## Quick Start

### Resume Analyzer
1. Upload `ResumeAnalyzer-webgui.jsx` + `Project-GUI-Instructions.md`
2. Ask Claude: *"Render the Resume Analyzer artifact"*
3. Paste your resume and select a model
4. Download your job history (XML or Markdown)

### Should I Apply?
1. Upload `Should-I-Apply-webgui.jsx` + `Project-GUI-Instructions.md`
2. Have your job history ready (from Resume Analyzer)
3. Ask Claude: *"Render the Should I Apply artifact"*
4. Paste job history + job description
5. Get fit score and customized content (if ≥ 50%)
