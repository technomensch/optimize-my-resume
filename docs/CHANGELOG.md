# Changelog

## Current Version: v8.4.0 <!-- v8.4.0 Issue #31 -->

## Version History <!-- v1.0 Addition -->
- v1.0: Added v7.0.0 Local Development Environment with Ollama Integration entry <!-- v1.0 Addition -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/job history creation.0.html).


### v8.4.0 - Job History Template Extraction (Issue #31)
- **Modular XML Schema**: Extracted the 13-section XML job history structure into a dedicated module to reduce token consumption and improve maintainability.
- **Shadow Modularization**: Implemented the ADR-004 pattern for the template system, keeping the Gold Master synchronized while enabling modular consumption by the GUI.

### v8.3.1 - Bullet Generation Improvements & Governance (Issue #42, #43, #44)
- **Causal Impact Linking** (Issue #43): Mandating syntactic links between qualitative claims and hard metrics using "Causal Connectors."
- **Portfolio Employment Labeling** (Issue #43): Preventing legal/ethical misrepresentation by enforcing "(Independent Project)" labeling for side projects.
- **Action Verb Visuals** (Issue #43): Introduced ASCII block visuals (e.g., `████░░░░░░`) for instant verb distribution analysis.
- **Chronology Depth Logic** (Issue #44): Standardizing "fade out" rules for older positions based on a 6-year recency threshold and 5-year tenure significance.
- **Modularity Compliance Gate** (Issue #42): Enforces "Shadow Modularization" (Module → Gold Master Sync → GUI Reference) for all new logic.
- **Workflow Lifecycle Compliance** (Issue #42): Mandates Issue creation, branching, and implementation planning before any execution.

### v8.3.0 - Quality Gates Module Extraction (Issue #32)
- **Shadow Modularization** - Extracted Quality Assurance rules and Guardrails to `quality-gates-guardrails.md`.
- **Token Efficiency** - Replaced ~800 lines of system logic in `Project-GUI-Instructions.md` with an active `<modular_reference>`.

### v8.2.0 - Job Fit Assessment Module (Issue #29)
- **Shadow Modularization** - Extracted Job Fit Assessment logic to [job-fit-assessment.md](optimization-tools/job-fit-analyzer/job-fit-assessment.md).
- **Token Optimization** - Replaced ~1,000 lines of redundant logic in `Project-GUI-Instructions.md` with an active `<modular_reference>`.
- **Gold Master Protection** - Implemented "Silent Sync" HTML comments in `PROJECT-INSTRUCTIONS.md`.

### v7.1.1 - Metric Preservation & Technical Exception (Issue #34)
- **Metric Preservation Guardrail** - Enforces "Data Integrity Audit" to prevent loss of numeric metrics during rewriting.
- **Technical Role Exception** - Refined Industry Gap logic to reduce penalties by 75% for technical workflow matches.
- **Version Bump** - Synchronized v7.1.1 across all instruction modules and core files.

### v7.1.0 - Strategic Assessment Methodology (v7.1-prompt-alignment-update)
- **Strategic Rare Skill Override** - Introduced CRITICAL override for rare required skills (<20% prevalence).
- **Deliverables Over Titles Rule** - Prioritizes impact and deliverables over job titles.
- **Technical Transferability Exception** - Reduced industry mismatch penalties for technical roles.
- **Updated Fit Thresholds** - Calibrated ranges to 85/75/65/55 to account for JD inflation.
- **Real-World Hiring Context** - Integrated hiring manager calibration principles.

### v6.5.4 - Planned Improvements
- **JSON Truncation Fix** - Full implementation of sequential position analysis for 3+ position resumes (Issue #7).
- **Token Tracking** - Session-based token usage tracking (ENH-001).

## [Released]

### v7.0.0 - Local Development Environment with Ollama Integration (2026-01-10)
> **Branch:** `7.0.0-create-local-dev-test-environment`

#### Added
- **Complete Local Development Environment** - React + Vite application for local development using Ollama AI models
  - Enables development without consuming Claude API tokens
  - Works completely offline (after initial model download)
  - Unlimited, free usage for development and testing

- **Ollama Service Integration** (`src/services/ollamaService.js`)
  - `checkHealth()` - Test Ollama connection status
  - `listModels()` - Get installed models from local Ollama instance
  - `generate()` - Text generation wrapper
  - `chat()` - Chat completions wrapper
  - `analyzeResume()` - Resume-specific analysis implementation
  - Comprehensive error handling for connection, parsing, and timeout issues

- **Configuration-Driven Model Management** (`src/config/models.json`)
  - Single JSON file controls which models appear in UI
  - No code changes needed to add/remove/reorder models
  - Supports multiple AI providers (Ollama, Claude)
  - Easy customization for non-developers

- **ResumeAnalyzer Component** (`src/components/ResumeAnalyzer.jsx`)
  - Full-featured resume analyzer adapted from Phase1ResumeAnalyzer.jsx
  - Ollama connection status indicator (connected/disconnected/checking)
  - Auto-detection of installed models
  - "Check Status" button to retry connection
  - Enhanced error messages specific to Ollama scenarios
  - Debug mode toggle for troubleshooting
  - Same UI/UX as production artifact for consistency

- **5 Pre-Configured Ollama Models**
  1. Llama 3.1 (8B) - Recommended, best balance
  2. Mistral - Fast analysis
  3. Gemma 2 (9B) - Analytical focus
  4. Qwen 2.5 (7B) - Creative rewrites
  5. Phi-3 - Low RAM, precise

- **Comprehensive Documentation** (6 guides, 9,000+ lines)
  - `GET-STARTED.md` - Quick start guide for new users
  - `README-LOCAL-DEV.md` - Complete local environment documentation
  - `SETUP-GUIDE.md` - Step-by-step installation and troubleshooting
  - `docs/MODEL-CONFIGURATION-GUIDE.md` - Detailed model customization guide
  - `docs/v7.0.0-LOCAL-DEV-SETUP-SUMMARY.md` - Technical summary and architecture
  - `STATUS.md` - Current status, roadmap, and known issues

- **Automated Setup Script** (`quick-start.sh`)
  - Checks prerequisites (Node.js, npm, Ollama)
  - Installs dependencies
  - Verifies Ollama status
  - Offers to download recommended model
  - Guides user through complete setup

- **Build Configuration**
  - Vite 7.x (fast dev server, HMR)
  - React 19.x
  - Tailwind CSS v4 (with @tailwindcss/postcss plugin)
  - ES modules (not CommonJS)
  - Production-ready build process

#### Changed
- **package.json**
  - Added scripts: `dev`, `build`, `preview`
  - Type changed to `"module"` (ES modules)
  - Dependencies: React 19, Vite 7, Tailwind 4, Lucide React

- **.gitignore**
  - Added Vite/React build artifacts (`/dist`, `.vite`)
  - Added environment variables (`.env*`)
  - Added editor directories (`.vscode`, `.idea`)
  - Added OS files and logs

#### Impact
- ✅ **Zero Token Cost** - Unlimited local development without API costs
- ✅ **Privacy** - Resume data never leaves user's machine
- ✅ **Offline Capable** - Works without internet (after setup)
- ✅ **Fast Iteration** - Test changes without token consumption
- ✅ **Easy Customization** - Model configuration via JSON file
- ✅ **Feature Parity** - Same features as production Claude artifact
- ✅ **Well Documented** - 6 comprehensive guides covering all scenarios

#### Technical Details
- **Files Created**: 18 files (source code, config, documentation, scripts)
- **Source Code**: ~1,200 lines (component, service, config)
- **Documentation**: ~9,000 lines (6 guides)
- **Architecture**: Service layer pattern, configuration-driven models
- **Development Mode**: HMR with instant reloads on save
- **Production Build**: Optimized Vite build to `dist/`

#### Dual Environment Strategy
- **Production (Claude Artifact)**: Cloud-based, token-limited, best quality
  - For end users
  - Requires internet
  - Uses Claude API (Haiku/Sonnet/Opus)

- **Local Dev (This Branch)**: Machine-based, unlimited, offline-capable
  - For developers
  - No token costs
  - Uses Ollama (Llama/Mistral/Gemma/Qwen/Phi)

#### Future Enhancements (Roadmap)
- **Phase 2**: Bullet optimization, JD matching, streaming responses
- **Phase 3**: Resume history, multi-model comparison, performance benchmarks
- **Phase 4**: Custom prompts, export formats (PDF/DOCX), batch processing
- **Phase 5**: Automated testing, error recovery, performance optimization

#### Known Issues
- **JSON Parsing Failures** - Some models produce invalid JSON with complex resumes
  - Workaround: Use Llama 3.1 (best JSON accuracy), simplify resume
- **Slow Large Models** - 70B+ models can take 2-5 minutes
  - Workaround: Use 8-13B models for development
- **Setup Complexity** - Requires Ollama installation
  - Mitigation: Automated quick-start script, comprehensive guides

#### Migration Notes
- This is a parallel development environment, not a replacement
- Production artifact (Claude) remains unchanged
- No impact on existing users or workflows
- Developers can use local environment without affecting production

#### Documentation
- See `docs/plans/7.0.0-create-local-dev-test-environment.md` for complete implementation plan
- See `GET-STARTED.md` for quick start instructions
- See `README-LOCAL-DEV.md` for comprehensive documentation

---

### v6.5.3.1 - Documentation Infrastructure Cleanup (2026-01-09)
> **Branch:** `v6.5.3.1-doc-cleanup`

#### Changed
- **Documentation Infrastructure** - Centralized all project plans and handoffs into a new [Documentation Index](docs/plans/INDEX.md).
- **Archiving** - Moved v6.1-v6.5.1 plans and handoff documents to `docs/plans/archive/` subdirectories to improve repository hygiene.
- **Reference Updates** - Standardized on relative paths across all active planning documents.

### v6.5.3 - Per-Bullet Repairs & Documentation Sync (2026-01-09) <!-- v6.5.3 Addition -->
> **Branch:** `v6.5.3-analyzer-enhancements-part-2`

#### Added
- **Per-Bullet Recommendations** - UI component that displays consolidated, actionable feedback directly below the relevant bullet point.
- **Explicit Known Issues** - Added `<known_issues>` section to `PROJECT-INSTRUCTIONS.md` covering the JSON truncation limitation.

#### Changed
- **Repairs Summary Strategy** - Moved detailed repair suggestions from the Executive Summary to the per-bullet context to reduce redundancy (Issue #6).
- **ID Synchronization** - Updated all internal documentation tracks to use GitHub Issue IDs (e.g., Issue #1 → #13) instead of local session IDs.

### v6.5.2 - Resilient Error Handling & UX (2026-01-08) <!-- v6.5.2 Addition -->
> **Branch:** `v6.5.2-analyzer-enhancements-part-1`

#### Added
- **Model Selection UI** - Dropdown to select between Haiku, Sonnet, and Opus models with token cost estimates (#1, #2).
- **Progressive Error Handling** - Smart recovery logic for JSON parsing errors, including debug mode (#3).
- **Rate Limit Management** - Friendly countdown timer for API rate limit (429) errors (#5).
- **Verb Balance Visuals** - Progress bars and status badges for action verb distribution (#4).

### v6.5.1 - Analyzer Output Overhaul & Bugfixes (2026-01-08) <!-- v6.5.1 Addition -->
> **Branch:** `v6.5.1` | `v6.5.1-analyzer-report-bugfixes`

#### Added
- **Verb Distribution Flagging** - Implemented 5% threshold detection for verb categories, flagging imbalances as TWEAK (#14).
- **Position Header Overhaul** - Expanded position headers to show full 4-field metadata (Inferred Title, Company, Dates, Seniority) and a hiring manager insight statement (#15).
- **Detailed Repairs Generation** - Automated detection of metrics gaps, formatting issues, and verb weaknesses, populating the `repairsNeeded` array for user feedback (#16).
- **Resilience Improvements** - Increased API token limits and added user-friendly error handling for complex/oversized resume analysis (#17).
- **Metric Indicator Refinement**: Replaced simple ✓/- icons with explicit labels: `✓ [Has Metrics]` and `- [No Metrics]`.
- **Robust Job History Summary Rules**: Implemented `<job_history_summary_generation_rules id="8">` with multi-format download support (XML, MD, ZIP) and strict naming conventions.
- **Improved Acronym Guardrails**: Added specific list of allowed standard acronyms and instructions for domain-specific expansions.

#### Fixed
- **Audit Table Formatting**: Converted ASCII audit tables to Markdown for better readability and added line breaks in "Length" analysis.
- **Verb Display Rule**: Corrected rule to show action verbs cleanly while preserving category tracking.
- **Executive Summary Header**: Ensured all analyzer reports start with `# 📊 Executive Summary`.
- **Phase 1 Job History Rendering**: Resolved bug where metric indicators and verb categories were not rendering correctly in the chat window.
- **Phase 2 Verb Standardization**: Standardized all Phase 2 and global verb category references to use the official set: `Built, Lead, Managed, Improved, Collaborate`.

### v6.5.0 - Analyzer Auditing & Hiring Manager Perspective (2026-01-07) <!-- v6.5.0 Addition -->
> **Branch:** `v6.5.0-add-missing-analyzer-audit-elements`

#### Added
- **Hiring Manager Perspective** - New analysis section that ignores resume titles and infers roles based on actual work/impact.
- **Per-Bullet Auditing** - Detailed 3-row audit table for every bullet (Action Verb, Metrics, Length).
- **Job History Creation Auto-Generation** - Automatically extracts and formats job history during Phase 1 analysis.
- **Export Functionality** - One-click downloads for Job History (XML, Markdown, ZIP).
- **Visual Enhancements** - Color-coded action verbs and "Has Metrics" (✓/-) indicators.
- **Guardrail #28** - `bullet_grouping_verification_guardrail` ensures correct chronological groupings.
- **Metrics Principle** - New core principle targeting 70-80% quantified bullet coverage.

#### Changed
- **Phase 1 Report Structure** - Significantly expanded to include new audit sections and export tools.
- **Plain Text Export** - Updated to preserve job title grouping and reverse-chronological order.

---

### v6.4.0 - Enhanced User Entry Experience (2026-01-05) <!-- v6.4.0 Addition -->
> **Branch:** `v6.4.0-update-user-initial-prompt`

#### Changed
- **Initial User Prompt** – Replaced single-path bullet optimizer greeting with comprehensive A/B/C/D/E entry menu that routes users based on what they have:
  - **Option A (Resume File)**: Routes to comprehensive job summary creation with probing questions
  - **Option B (Resume Bullets)**: Routes to targeted bullet optimization with metric analysis
  - **Option C (Job Description)**: Routes to fit analysis before optimization
  - **Option D (Role from Memory)**: Routes to guided summary building from scratch
  - **Option E (Confused/Unsure)**: Provides system explanation and re-prompts for clarity

#### Benefits
- Eliminates funnel problem where all users were forced through bullet optimization workflow regardless of starting point
- Sets clearer expectations for each entry path based on user's current material
- Maintains routing to existing workflows with no structural changes to core system
- Preserves honest "no fabrication" messaging throughout all entry points

---

### v6.3.1.2 - Wireframe Alignment & Guardrail Documentation (2026-01-05) <!-- v6.3.1.2 Addition -->
> **Branch:** `v6.3.1-address-instruction-gaps`

#### Added
- **Rules & Guardrails Wireframes** – Created architectural diagrams (`wireframes/rules-and-guardrails-ascii.md`, `wireframes/rules-and-guardrails-mermaid.md`) to visualize the 3-layer system defense strategy.
- **Architectural Indexing** – Created `core/README.md` to serve as a central directory for all "Rules-as-Code" modules.
- **Verification Testing** – Created `docs/plans/testing/guardrail-verification.md` to establish test protocols for all 27+ guardrails.

#### Changed
- **Wireframe Synchronization (v1.1)** – Updated all Phase-specific and Workflow wireframes to include:
  - **Phase 1**: Fit Assessment Gate (80% stop/proceed logic).
  - **Phase 2**: Calibrated Scoring (Industry/Role-type penalties).
  - **Phase 3**: Quality Formatting Guardrails (Chrono sort, phrase repetition).
  - **Phase 4**: Production Hardening (Word budgets, symbol sanitization).
- **Project Roadmap** – Updated `ROADMAP.md` to v6.3.1 and marked the alignment phase complete.

---

## [Released]

### v6.3.0 - System Integrity Guardrails (2026-01-03) <!-- v6.3.0 Addition -->
> **Branch:** `v6.3.0-adding_guardrails`

#### Added
- **27 Comprehensive Quality Guardrails** - Integrated across all modular components and core instruction files to ensure data integrity, factual accuracy, and user experience consistency.
- **Pass 1: Data Integrity** (#1-4)
  - **Metric Isolation (#1)**: Ensures metrics are uniquely tied to specific positions and traceable to their original source in the job history.
  - **Chronological Integrity (#2)**: Mandates reverse-chronological order for all position displays and exports.
  - **Summary Abstraction (#3)**: Prevents professional summaries from duplicating bullet wording, forcing high-level overview.
  - **Metric Compatibility (#4)**: Heuristic validation to ensure metrics (%, $, volume) match the role's scope and seniority.
- **Pass 2: Data Safety** (#5-7)
  - **Honest Limitations (#5)**: Critical gate preventing claims that exceed user's stated limitations or experience caps.
  - **Data Loss Prevention (#6)**: Integrity checks before file saves to prevent accidental overwriting of unrelated history data.
  - **Skill Classification Mutual Exclusivity (#7)**: Logic to ensure skills don't appear in both hard and soft skills categories simultaneously.
- **Pass 3: Quantitative Enforcement** (#8-14)
  - **Budget Compliance Gate (#8)**: Strict enforcement of character-per-bullet (100-210) and word-per-section (350-500) limits.
  - **Verb Diversity Per-Position (#9)**: Prevents sharing the same verb category twice within any single position's bullets.
  - **JD Keyword Density (#10)**: Validates that keyword optimization doesn't compromise content quality or authenticity.
  - **Plausibility Filter (#11)**: Common-sense validation logic for numeric claims (e.g., preventing >100% efficiency gains without context).
  - **Position Recency Weighting (#12)**: Systematically prioritizes bullet count and metric density for the most recent role.
  - **Summary-to-Bullet Metric Reconciliation (#13)**: Ensures every metric in a customized summary has a matching supporting bullet.
  - **Quality Gate Iteration Limit (#14)**: Safeguard preventing infinite regeneration loops (capped at 3 iterations) with diagnostic fallback.
- **Pass 4: Cross-Phase Consistency** (#15-21)
  - **Phrase Repetition Enforcement (#15)**: Scans for 3+ word phrases appearing 3+ times across the entire resume.
  - **Inventory Protection (#16)**: Prevents adding skills to the master inventory without literal backing from a position's achievements.
  - **Scope Attribution Validation (#17)**: Distinguishes between "Individual Contributor" achievements and "Leading/Managing" team-wide results.
  - **Fitz Assessment Score Consistency (#19)**: Validates that match scores (0-100) logically align with identified gaps and red flags.
  - **Acronym Expansion (#20)**: Mandates spelling out domain-specific acronyms on first use to ensure ATS and recruiter clarity.
  - **Skill Inventory Context (#21)**: Verifies suggested skills are contextually appropriate for the professional level of the role.
  - **Em-Dash Validation (#22)**: Automated scanner for forbidden Unicode characters (—) often caused by word processors.
- **Pass 5: User Experience** (#22-27)
  - **Skill/Metric Conflict Resolution (#18)**: Resolves contradictions between JD requirements and History limitations before processing.
  - **User State Persistence (#23)**: Ensures preferences and context (remote status, role titles) persist across different workflow steps.
  - **Alternatives Presentation Consistency (#24)**: Guarantees exactly 3 distinct verb-category alternatives are presented during optimization.
  - **Confirmation Tracking (#25)**: Prevents repetitive clarifying questions by logging previous user approvals within the session.
  - **Output Order Enforcement (#26)**: Enforces a strict section sequence for final optimized outputs to ensure consistent presentation.
  - **Output Format Consistency Scanner (#27)**: Final scan for markdown anomalies, broken links, or placeholder text before presentation.

#### Changed
- **PROJECT-INSTRUCTIONS.md** (v6.2.0 → v6.3.0) - Integrated Master Guardrail Checklist into `<quality_assurance_rules>`.
- **quick-start-phase.md** (v6.2.0 → v6.3.0) - Added condensed 27-point Guardrail Checklist.
- **Modular Instruction Files** - All core and phase instructions versions updated to v6.3.0 (or equivalent) with specific guardrail implementations.

#### Impact
- ✅ **Zero-Trust Content Integrity**: Eliminated hallucination risks by requiring literal evidence for every claim.
- ✅ **Structural Consistency**: Guaranteed output formatting and section ordering across all LLM models.
- ✅ **Safety and Authenticity**: Honest limitations and plausibility filters ensure resumes remain defensible in interviews.
- ✅ **Improved UX**: Reduced repetitive prompts and maintained persistent user state throughout the session.

---

### v6.2.0 - Job History Template System & Workflow Automation (2026-01-02) <!-- v6.2.0 Addition -->
> **Branch:** `v6.2.0-job-history-templates`

#### Added
- **Job History Template System** - Comprehensive template infrastructure ensuring cross-LLM consistency
  - **XML Schema Template** (`templates/job_history_template.xml`) - Defines exact structure all LLMs must follow
    - 13 required sections per position (metadata, professional_summary, core_responsibilities, key_achievements, etc.)
    - Standardized tag names (no synonyms allowed)
    - Mandatory section ordering
    - Standardized date formats ("Month Year" or "Present")
  - **Markdown Template** (`templates/job_history_template.md`) - Presentation format structure
    - Emoji headers (🎯, 🏢, 📊, 💼)
    - Markdown tables for metrics
    - Hierarchical organization
  - **LLM Generation Instructions** (`templates/LLM_GENERATION_INSTRUCTIONS.md`) - 3,500+ word comprehensive guide
    - Exact schema enforcement rules
    - Tag name requirements with EXACT MATCH table
    - Section order mandates
    - Achievement structure (CONTEXT/ACTION/RESULT/IMPACT)
    - Style & tone guidelines
    - Common mistakes to avoid
  - **Template System README** (`templates/README.md`) - Complete system documentation
    - Template system overview and purpose
    - File descriptions and usage
    - Workflow diagrams
    - Quick start guide
    - Format comparison (.txt vs .md)
    - Best practices and troubleshooting

- **Python Automation Tools** - Validation and conversion infrastructure
  - **Validation Script** (`scripts/validate_job_history.py`) - 226 lines, ensures schema compliance
    - Header format validation
    - Version history presence checking
    - Required global sections verification (education, certifications, master_skills_inventory)
    - Required position sections validation (13 sections per position)
    - Metadata completeness checks (job_title, company, dates, duration)
    - Professional summary length validation (minimum 2 sentences)
    - XML tag balance verification (all tags properly opened/closed)
  - **Conversion Script** (`scripts/convert_job_history_to_md.py`) - 400+ lines, converts .txt to .md
    - XML parsing with regex
    - Emoji header generation
    - Markdown table formatting for metrics
    - Hierarchical structure creation
    - Achievement expansion (CONTEXT/ACTION/RESULT/IMPACT)
    - Professional summary formatting
    - Skills list conversion

- **Workflow Skills** - Automated workflow management
  - **`/md-job-history` Skill** (`.claude/skills/md-job-history.md`) - Convert job history to Markdown
    - Context-aware file detection
    - Automatic validation before conversion
    - User-friendly error messages
    - Integration with /update-history workflow
  - **`/update-history` Skill** (`.claude/skills/update-history.md`) - Intelligent version management
    - Analyzes chat context to identify updates
    - Determines version increment (MAJOR/MINOR/PATCH)
    - Applies surgical updates (preserves existing content)
    - Validates and converts to both formats
    - Provides summary of changes

- **Dual-Format Architecture** - Optimized for both machines and humans
  - **.txt format (XML structure)** - Source of truth for LLM consumption
    - XML-like tag structure for semantic clarity
    - Explicit section markers
    - Schema validation compatible
    - Optimized for LLM parsing
  - **.md format (Markdown)** - Presentation format for human viewing
    - Generated automatically from .txt
    - Emoji headers and professional formatting
    - Markdown tables
    - Do NOT edit directly (regenerate from .txt)

#### Changed
- **PROJECT-INSTRUCTIONS.md** - Added comprehensive `<job_history_template_system>` section (v6.1.11 → v6.2.0)
  - 385 lines of template system documentation
  - Dual-format architecture explanation
  - Validation and conversion workflows
  - Workflow skills documentation
  - Best practices and cross-LLM consistency guarantees
  - Integration with Phases 1, 2, and 3
- **quick-start-phase.md** - Added condensed `<job_history_template_system>` section (v6.1.11 → v6.2.0)
  - Quick reference for template system
  - Critical rules and required structure
  - Validation and conversion workflow
  - Version management guidelines

#### Impact
- ✅ **Cross-LLM Consistency** - Claude, Gemini, ChatGPT, Copilot all generate identical structure
- ✅ **Automated Validation** - Schema violations caught immediately
- ✅ **Dual-Format Output** - .txt for LLMs, .md for humans
- ✅ **Workflow Automation** - /md-job-history and /update-history skills streamline management
- ✅ **Version Management** - Clear MAJOR/MINOR/PATCH increment rules
- ✅ **Surgical Updates** - Preserve existing content, enhance specific sections
- ✅ **Template System** - Prevents structural drift as LLM technology evolves
- ✅ **Comprehensive Documentation** - 3,500+ word guide ensures consistency

#### Philosophy
- Keep .txt as source of truth, generate .md for presentations
- Always validate before converting
- Use surgical updates only - preserve existing content, add/enhance specific sections
- Template system ensures consistency across all LLMs now and in the future

#### Files Created (6,452 lines total)
- Templates: 4 files (~1,515 lines)
- Scripts: 2 files (~626 lines)
- Skills: 2 files (~697 lines)
- Job history: v7.0, v7.1 with .txt and .md formats (~2,714 lines)
- Plans: Implementation plan (~900 lines)

---

### v6.1.11 - Keyword Evidence Principle & Enhanced Quality Controls (2025-12-31)
> **Branch:** `v6.1.11-various_fixes`

#### Added
- **Keyword Evidence Principle** - Critical principle preventing keyword stuffing without backing evidence
  - Added `<keyword_evidence>` principle to core_principles (priority: critical)
  - Cross-references keywords against job history positions before optimization
  - Only includes keywords evidenced in: tools_technologies, hard_skills_demonstrated, soft_skills_demonstrated, key_achievements
  - Ignores keywords from master_skills_inventory without position evidence
  - Exception: User can explicitly confirm unevidenced skills ("I have Confluence experience")
- **Keyword Input Handling** - Comprehensive workflow for keyword optimization requests
  - Added `<keyword_input_handling>` section after Phase 3 definition
  - Handles two scenarios: keywords WITH JD, keywords AFTER bullet generation
  - Categorizes keywords: ✓ EVIDENCED, ✗ NOT EVIDENCED, ? UNCLEAR
  - Outputs keyword coverage report showing incorporated, skipped, and clarification-needed keywords
  - Prevents fabricating context for unevidenced keywords
- **Keyword Coverage Report** - Transparent reporting of keyword optimization
  - Shows which keywords were incorporated (with position and bullet references)
  - Lists skipped keywords with reasons (not evidenced in job history)
  - Flags keywords requiring user clarification
- **Chronological Order Verification** - Ensures plain text export maintains reverse chronological order
  - Added step_1_verify_chronological_order to automatic_plain_text_export
  - Verifies positions ordered newest → oldest before file creation
  - Uses dates, tenure duration, or context clues to confirm ordering
  - Enforces standard resume conventions (most recent job first)

#### Changed
- **PROJECT-INSTRUCTIONS.md** - Added keyword_evidence_principle, keyword_input_handling, and chronological order verification (v6.1.10 → v6.1.11)
- **quick-start-phase.md** - Added keyword_evidence_principle and keyword_input_handling sections (v6.1.9 → v6.1.11)
- **core/format-rules.md** - Updated version (v6.1.10 → v6.1.11)
- **Phase 3 behavior** - Added "Handle keyword input according to keyword_input_handling rules"
- **Automatic Plain Text Export** - Added step_1_verify_chronological_order before file creation

#### Impact
- ✅ Prevents keyword stuffing and maintains resume authenticity
- ✅ Ensures keywords only included when backed by actual job history
- ✅ Transparent reporting shows users which keywords could/couldn't be incorporated
- ✅ User confirmation required for unevidenced keywords
- ✅ Better alignment between resume content and actual experience
- ✅ No breaking changes - additive enhancement only

#### Philosophy
- Better to omit a keyword than to invent context for it
- Keywords without evidence will seem forced if hiring manager investigates
- Fabricating keyword context creates inauthentic resumes

---

### v6.1.10 - Automatic Quality Gate & Plain Text Export (2025-12-31)
> **Branch:** `v6.1.10-fix_2nd_pass`

#### Added
- **Automatic Quality Gate with Regeneration Loop** - Mandatory quality enforcement before output presentation
  - **Step 1**: Run `pre_output_quality_checklist` automated scans
    - Escaped characters (\~, %, \+) detection and correction
    - Gerund detection (bullets starting with -ing verbs)
    - Repeated phrase detection (>2 exact occurrences)
    - Keyword duplication checking (summary vs bullets)
  - **Step 2**: Verb diversity validation
    - All 5 verb categories must be represented (Built, Lead, Managed, Improved, Collaborate)
    - No category can appear 0 times across bullets
    - No category can repeat within same position
    - Balanced distribution preferred (13-27% per category)
  - **Step 3**: Automatic regeneration if issues found
    - Identifies affected positions and specific issues
    - Regenerates bullets using missing categories
    - Re-runs quality checklist
    - Repeats until all checks pass (max 3 iterations)
  - **Step 4**: Triggers plain text export after passing
- **Automatic Plain Text Export** - Auto-generated clean copy-paste format after quality validation
  - Plain text file created in `/mnt/user-data/outputs/[job-title]-bullets.txt`
  - Clean format: No markdown, no escaped characters, proper bullet points (•)
  - Includes metadata: character counts, word counts, verb category distribution
  - Auto-displayed in response with copy-paste code block
  - Directory auto-created if doesn't exist

#### Changed
- **PROJECT-INSTRUCTIONS.md** - Added `<automatic_quality_gate>` and `<automatic_plain_text_export>` sections after `pre_output_quality_checklist`
- **core/format-rules.md** - Added validation requirements for quality gate and plain text export
- **Version number** - Updated from 6.1.9 to 6.1.10 across all files

#### Impact
- ✅ Zero quality issues in final output (escaped chars, gerunds, missing verb diversity)
- ✅ All 5 verb categories guaranteed to be represented in every resume
- ✅ No repeated verb categories within same position
- ✅ Plain text export auto-generated for easy copy-paste
- ✅ Reduced manual formatting work for users
- ✅ Transparent verb category distribution in metadata
- ✅ No breaking changes - additive enhancement only

#### Technical Details
- **Blocking gate**: Output cannot be presented until quality checks pass
- **Max iterations**: 3 regeneration attempts to prevent infinite loops
- **Fallback**: If issues persist after 3 iterations, present best attempt with warning
- **Smart regeneration**: Only regenerates affected bullets, not entire resume
- **Category-aware**: Regeneration prioritizes missing verb categories

---

### v6.1.9 - Skill Priority Weights & Test Case Expansion (2025-12-30)
> **Branch:** `v6.1.9-gap-analysis_test-cases`

#### Added
- **Skill Priority Weights (3:2:1 Model)** - Industry-standard ATS scoring methodology based on Rezi.ai, Jobscan, and Recruiterflow best practices
  - **Required skills**: 1.5x weight (priority 3) - "Required", "Must have", "Essential"
  - **Preferred skills**: 1.0x weight (priority 2) - "Preferred", "Nice to have", "Bonus"
  - **Optional skills**: 0.5x weight (priority 1) - Inferred from context, not emphasized
  - Missing a Required skill now has 1.5x the negative impact of missing a Preferred skill
- **Expanded Test Suite** - 79 total test cases for Phases 2-4 (47 new Opus tests + 32 Sonnet baseline)
  - **INTX (8)**: Complex integration (contractors, freelance, stale skills)
  - **INCX (10)**: Advanced position manipulation (batch, merge, undo)
  - **DIFFX (7)**: Complex diff scenarios (batch, regression, stale cache)
  - **SUMX (8)**: Advanced summary (executive, entry-level, pivots)
  - **GATE (7)**: Blocking gate combinations and edge cases
  - **ERR (7)**: Error recovery and system resilience
  - **FIX (12)**: Logic corrections and gap-filling tests

#### Changed
- **Scoring Formula** - `optimization-tools/bullet-optimizer/evidence-matching.md` updated with priority-weighted calculation
- **System Instructions** - `PROJECT-INSTRUCTIONS.md` and `quick-start-phase.md` updated with skill priority weights
- **Core Configuration** - `core/fit-thresholds.md` now includes skill-level priority weights alongside category weights

#### Fixed
- **Sonnet Test Logic Errors** - Corrected 4 issues in original test definitions:
  - INC-004: Index direction corrected from "shifted up" to "shifted DOWN"
  - SUM-005: Threshold corrected from 42 to 30 (actual blocking gate value)
  - INT-007: Added explicit weight ratio (Required = 1.5x Preferred)
  - INT-006: Clarified confidence boundary as ">= 0.5" (inclusive)

#### Impact
- ✅ More accurate job fit scoring that reflects recruiter evaluation patterns
- ✅ Better test coverage for edge cases and error scenarios
- ✅ Improved blocking gate reliability at boundary conditions
- ✅ No breaking changes - additive enhancement only

---

### v6.1.7 - Gemini Grammar Tips & Quality Assurance (2025-12-29)
> **Branch:** `v6.1.7-gemini-grammar-tips`

#### Added
- **Quality Assurance Rules** - Integrated comprehensive grammar, consistency, and variation rules into core instructions
  - **Phrase Variation Rule**: Prevents exact repetition of metrics/achievements (max 2 occurrences)
  - **Symbol Consistency Rule**: Standardizes use of tildes (~), percentages (%), and hpyhenated ranges; prohibits escaped characters (\~, %, \+)
  - **Verb Tense Rule**: Enforces past-tense action verbs at the start of all bullets (prohibits gerunds)
  - **Keyword Diversity Rule**: Optimizes keyword distribution between professional summary and position bullets
  - **Pre-output Quality Checklist**: Automated scan patterns for common formatting and grammar issues
- **Workflow Automation** - Implementation plans are now automatically named and saved to `/docs/plans/v[BranchName].md`

#### Changed
- **System Instructions** - `PROJECT-INSTRUCTIONS.md` and `quick-start-phase.md` updated with new `<quality_assurance_rules>` section and mandatory secondary grammar check warning
- **Core Configuration** - `core/format-rules.md` updated to v6.1.7 with technical QA standards

#### Impact
- ✅ Improved resume content quality and professional tone
- ✅ Better ATS compatibility through consistent symbol usage
- ✅ Enhanced keyword coverage without unnecessary redundancy
- ✅ Streamlined developer workflow for implementation planning

---

### v6.1.8 - Location Red Flag Update with State Abbreviation Expansion (2025-12-30)
> **Branch:** `v6.1.8-location_red_flag_update`

#### Added
- **State Abbreviation Mapping** - Complete mapping of all 50 US states + DC for automatic state code expansion
  - Auto-expands state abbreviations: "AL, AK, MT" → "Alabama (AL), Alaska (AK), Montana (MT)"
  - Applies to all location parsing: payroll restrictions, residency requirements, excluded states
  - Improves user experience by showing full state names alongside codes
  - Reduces confusion for users unfamiliar with all state abbreviations

#### Changed
- **Enhanced `location_red_flags` detection** - Added explicit pattern for state-specific remote payroll restrictions
  - New pattern: "The following states are not approved for remote payroll at this time: [list]"
  - Improves blocking gate accuracy for location mismatches during Phase 1 JD parsing
  - Prevents wasted effort on applications where user's state is excluded due to payroll compliance
- **Enhanced `location_mismatch` instruction** - Now references state_abbreviation_mapping for clearer output
  - Example: "Excluded: Alabama (AL), Alaska (AK)" instead of just "AL, AK"

#### Impact
- ✅ Better detection of payroll compliance restrictions during JD parsing (Phase 1)
- ✅ More accurate location blocking gate warnings (Phase 2)
- ✅ Improved user experience - no manual state code lookup needed
- ✅ Clearer, more accessible location warnings for all users
- ✅ No breaking changes - additive enhancement only

---

### v6.1.0 - Documentation Enhancement & Job Summary Guide (2025-12-29)
> **Branch:** `v6.1.0`

#### Added
- **Job Summary Usage Guide** - New tip section in README explaining how to use professional summary generation
  - Master summary vs per-JD summary differences
  - Use cases (cover letters, LinkedIn, email applications)
  - ATS keyword optimization tip
- **Comprehensive Wireframes** - 10 visual workflow guides (5 ASCII + 5 Mermaid)
  - Phase 1: Foundation (job history creation, JD parser, entry router)
  - Phase 2: Core Integration (evidence matching, blocking gates)
  - Phase 3: Router & Workflows (8-scenario routing, incremental updates)
  - Phase 4: Summary & Polish (professional summary generation)
  - Complete Workflow: End-to-end user journey
- **Test Case Expansion** - 30+ new test cases for Phases 2-4
  - Integration flow tests (Phase 1 → Phase 3)
  - Incremental update edge cases
  - Re-comparison diff accuracy validation
  - Professional summary quality checks

#### Changed
- **Terminology Consistency** - "Mode 1/2/3" → "Phase 1/2/3" across all user-facing documentation
  - README.md: 28 occurrences updated
  - quick-start-mode.md: Updated to use phase terminology
  - Consistent with internal architecture (`/optimization-tools/` folder structure)
- **Folder Structure** - Renamed `/shared/` → `/optimization-tools/` for clearer naming
  - Updated all references in PROJECT-INSTRUCTIONS.md, README.md, CHANGELOG.md, ROADMAP.md
- **Version Numbering** - Updated README from v6.0.0 → v6.1.0

#### Removed
- **Obsolete v5.0 Files** - Archived to `/docs/legacy/`
  - `/modes/` directory → `/docs/legacy/modes-v5/`
  - `/wireframes/` (v5.0) → `/docs/legacy/wireframes-v5/`
  - `/optimization-tools/v5-legacy/` → `/docs/legacy/shared-v5/`
  - Root `CHANGELOG.md` (duplicate) → `/docs/legacy/CHANGELOG-v5.md`
  - `ADD_REMOTE_WORK_LOGIC.md` → `/docs/legacy/implementation-prompts/`

#### Impact
- ✅ Clearer user experience with consistent terminology
- ✅ Better onboarding with Job Summary usage guide
- ✅ Improved developer experience with visual wireframes
- ✅ Cleaner repository structure with legacy files archived

---

### v6.0.0 - Complete Workflow System (2025-12-29) <!-- v6.0.0 Change -->
> **Branches:** `v6.0.1-foundation`, `v6.0.2-core-integration`, `v6.0.3-router-workflows`, `v6.0.4-summary-polish`

#### 🎉 Major Release: Complete v6.0 Workflow System

This major release transforms the system from a simple 3-mode analyzer into a complete, intelligent resume management platform with smart routing, incremental updates, and change tracking.

**Breaking Changes:**
- **Job History Schema job history creation:** New 12-section schema (up from 8 sections in v1.0)
  - Hard/soft skills separated into distinct arrays
  - Education and certifications added
  - Professional summary per role
  - Tools/technologies granular listing
  - v1.0 files preserved for reference (`claude_generated_job_history_summaries.txt`)
  - job history creation files created automatically (`claude_generated_job_history_summaries_v2.txt`)
  - Mode 2 backward compatible (works with both v1.0 and job history creation)

---

#### Phase 1 (v6.0.1) - Foundation

**Added:**
- **Job History Schema job history creation** (`optimization-tools/resume-analyzer/job-history-creation.md`)
  - 12 sections: metadata, professional_summary, core_responsibilities, key_achievements, hard_skills_demonstrated, soft_skills_demonstrated, education, certifications, tools_technologies, impact_metrics, industry_domain, team_scope
  - Structured format for evidence-based matching
  - Version tracking (schema_version field)

- **Standard JD Parser** (`optimization-tools/resume-analyzer/jd-parsing.md`)
  - Complete extraction schema: company, job_title, location, work_lifestyle, remote_restrictions, employee_type, travel_required, clearance, salary_range, required_experience, required_education, job_responsibilities
  - **Hard vs Soft Skill Classification:** Decision tree logic for accurate categorization
  - Skills separated: skills_needed/wanted (HARD), soft_skills_needed/wanted (SOFT)
  - Qualifications: qualifications_needed/wanted, certifications_needed/wanted
  - Dual extraction strategy: structured JDs (high confidence) vs conversational JDs (fallback)
  - Inference for missing fields ("Not specified" vs empty arrays)

- **Entry Point Router** (`optimization-tools/resume-analyzer/entry-router.md`)
  - 5 core routing scenarios with context detection
  - JD validation heuristics (length, keywords, structure checks)
  - Anti-false-positive measures for LinkedIn posts/articles
  - User confirmation before mode execution

**Impact:**
- ✅ Foundation for evidence-based gap analysis
- ✅ Accurate hard/soft skill separation prevents blocking gate errors
- ✅ Complete JD extraction (all fields from legacy system restored)

---

#### Phase 2 (v6.0.2) - Core Integration

**Added:**
- **Evidence-Based Matching** (`optimization-tools/bullet-optimizer/evidence-matching.md`)
  - **Requirement-by-requirement analysis:** Every JD requirement gets individual status
  - **Two-part check system:** Evidence match + keyword presence (ATS optimization)
  - **Status determination:** [MATCHED], [PARTIAL], [MISSING] with color-coding
  - **Evidence citations:** Standardized format ("Company | Job Title")
  - **Gap rationale:** Specific explanation for each requirement
  - **Special cases:** Contractor, freelance, multiple roles at same company
  - **Diff generation:** Track improvements over time (for re-comparison)

- **Blocking Gates** (Mode 3 enhancements)
  - **Gate 1 - Hard Skill Deficit:** Warns if Missing Hard Skills > Matched Hard Skills
  - **Gate 2 - Low Match Score:** Warns if match score < 30
  - **Gate 3 - Location Mismatch:** Preserved from v5.1 (on-site/remote conflicts)
  - **Soft blocking:** User can override with "yes/no" confirmation
  - **Token savings:** Prevents wasted analysis on poor-fit positions

**Changed:**
- **Mode 1 (Full Analysis):**
  - Generates job history creation with all 12 sections
  - Hard/soft skill categorization using classification rules
  - Professional summary per role (master summary)
  - Next steps guidance after completion

- **Mode 3 (JD Comparison):**
  - Uses JD parsing protocol (all fields extracted)
  - Evidence matcher with citations for every requirement
  - Color-coded output ([MATCHED]/[PARTIAL]/[MISSING])
  - 3 blocking gates with override option
  - Per-JD summary placeholder (full implementation in v6.0.4)

- **Mode 2 (Bullet Optimization):**
  - **Backward compatible:** Checks job history creation first, falls back to v1.0
  - Upgrade recommendation for v1.0 users
  - Keyword insertion logic (hard vs soft skills)

**Impact:**
- ✅ Users see exactly where they match/don't match (with proof)
- ✅ Blocking gates save time on poor-fit applications
- ✅ Mode 2 works for all users (v1.0 and job history creation)

---

#### Phase 3 (v6.0.3) - Router & Workflows

**Added:**
- **Complete Workflow Router** (`optimization-tools/job-fit-analyzer/workflow-router.md`)
  - **8 routing scenarios:**
    1. New user (no job history) → Mode 1
    2. JD comparison (has job history + JD) → Mode 3
    3. Bullet optimization (has job history + wants optimization) → Mode 2
    4. Ambiguous intent (has job history, unclear) → Ask user
    5. First interaction (no context) → Welcome message
    6. Incremental update (add/edit/remove position) → Incremental handler
    7. Re-comparison (re-run JD analysis) → Re-comparison handler
    8. Ambiguous input (cannot determine type) → Two-step clarification
  - **JD validation heuristics:** Prevents false positives (LinkedIn posts, articles)
  - **Override commands:** "re-analyze", "start fresh", "add position", "update job history"
  - **Context detection:** Checks hasJobHistory, hasJD, hasResume
  - **User confirmation:** Always confirms before executing mode

- **Incremental Updates** (`optimization-tools/job-fit-analyzer/incremental-updates.md`)
  - **Add position:** Collect job history creation fields → Insert chronologically → Recalculate aggregates
  - **Edit position:** Select → Show current values → Update → Recalculate
  - **Remove position:** Select → Confirm → Remove → Recalculate
  - **Automatic recalculation:** Years of experience, skills aggregation

- **JD Re-Comparison** (`optimization-tools/job-fit-analyzer/re-comparison.md`)
  - **JD caching:** Saves parsed JDs for future reference (`jd_parsed/` directory)
  - **Version tracking:** v1, v2, v3 comparisons stored
  - **Diff output:**
    - **Improvements:** Missing → Matched, Partial → Matched
    - **No change:** Still Matched, Still Missing
    - **Score delta:** 72% → 81% (+9 points)
  - **Cache management:** "List saved JDs", "Delete [Company] JD", "Clear JD cache"

**Changed:**
- **PROJECT-INSTRUCTIONS.md:**
  - Entry point routing section (CRITICAL priority)
  - All 8 scenarios documented
  - Override commands listed
  - v6_foundation_modules status updated to "integrated"

- **.gitignore:**
  - Added jd_parsed/ patterns (excludes cached JDs, keeps README)

**Impact:**
- ✅ System feels intelligent (auto-detects user intent)
- ✅ Users can maintain job history without full re-analysis
- ✅ Track improvement over time with diff output

---

#### Phase 4 (v6.0.4) - Summary & Polish

**Added:**
- **Professional Summary Generator** (`optimization-tools/narrative-generator/summary-generation.md`)
  - **Master summary (Mode 1):** Comprehensive 3-4 sentence summary
    - Sentence 1: Role + Scope (title, years, industry)
    - Sentence 2: Achievements + Metrics (quantified results)
    - Sentence 3: Hard Skills (2-3 technical skills)
    - Sentence 4: Soft Skills (1-2 interpersonal skills)
    - Aggregates career data (total years, companies, team sizes)
    - Stored in job history creation (master_summary field)
  - **Per-JD summary (Mode 3):** Customized, ephemeral (not stored)
    - Replaces generic hard skills with JD-specific keywords
    - Maintains metrics and achievements from master
    - Offered after gap analysis if match score ≥ 50

**Impact:**
- ✅ Users get polished professional summaries
- ✅ Per-JD summaries optimize ATS keyword matching
- ✅ Evidence-based (only includes demonstrated skills)

---

#### Total Changes

**Files Created:** 9 files (5,595 lines)
- Phase 1: 3 files (job-history-creation.md, jd-parsing.md, entry-router.md)
- Phase 2: 1 file (evidence-matching.md)
- Phase 3: 3 files (workflow-router.md, incremental-updates.md, re-comparison.md)
- Phase 4: 1 file (summary-generation.md)
- Infrastructure: 1 directory (jd_parsed/)

**Files Modified:** 5 files
- PROJECT-INSTRUCTIONS.md (v5.1.0 → v6.0.3)
- mode-3-jd-comparison.md (v5.1.0 → v6.0.2)
- mode-2-bullet-optimization.md (v5.0 → v6.0.2)
- ROADMAP.md (tracked all 4 phases)
- .gitignore (added jd_parsed/)

**Commits:**
- v6.0.1: `4b82fd3` - Foundation (2,580 lines)
- v6.0.2: `ff677fe` - Core Integration (1,000 lines)
- v6.0.3: `157a833` - Router & Workflows (2,015 lines)
- v6.0.4: TBD - Summary & Polish

---

#### Migration Guide (v5.1 → v6.0)

**For Existing Users:**
1. **Job History:** v1.0 files preserved, job history creation created automatically on next Mode 1 run
2. **Mode 2:** Backward compatible - works with v1.0, recommends upgrade to job history creation
3. **No data loss:** All existing files remain intact

**Recommended Actions:**
1. Run Mode 1 to generate job history creation job history (if you have new positions)
2. Try incremental updates ("add position", "edit position")
3. Re-run previous JD comparisons to see diff output

**Benefits of Upgrading:**
- Evidence-based matching (see exactly where you match/don't match)
- Blocking gates (save time on poor-fit applications)
- Incremental updates (no need to re-analyze entire resume)
- Change tracking (see how your profile improves)
- Professional summaries (master + per-JD customization)

---

### v5.1.0 - Remote Work Classification for Job Analysis (2025-12-28) <!-- v5.1.0 Change -->
> **Branch:** `main`

#### Added
- **Location-Based Job Filtering:** Mode 3 (JD Comparison) now evaluates work location requirements as part of preliminary fit assessment
  - Extracts work arrangement constraints from job descriptions (Remote, Hybrid, On-site, geographic restrictions)
  - Categorizes location red flags (state residency requirements, "fake remote" indicators)
  - New Step 5 "location_blocking_gate" stops analysis early for fundamental location mismatches
  - Location alignment now weighted in core qualifications scoring (50% weight category)
  - Saves time by preventing resume optimization for geographically incompatible positions

#### Changed
- **Scoring Methodology:** Core qualifications now includes "Work location/arrangement alignment (remote/hybrid/on-site compatibility)"
- **Matching Criteria:** Added `location_match` and `location_mismatch` criteria to job history comparison

#### Impact
- ✅ Early-exit logic prevents wasted effort on location-incompatible jobs
- ✅ Detects "fake remote" job postings (e.g., "Remote during training, then on-site")
- ✅ Geographic restriction validation (state residency requirements)
- ✅ Tiered blocking: Critical (immediate stop) vs High/Moderate (score reduction)

---

### v4.12.5 - Metrics & Analysis Hotfix (2025-12-21)
> **Branch:** `v4.12.5-hotfix-metrics-analysis`

#### Fixed
- **Metric Analysis Conflicts:** Resolved issue where AI suggested "Add Metrics" even when code analysis found metrics. Now suppresses contradiction or changes to "Refine Metric".
- **Refinement Block:** Restored the "Refinement Opportunities" block at the top of each position (P1, P2...) to group Redundancy, Consolidation, and Reordering suggestions.
- **Ambiguous Labels:** Changed vague "Lead with..." AI suggestions to explicit `[REORDER]` type.
- **Result Clarity:** Improved "Why/Fix" formatting for inline recommendations.

### v4.12.4 - Patch: Severity Labels & Recommendation Visibility (2025-12-21)
> **Branch:** `v4.12.4-patch-count-reasons`

#### Fixed
- **Severity Labels:** Added explicit [HIGH], [MEDIUM], [LOW] prioritization to recommendations.
- **Missing Recommendations:** Fixed issue where AI recommendations were not displaying if strictly separate from analysis.
- **Redundancy Display:** Re-enabled display of redundancy and consolidation findings with "Why/Fix" templates.

### v4.12.3 - Patch: Analysis Layout & Categorization (2025-12-21)
> **Branch:** `v4.12.3-patch-anaylsis-updates`

#### Fixed
- **Header Ordering:** Adjusted layout to place Contact Info and Professional Summary immediately after Executive Summary.
- **Education Warning:** Now explicitly warns if Education section is missing, rather than failing silently.
- **Recommendation Labels:** Switched from generic `[AI]` prefix to specific types (`[CONDENSE]`, `[REWRITE]`) based on content.
- **Collaborative Verbs:** Improved detection of "verb + with" patterns to correctly categorize as Collaboration.

### v4.12.0 - Integrated Analysis Display (2025-12-21)
> **Branch:** `v4.12-display_enhancements`

#### Added
- **Integrated Analysis ("God Mode"):** Unified display combining visual validation (Metrics/Action/Length) with AI-driven recommendations inline per bullet.
- **Action Verb Bar Chart:** HTML-style bar chart in terminal illustrating distribution of 5 verb categories.
- **Prioritized Repairs Summary:** Top-level checklist of Blocker/Risk/Tweak issues.

#### Changed
- **Modular cards deprecated** in favor of integrated inline view.
- **Executive Summary** refined to include Verb Diversity chart directly.

---

### v4.11.4 - Adverb Category Naming Correction (2025-12-20)
> **Branch:** `v4.11.4-hotfix-adverb-list`

#### Fixed
- **Category Naming Mismatch:** Corrected adverb category names to match wireframes and display logic
  - Root cause: v4.5 implementation incorrectly named categories (Creation/Leadership/Achievement/Improvement/Analysis)
  - Wireframes and `pipeline.js` already used correct names (Built/Lead/Managed/Collaborate/Improved)
  - Analytics modules (`verb-lists.js`, `verb-validation.js`) and prompts were using wrong names
  
#### Changed
- **Category Names Updated:**
  - Creation → Built (Blue 🔵)
  - Leadership → Lead (Yellow 🟡)
  - Achievement → Managed (Purple 🟣)
  - Improvement → Improved (Green 🟢)
  - Analysis → Collaborate (Pink 🩷)
  
- **Verb List Updates:**
  - Managed category now focuses on oversight, resource coordination, and operational control
  - Collaborate category focuses on partnership, teamwork, and cross-functional cooperation
  
#### Technical
- **Files Modified:** `js/analytics/config/verb-lists.js`, `js/analytics/verb-validation.js`, `docs/prompts/analyzer/Resume_Analyzer_Prompt.md`, `README.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`
- **Related Plan:** `docs/plans/v4.11.4-hotfix-adverb-list.md`

---

### v4.11.3 - Bullet Character Limit Synchronization (2025-12-20)
> **Branch:** `v4.11.3-hotfix_bullet_char`

#### Fixed
- **False-Positive Length Errors:** Prioritized Repairs no longer reports "exceeds 150 characters" for bullets within the valid 100-210 range
  - Root cause: `quality-checks.js` used outdated `maxChars: 150` while `scoring.js` was updated to 100-210 in v4.11.2
  - Synchronized `BULLET_LENGTH_THRESHOLDS` constant to match scoring.js compliance range

#### Changed
- **Bullet Length Thresholds** in `quality-checks.js`:
  - `minChars`: 30 → 50 (aligned with idealMin for consistency)
  - `maxChars`: 150 → 210 (aligned with scoring.js upper bound)
  - `idealMin`: 50 → 100 (matches scoring.js compliance range start)
  - `idealMax`: 120 → 210 (matches scoring.js compliance range end)

#### Technical
- **Files Modified:** `js/analytics/quality-checks.js`, `docs/plans/v4.11_analytics_validation_plan.md`
- **Related Plan:** `docs/plans/v4.11.3-hotfix_bullet_char.md`

---

### v4.11.2 - ATS Score Calculation Fix (2025-12-20)
> **Branch:** `v4.11.2-hotfix-ats_format_score`

#### Fixed
- **ATS Format Score Stuck at 6/40:** Score now correctly reflects section presence and content metrics
  - Root cause: Parser stores data at root level (`parsedResume.experience`) but scoring expected nested structure (`parsedResume.sections.experience`)
  - Auto-mapping now populates `sections` object from root fields in `indexResume()`
  - Synced `bulletCount` and `wordCount` to `parsedResume` object before scoring

#### Enhanced
- **Bullet Character Length Standard:** Updated from 60-180 to 100-210 characters
  - Better alignment with ATS parsing requirements and professional resume standards
  - Affects Content Quality scoring (Character Length Compliance component)
  
- **Executive Summary Breakdown:** Added sub-component visibility for all 4 scoring categories
  - **ATS Format:** Shows breakdown of Section Presence, Order, Bullet Count, Word Count
  - **Content Quality:** Shows Character Length, Date Format, Formatting Style
  - **Quantifiable Impact:** Shows Metric Density, Impact Statements
  - **Skills & Keywords:** Shows Hard Skills, Soft Skills, Distribution
  - Integrated into existing purple-bordered table (not separate display)

#### Impact
- ATS Format Score accurately awards points for section presence (20pts), section order (10pts), bullet count (5pts), and word count (5pts)
- Resumes with valid structure now receive appropriate scores instead of near-zero
- Users now see **why** each category scored as it did with specific sub-component feedback

#### Technical
- **Files Modified:** `js/logic/pipeline.js`, `js/analytics/scoring.js`, `js/logic/display-analytics.js`
- **Wireframe Updated:** `docs/prompts/analyzer/wireframes/01_Executive_Summary.md` (v1.1)
- **Related Plan:** `docs/plans/v4.11.2_hotfix_ats_format_score.md`

---

### v4.11.1 - ATS Format Parsing Hotfix (2025-12-20)
> **Branch:** `v4.11.1-hotfix-ats_format_parsing`

#### Fixed
- **Missing Contact Info Parsing:** Added `email`, `phone`, `location`, `linkedin` fields to AI parsing schemas
- **Missing Professional Summary Parsing:** Added `professionalSummary` field to both `PARSE_SCHEMA` and `PARSE_SCHEMA_ENHANCED`
- **Headerless Summary Detection:** AI prompt now explicitly extracts summary text even without a "Professional Summary" header
  - Recognizes: "Summary", "Profile", "Career Profile", "About Me", or no header at all

#### Impact
- Resolves false "Missing Professional Summary" BLOCKER errors for valid resumes
- Resolves false "Missing Contact Info" BLOCKER errors when info is present but unrecognized

#### Technical
- **Files Modified:** `js/config.js`
- **Related Plan:** `docs/plans/v4.11.1_hotfix_ats_format_parsing.md`

---

### v4.11 - Analytics Validation (2025-12-20)
> **Branch:** `v4.11_analytics_validation`

#### Added
- **Quality Checks Module** (`js/analytics/quality-checks.js`)
  - Grammar & Tense Validation: Detects inconsistent past/present tense usage
  - Formatting Consistency: Checks for capitalization and punctuation patterns
  - ATS Red Flags: Identifies risky characters, tables, and images
  - Date Format Validation: Ensures consistent date patterns (MM/YYYY vs Month Year)

- **Professional Summary Validation** (`js/analytics/summary-validation.js`)
  - First-person pronoun detection (I, me, my, we)
  - Length compliance checking (word/character counts)
  - Subjective buzzword detection (e.g., "Passionate", "Motivated")

- **Section Compliance Validation** (`js/analytics/section-compliance.js`)
  - Standard section presence check (Experience, Education, Skills)
  - Layout ordering verification against ATS best practices
  - Essential contact info verification (Email, Phone, LinkedIn)

- **Prioritized Repairs Display** (`js/logic/display-analytics.js`)
  - Unified "Grouped Quality Issues" presentation
  - Consolidated feedback from all likelihood sources (Summary, Sections, Quality)
  - Severity-based grouping:
    - ⛔ BLOCKER (Dealbreakers)
    - ⚠️ RISK (Score reducers)
    - 🔧 TWEAK ( refinements)

#### Fixed
- **Validation Logic:** resolved "SyntaxError: Invalid regular expression" in verb pattern matchers.
- **Import Error:** Fixed `STRONG_VERBS` import binding in `verb-lists.js`.

#### Technical
- **New Files:** 3 files created
  - `js/analytics/quality-checks.js`
  - `js/analytics/summary-validation.js`
  - `js/analytics/section-compliance.js`
- **Modified:** `js/logic/pipeline.js`, `js/logic/display-analytics.js`, `js/analytics/config/verb-lists.js`

### v4.10 - Analytics Optimization (2025-12-19)
> **Branch:** `v4.10_analytics_optimization`

#### Added
- **Cross-Resume Redundancy Detection** (`js/analytics/redundancy.js`)
  - Capability pattern matching to identify repeated skills across positions
  - Severity calculation: HIGH (3+ positions), MEDIUM (2 positions, broad), LOW (2 positions, specific)
  - Word savings estimation for consolidation planning
  - Per-position alert helpers for display integration

- **Per-Position Reordering Recommendations** (`js/analytics/reordering.js`)
  - Optimal bullet order calculation based on v4.9 strength ratings
  - Primary sort: Quantifiable Impact (metrics presence) per v4.9.1 UX guidance
  - Secondary sort: Overall bullet strength (4-point criteria)
  - Move recommendations with human-readable reasons

- **Consolidation Opportunities** (`js/analytics/consolidation.js`)
  - Identifies merge candidates from redundancy data
  - Word savings calculation (current vs projected)
  - Priority ranking: HIGH/MEDIUM/LOW based on severity + savings
  - Suggested consolidated text templates with rationale

- **Per-Position Optimization Cards** (`js/logic/display-analytics.js`)
  - `displayPerPositionCards()` function showing optimization alerts per position
  - Redundancy alerts with cross-position references
  - Reordering recommendations with move instructions
  - Consolidation opportunities with word savings
  - Bullet strength indicators (🟢 Strong, 🟡 Medium, 🔴 Weak)
  - Consolidation summary with total word savings

#### Changed
- **State Management** (`js/state.js`)
  - Extended analytics object: `{ scoring, bulletStrengths, verbAlerts, redundancy, reordering, consolidation }`

- **Analysis Pipeline** (`js/logic/pipeline.js`)
  - Integrated v4.10 analytics modules into standalone analysis flow
  - Added per-position cards display after Executive Summary

#### Technical
- **New Files:** 3 files created
  - `js/analytics/redundancy.js` - Cross-resume redundancy detection
  - `js/analytics/reordering.js` - Bullet reordering recommendations
  - `js/analytics/consolidation.js` - Consolidation opportunity finder
- **Modified Files:** `js/state.js`, `js/logic/pipeline.js`, `js/logic/display-analytics.js`
- **Terminology:** Uses "Refinement" not "Polish" per v4.9.1 UX guidance
- **Inline Comments:** All changes marked with `// v4.10 Change:` for audit trail

#### Documentation
- Updated `docs/plans/v4.10_analytics_optimization_plan.md` with implementation progress tracking
- Version history added to all modified files

### v4.9.2 - Documentation Alignment & Wireframe Consolidation (2025-12-19)
> **Branch:** `v4.9.2-terminology-ui-wireframe-updates`

#### Added
- **Modular Wireframes:** Created a new subdirectory `docs/prompts/analyzer/wireframes/` with standalone components (00-06) for all analysis phases.
- **Reference Source:** Restored `Resume_Analyzer_Wireframe.md` as the authoritative primary file, embedding all modular components.
- **Versioning:** All modular wireframe files and the master wireframe now feature a **Version: 1.0** header for tracking.

#### Changed
- **Terminology Alignment:** Synchronized `Resume_Analyzer_Prompt.md` and `System_Prompt.md` with v4.9.1 standards (ATS Format, Content Quality, Quantifiable Impact, Skills & Keywords).
- **Severity Standardization:** Updated prioritization levels to BLOCKER, RISK, and TWEAK across all prompt documentation.
- **System Prompt Recovery:** Restored full version history in `System_Prompt.md` while appending v4.9.2 updates.
- **Phase 4.5 Restoration:** Explicitly restored "Action Verb Distribution" as a standalone section (rejecting previous consolidation plans) with its own modular wireframe (`06_Action_Verb_Distribution.md`).

#### Technical
- **Centralized Documentation:** Designated `Resume_Analyzer_Wireframe.md` as the single source of truth for the terminal UI, linking all 7 sub-modules.

### v4.9.1 - UX Terminology Updates & Documentation Sync (2025-12-19)
> **Branches:** `v4.9.1-exec-summary-updates`, `v4.9.1-terminology-exec-summary-ux-updates`

#### Fixed
- **Phase 3 Hang:** Resolved critical crash in error handling logic (`pipeline.js`)
  - Fixed `hideLoading()` call without arguments causing TypeError in `utils.js`
  - Hoisted timer variables to ensure visibility in catch block

#### Changed
- **User-Facing Terminology:** Refined scoring category names for clarity and professional alignment
  - **Code Updates:** Renamed 4 scoring functions and updated property names in `js/analytics/scoring.js` and `js/logic/display-analytics.js`
    - "Structure" → **"ATS Format"** (emphasizes machine readability)
    - "Grammar" → **"Content Quality"** (broader professionalism scope)
    - "Results" → **"Quantifiable Impact"** (highlights measurable achievements)
    - "Keywords" → **"Skills & Keywords"** (clarifies hard + soft skills focus)
  - **Display Labels:** Updated Executive Summary and Score Breakdown sections to use new terminology
  - **Function Names:** Renamed for consistency
    - `calculateStructureScore()` → `calculateATSFormatScore()`
    - `calculateGrammarScore()` → `calculateContentQualityScore()`
    - `calculateResultsScore()` → `calculateQuantifiableImpactScore()`
    - `calculateKeywordsScore()` → `calculateSkillsKeywordsScore()`
  - **Property Names:** Updated breakdown object: `{atsFormat, contentQuality, quantifiableImpact, skillsKeywords}`

- **Prioritized Repairs:** "Action Items" renamed to "Prioritized Repairs" with severity levels
  - [⛔ BLOCKER] Dealbreakers
  - [⚠️ RISK] Significant Impact
  - [🔧 TWEAK] Refinement

#### Documentation
- **Prompt Files Updated (v1.1 → v1.2):**
  - `docs/prompts/analyzer/Resume_Analyzer_Prompt.md` - Updated scoring breakdown terminology, version history
  - `docs/prompts/analyzer/Resume_Analyzer_Architecture.md` - Updated code examples with new function names

- **Plan Files Updated (v1.0 → v1.1):**
  - `docs/plans/v4.9_analytics_foundation_plan.md` (v1.2 → v1.3) - Updated Component 1 scoring breakdown, wireframes
  - `docs/plans/v4.10_analytics_optimization_plan.md` - Added "Quantifiable Impact" as primary sort weight
  - `docs/plans/v4.11_analytics_validation_plan.md` - Updated severity classification (blocker/risk/tweak)
  - `docs/plans/v4.12_display_enhancements_plan.md` - "Polish" → "Refinement" consistency

- **Roadmap:** Added Milestone 20 for v4.9.1 UX Terminology Updates

#### Technical
- **Consistency Strategy:** Function names, property names, and display labels now aligned (e.g., `atsFormat` throughout)
- **Inline Comments:** Added v4.9.1 markers at every change location for audit trail
- **Version Headers:** Updated code files with v4.9.1 terminology mapping documentation
- **No Logic Changes:** Scoring algorithms unchanged (/40, /20, /20, /20 distribution preserved)

### v4.9.0 - Analytics Foundation (2025-12-18) <!-- v4.9.0 Change -->
> **Branch:** `v4.9-analytics-foundation` (merged to `v4.8.3-security_hotfix`)

#### Added
- **Executive Summary Dashboard:** New consolidated analytics display showing:
  - Overall score (X/100) with letter grade (A+, A, B+, B, etc.)
  - Score breakdown: Structure /40, Grammar /20, Results /20, Keywords /20
  - Career profile: Experience level with target vs actual word/bullet counts
  - Verb diversity score (X/5 categories) with emoji-coded distribution
  - Action items count (critical, major, minor errors)
  - Visual compliance indicators (✓ compliant, ⚠️ out of range)

- **100-Point Composite Scoring System:** Quantitative resume quality assessment
  - **Structure Score** (/40): Section presence, order, word/bullet count compliance
  - **Grammar Score** (/20): Character length validation, formatting consistency
  - **Results Score** (/20): Metric density, impact statements
  - **Keywords Score** (/20): Hard skills (12pts), soft skills (8pts) distribution
  - Experience-based targets: Scoring adjusts for New Grad vs Mid-Career vs Senior/Executive

- **Bullet Strength Analysis:** 4-point criteria system rates each bullet
  - Metric presence (+1), Impact statement (+1), Strong verb (+1), Proper length (+1)
  - Classification: Strong (3-4pts), Medium (2pts), Weak (0-1pts)
  - Summary statistics: Distribution percentages, average points, weak bullet identification

- **Action Verb Validation:** 3 types of alerts for verb diversity
  - Repetition alerts: 2+ same verb per position
  - Category overuse alerts: 3+ verbs from same category per position
  - Weak verb detection: Passive/vague verbs with synonym suggestions
  - Resume-wide summary: Category distribution, overused/underused patterns

#### Changed
- **Analysis Pipeline:** Analytics now calculated after AI analysis completes (Phase 3)
- **Data Aggregation:** Bullets aggregated into flat array for analytics processing
- **Phase Labels:** Updated from 3 phases to 3 phases (removed temporary 2.5 label)

#### Technical
- **New Files:** 9 files created (682 lines of code)
  - Config layer: `experience-targets.js`, `verb-lists.js`, `scoring-rules.js`
  - Utils layer: `tests.js`, `impact-detection.js`
  - Analytics: `scoring.js`, `bullet-strength.js`, `verb-validation.js`
  - Display: `display-analytics.js`
- **Modified Files:** `state.js`, `pipeline.js`, `Resume_Analyzer_Prompt.md`
- **Architecture:** Functional modules with config separation (Approach 3: Pragmatic Balance)
- **Quality:** All critical integration issues resolved, moderate issues documented for v4.10

#### Documentation
- **Architecture Guide:** Created `Resume_Analyzer_Architecture.md` (moved from plans/)
- **Implementation Plan:** Updated `v4.9_analytics_foundation_plan.md` with completion status
- **ROADMAP.md:** Added Milestone 19 with implementation details

#### Known Limitations
- Date format validation: Currently placeholder (always passes) - TODO v4.10
- Formatting validation: Currently placeholder (assumes 0 issues) - TODO v4.10
- Box-drawing alignment: Emoji width may cause slight misalignment in some terminals

### v4.8.3 - Security Hotfix (2025-12-17)
> **Branch:** `v4.8.3-security_hotfix`

#### Security
- **Fixed hardcoded paths:** Configuration now uses workspace variables (`${workspaceFolder}`)
  - Resolves privacy leak (developer username exposure in repository)
  - Enables collaboration (works for all contributors out-of-the-box)
  - Cross-platform compatible (macOS, Linux, Windows)
- **Added input validation:** 4-layer security checks prevent path traversal and resource exhaustion attacks
  - Path traversal protection (rejects `..`, `~`, relative paths)
  - File size validation (max 100MB to prevent disk exhaustion)
  - Disk space validation (min 500MB free before operations)
  - Archive boundary checks (prevents escape from project directory)

#### Added
- **Local settings pattern:** `.claude/settings.local.json.example` template for user customization
  - Users can override defaults without modifying tracked files
  - Gitignored user settings prevent accidental commits
  - Clear documentation via example file

#### Technical
- Script version: 1.0 → 1.1 (security hardening)
- Cross-platform compatibility improvements
- Comprehensive security validation before all file operations

### v4.6.2 - Export & UX Bugfixes (2025-12-10)
> **Branch:** `v4.6.2-pdf-and-analysis-prompt-fixes`

#### Fixed
- **Removed PDF Export:** PDF export button removed due to browser compatibility issues
  - Users can now print the HTML export to PDF instead
  - Export menu simplified to 3 buttons: Markdown, JSON, HTML
- **Skip Redundant Analysis Prompt:** Fixed annoying prompt when switching from standalone to comparative mode
  - If standalone analysis already completed, comparative mode skips "Would you like to perform analysis first?" prompt
  - Shows message: "✓ Resume Quality Analysis already completed. Using cached results."
  - Prompt still appears for fresh comparative analysis sessions

#### Changed
- Export menu reduced from 4 to 3 export formats
- HTML export button tooltip updated to mention printing to PDF
- Phase 0 in comparative mode now checks if analysis already done

#### Technical
- Removed `exportAsPDF()` function from js/export.js
- Added conditional check in js/logic/pipeline.js for `state.analysis`
- Better UX with fewer redundant prompts

### v4.5.2 - Token Optimization (2025-12-09)
> **Branch:** `v4.5.1-prompt-integration` → merged into `v4.5-action-verb-categorization`

#### Performance
- **Token Reduction:** Reduced token usage by ~8,000 tokens (28-33% reduction per analysis)
  - **Before:** 20-30K tokens per analysis
  - **After:** 13-21K tokens per analysis
- **Quality Maintained:** 98%+ accuracy preserved with semantic verb detection

#### Changed
- **Resume_Analyzer_Prompt.md:**
  - Consolidated version history to v4.5 only (removed v1.0-v1.3)
  - Condensed action verb lists from 170+ to 50 verbs (top 10 per category)
  - Updated inline comments from v1.3 to v4.5
  - Preserved all explanatory content, examples, and "How to Calculate" sections
- **config.js - STANDALONE_ANALYSIS_SCHEMA:**
  - Simplified actionVerbAnalysis schema from 51 lines to 25 lines
  - Updated category names: Built/Lead/Managed/Collaborate/Improved (Corrected in v4.11.4)
  - Removed complex "perPosition" nested array structure
  - AI now includes per-position details in text output
- **pipeline.js - runStandaloneAnalysis():**
  - Optimized prompt data passing from 18 lines to 2 lines
  - Removed redundant instructions (already in systemPrompt file)
  - Kept only essential data: Resume JSON + Experience Level

#### Technical
- **Commit:** `db3cadd`
- **Files changed:** 3 files, 38 insertions(+), 95 deletions(-)
- **Backup created:** Resume_Analyzer_Prompt.md.v4.5.bak (local developer backup, not committed to git)

### v4.5.1 - Prompt Integration Fix (2025-12-09)
> **Branch:** `v4.5.1-prompt-integration` (created from `v4.5-action-verb-categorization`)

#### Fixed
- **Prompt Integration:** Pipeline.js now loads analyzer prompt from file using loadPrompt('analyzer')
- Replaced hardcoded STANDALONE_PROMPT with dynamically loaded prompt
- Action verb categorization now appears in analysis output (resolves v4.5.0 known issue)

#### Documentation
- **ROADMAP.md v1.19:** Marked Milestone 13 complete with actual implementation details
- **CHANGELOG.md:** Finalized v4.5.0 entry with complete feature list
- **Resume_Analyzer_Wireframe.md v1.1:** Added Phase 4.5 showing verb categorization output
- **v4.5 implementation plan v1.1:** Added completion summary

#### Technical
- **Commit:** `2bb1f62`
- **Files changed:** 6 files

### v4.5.0 - Action Verb Categorization (2025-12-09) ✅
#### Added
- **Five-category action verb system** with emoji indicators:
  - Built (Blue 🔵): 30+ verbs for building/establishing
  - Lead (Yellow 🟡): 30+ verbs for driving/guiding
  - Managed (Purple 🟣): 30+ verbs for oversight/coordination
  - Improved (Green 🟢): 30+ verbs for optimizing
  - Collaborate (Pink 🩷): 30+ verbs for partnership
- **Execution trigger instructions** (WHEN/HOW/WHERE to perform verb categorization)
- **Per-position verb counting** with 2+ repetition alerts
- **Prominent 3+ SAME CATEGORY callouts** for critical repetition detection
- **Resume-wide verb summary** showing category usage across all positions
- **Semantic detection** for unlisted verbs based on contextual meaning
- **Prompt-loader infrastructure** for file-based prompt loading with cache-busting

#### Changed
- Enhanced Resume Analyzer Prompt (v1.2 → v4.5) with complete verb categorization integration
- Updated Executive Summary to include verb category diversity analysis with repetition alerts
- Integrated verb distribution into Section 3 output after each position's bullet analysis
- Disabled testing mode warnings (production mode)
- Updated boot message from v4.3.1 to v4.5

#### Technical
- **Commit:** `c66f6b2`
- **Branch:** `v4.5-action-verb-categorization`
- **Files changed:** 10 files, 986 insertions(+), 21 deletions(-)
- **New files:** `js/prompt-loader.js`, `js/PROMPT_LOADER_README.md`
- **Updated prompts:** Resume_Analyzer_Prompt.md v4.5 (actual)
- **Implementation plan:** `/docs/plans/v4.5_action_verb_categorization_plan.md`

#### Known Issues
- **Prompt integration incomplete:** Pipeline.js still uses hardcoded prompts from config.js instead of loading from files
- **Action verb categorization not appearing in output:** Requires pipeline.js update to integrate prompt-loader (tracked in v4.5.1)

#### Documentation
- Consolidated v4.0-v4.4.2 implementation plans into `/docs/plans/v4.x_consolidated_plans.md`
- Updated ROADMAP.md v1.19 to mark Milestone 13 complete
- Reduces 8 separate plan files to single historical reference document (1,074 lines)

## Released

### v4.4.x - README Updates and Recovery (2025-12-08)
#### Note - Google Antigravity Incident
v4.4.0-v4.4.3 primarily consisted of README documentation updates and minor prompt refinements for Gap Analysis evidence formatting. All branches (v4.4, v4.4.1, v4.4.2, v4.4.3) were successfully merged into main on 2025-12-08. However, **Google's Antigravity AI inadvertently deleted these commits from the remote origin repository** on the same day. The changes are preserved locally and documented in this changelog.

### v4.4.3 - Refined Source Citations (2025-12-08)
#### Added
- Defensive coding to strip "Resume - " and similar prefixes from evidence sources
- Improved cleanliness of cited evidence in Gap Analysis

### v4.4.2 - Schema-Based Evidence Formatting (2025-12-08)
#### Fixed
- Resolved "Wall of Text" issue in Gap Analysis evidence display
- Implemented structured array schema for evidence items
- Enforced "One Bullet Per Line" formatting for readability
- added clear Source Citations (Company | Job Title) for every piece of evidence

### v4.4.1 - Evidence Formatting Attempt (Superseded) (2025-12-08)
#### Changed
- Initial attempt to fix evidence formatting via prompt engineering (string-based)
- *Note: This version proved unreliable and was superseded by the schema-based approach in v4.4.2*

### v4.4 - Pre-Analysis Quality Check (2025-12-08)
#### Added
- **Interactive Quality Check:** Prompt to run Standalone Analysis before Comparative Analysis
- allows users to fix resume quality issues (metrics, impact) before assessing job fit
- Integrated seamless flow between Standalone and Comparative modes

### v4.3.1 - Enhanced Progress Feedback (2024-12-04)
#### Added - User Experience
- Reassurance messages for long-running operations (15s and 30s thresholds)
- "Still processing..." message appears after 15 seconds
- "This is taking longer than usual..." message appears after 30 seconds
- Genuine sequential phase completion showing real progress
- Phase numbering (e.g., "PHASE 1/6") for progress tracking
- Elapsed time display for each phase with 0.1s precision
- Visual indicators: ⏳ (in progress), ✓ (complete)

#### Added - Performance Optimization
- Comparative mode now reuses cached data from standalone analysis
- Shows "✓ Resume Already Parsed (using cached data)" when applicable
- Shows "✓ Experience Already Calculated: X Years, Level" when cached
- Saves ~25 seconds when switching from standalone to comparative mode

#### Changed - Based on 2025 UX Research
- Removed inaccurate time estimates (e.g., "5-10 seconds", "15-30 seconds")
- Removed artificial sub-steps that displayed all at once
- Focused on honest progress feedback rather than fake sequential indicators
- Updated version display to v4.3.1 (index.html, main.js, README.md)

#### Technical Implementation
- Enhanced `showLoading()` to return timer object with reassurance timers (js/utils.js)
- Enhanced `hideLoading()` to accept timer object and clear reassurance timers
- Added backwards compatibility for legacy timer number format
- Added caching checks to `runComparativeAnalysis()` (js/logic/pipeline.js)
- Optimized phase display to skip unnecessary loading indicators

#### Documentation
- Updated implementation plan to reflect 2025 UX research decisions
- Documented reassurance timer thresholds and behavior
- Documented caching optimization strategy
- See `/docs/plans/v4.3.1_progress_feedback_plan.md` for complete details

#### UX Research Applied
- Users with progress indicators tolerate 22.6s waits vs 9s without indicators
- Descriptive feedback more effective than inaccurate time estimates
- Sequential completion shows concrete progress better than fake sub-steps
- Immediate feedback critical for async operations

### v4.2.1 - Documentation Structure Refinement (2024-11-XX)
#### Added
- Created `/docs/plans/` directory for implementation plans (separate from prompts)
- Created `plans/README.md` explaining PLANS vs ROADMAP vs PROMPTS distinction
- Enhanced CHANGELOG with code version histories from `index.html`, `main.js`, `pipeline.js`, `claude.js`

#### Changed
- Moved and renamed `Resume_Analyzer_Roadmap.md` → `plans/v4.3_standalone_analysis_plan.md`
- Clarified file is an implementation PLAN, not a roadmap
- Updated all documentation cross-references to reflect new structure
- Enhanced v4.0 and v4.1 CHANGELOG entries with detailed module changes
- Consolidated v3.x CHANGELOG entries per Update Doc Protocol Rule 4

### v4.3 - Standalone Analysis Mode (Released)
#### Added - Core Features
- Dual analysis modes: Standalone (resume quality check) and Comparative (job fit check)
- Interactive mode selection after resume input with validated input loop
- Context-aware post-analysis menu adapting to current mode
- Mode switching capability between standalone and comparative mid-session

#### Added - State Management
- `analysisMode` field to global state ('standalone' | 'comparative' | null) in js/state.js
- Enhanced state documentation for v4.3 changes

#### Added - Schema Enhancements
- `PARSE_SCHEMA_ENHANCED`: Enhanced parsing with skillsIdentified and hasMetric per bullet
- `STANDALONE_ANALYSIS_SCHEMA`: Output structure for standalone analysis results
- `STANDALONE_PROMPT`: AI instructions for quality-focused analysis without JD

#### Added - User Flow
- Step 2: Analysis mode selection with visual separators
- Validated input loop accepting '1', '2', or keywords ('analyze', 'fit', 'check')
- Conditional JD collection only for comparative mode
- Updated postAnalysisMenu() with context-aware options

#### Added - Pipeline Architecture
- Refactored `runAnalysisPipeline()` with branching logic
- Created `parseResumePhase()` shared function with enhanced schema support
- Created `calculateExperiencePhase()` shared function
- Created `runStandaloneAnalysis()` with 3 phases
- Created `runComparativeAnalysis()` extracting existing logic with 6 phases

#### Added - Standalone Analysis Output
- Skills Inventory: Categorized hard/soft skills with totals
- Metric Coverage: Overall percentage and position-level breakdown
- Per-bullet status: ✓ HAS METRICS / ✗ NO METRICS (508-compliant)
- Position ratings: EXCELLENT / GOOD / NEEDS IMPROVEMENT
- Quality issues with severity levels (High/Medium/Low)
- Recommendations with specific bullet references and impact analysis

#### Changed
- Comparative mode maintains all v3.x features (blocking logic, gap analysis)
- Enhanced parseResumePhase() with API retry/switch options
- Proper error propagation to prevent incomplete analysis

#### Implementation Details
- Files Modified: js/state.js, js/config.js, js/main.js, js/logic/pipeline.js
- Code Changes: +636 lines, -244 lines
- See `/docs/plans/v4.3_standalone_analysis_plan.md` for detailed implementation plan

## [Released]

### [v4.2] - 2024-12-03

#### Added - Documentation Reorganization
- Reorganized `/docs` folder structure by content type (`analyzer/`, `comparative/`, `sys/`, `dev/`)
- Created `JD_Comparative_Prompt.md` - Extracted comparative analysis logic from System_Prompt v3.10
- Created `Resume_Analyzer_Wireframe.md` - Visual flow diagram for standalone analysis
- Created `v4.3_standalone_analysis_plan.md` - Implementation plan for v4.3 (originally named Resume_Analyzer_Roadmap.md)
- Created `CHANGELOG.md` - User-facing release notes following Keep a Changelog standard
- Created `PARAMETERS.md` - Centralized parameter reference for all prompts
- Created comprehensive README.md files in all documentation folders for navigation

#### Changed
- Renamed all documentation files to remove "Resume_Optimizer_" prefix for clarity
- Moved files to organized subfolder structure under `/docs/prompts/`
- Updated System_Prompt.md to v3.11 with references to new comparative prompt location
- Updated all cross-references in documentation to reflect new paths
- Updated Update_Doc_Prompt.md v1.3 with 6 target files (added comparative prompt)

### [v4.1] - 2024-12-02

#### Added - User Experience & API Improvements
- **Claude API Browser Compatibility** (`js/ai/claude.js`)
  - Added `anthropic-dangerous-direct-browser-access: true` header
  - Enabled direct Claude API calls from browser (Anthropic CORS support added Aug 2024)
  - Both Gemini and Claude APIs now fully functional in browser environment
- **Interactive API Key Setup** (`js/main.js`)
  - Educational prompts explaining Claude Pro vs Developer API distinction
  - Proactive guidance: auto-switches to Gemini if user only has Claude Pro
  - Clear messaging about API billing before key entry
  - Gemini free tier recommendations for users without API credits
- **Enhanced Error Recovery** (`js/logic/pipeline.js`)
  - Interactive retry/switch options after API errors
  - Users can retry with different key, switch providers, or exit gracefully
  - Data preservation: no need to re-enter resume/JD on retry
- **Input Validation** (`js/main.js`)
  - Validation for provider selection (1, 2, or keywords)
  - Validation for billing type selection
  - Error loops with clear messages and re-prompts

#### Changed
- Removed outdated CORS warnings from Claude API error messages
- Updated provider prompts to say "Gemini API" and "Anthropic Dev API" for clarity

#### Fixed
- Prevented jumping to post-analysis menu before analysis completes
- Fixed validation to prevent invalid selections
- Fixed Claude API CORS issue that was preventing browser-based usage

### [v4.0] - 2024-12-02

#### Added - Modular Architecture (Complete Refactor)
- **Phase 2: Constants & Configuration**
  - Created `js/config.js` - System prompts, all schemas (JD_SCHEMA, PARSE_SCHEMA, etc.)
  - Created `js/state.js` - Global state object, config management
- **Phase 3: Utilities & AI Layer**
  - Created `js/utils.js` - Terminal I/O functions, user input prompts, date parsing
  - Created `js/ai/providers.js` - AI abstraction interface (`generateAIContent` wrapper)
  - Created `js/ai/gemini.js` - Gemini API implementation
  - Created `js/ai/claude.js` - Claude API implementation with CORS handling
- **Phase 4: Business Logic**
  - Created `js/main.js` - Application initialization, menu flows, config loading
  - Created `js/logic/pipeline.js` - Complete 6-phase analysis pipeline
- **Version Tracking**
  - Added version history headers to all code files
  - Inline version comments marking changes

#### Changed
- Refactored monolithic `index.html` (872 lines) into 8 ES6 modules (199 lines)
- Reduced main HTML file size by 77% (-673 lines)
- Improved maintainability with clear separation of concerns
- Enhanced testability with modular structure

#### Preserved
- All v3.x features intact:
  - Multi-provider support (Gemini/Claude) with runtime selection
  - parsing detailed JD analysis
  - Evidence-based gap analysis with explicit citation
  - Hard/Soft skill grouping with Need/Want separation
  - Blocking logic (hard skill deficit, low score threshold <30)
  - Deduplication and cross-position redundancy detection
  - Post-pipeline menu (rerun, new resume, new JD)

#### Removed
- Monolithic inline JavaScript from HTML
- Single-file architecture (872-line index.html)

### [v3.x] - CLI Evolution (2024)

This release series (v3.0-v3.17) evolved the command-line interface with multi-provider support, advanced gap analysis, and intelligent blocking logic.

#### Key Features Added
- **Multi-Provider Support** - Runtime selection between Gemini and Claude APIs
- **Standard JD Analysis** (v3.7) - Skills/Qualifications/Certifications with Need/Want breakdown
- **Hard vs. Soft Skills Distinction** (v3.7) - Proper categorization for accurate matching
- **Evidence-Based Gap Analysis** (v3.4-v3.9) - Explicit citation of resume evidence for each requirement
- **Blocking Logic** (v3.8, v3.10)
  - Low Score Threshold: Blocks recommendations if match score < 30
  - Hard Skill Deficit Gate: Blocks if Missing Hard Skills > Matched Hard Skills
- **Gap Analysis Presentation** (v3.8-v3.9) - Sorting, tagging ([MATCHED]/[PARTIAL]/[MISSING]), section summaries
- **Overall Score Summary Block** (v3.9) - Detailed explanation of match score logic
- **Soft Skill Need/Want Separation** (v3.9) - Distinct buckets for required vs preferred soft skills
- **Recommendation Deduplication** (v3.4) - Merge identical recommendations across positions
- **Cross-Position Redundancy Detection** (v3.4) - Identify repeated capabilities across roles
- **Post-Pipeline Menu** (v3.17) - Rerun analysis, new resume, new JD options
- **CORS Handling** (v3.17) - Error handling for Claude API in browser preview
- **Resume Analysis Agent Framework** (v3.0) - Category tagging ([BA], [PM], [TW], [ITSM])
- **Protection Mode** (v3.0) - Gap-critical content preservation
- **Content Preservation Rules** (v3.1-v3.3) - Explicit rules for metrics, placeholder notation (`<<__>>`), optimization allowances

#### Version Milestones
- **v3.0** - Resume Analysis Agent framework, category tagging
- **v3.1-v3.3** - Content preservation and metric philosophy
- **v3.4-v3.5** - Evidence-based gap analysis
- **v3.7** - parsing JD analysis schema
- **v3.8-v3.9** - Output presentation rules and blocking thresholds
- **v3.10** - Hard skill deficit blocking
- **v3.17** - CORS handling for browser compatibility

### [v2.x] - Quality & Token Management (2024)

#### v2.1
##### Added
- Token tracking across phases
- Phase gates to prevent token waste

#### job history creation
##### Added
- Quality scoring system (0-100)
- Metric applicability checks
- Quantification rate tracking

### [v1.0] - Initial Release (2024)

#### Added
- Multi-job analysis system
- Basic resume parsing
- Recommendation generation
- Document export (.docx)
- Google Gemini API integration
- Basic gap analysis

---

## Versioning Strategy

- **Major (x.0.0):** Breaking changes, architectural shifts
- **Minor (0.x.0):** New features, significant enhancements
- **Patch (0.0.x):** Bug fixes, documentation updates

## Migration Guides

- [v4.1 → v4.2](guides/MIGRATION_v4.2.md) - Documentation structure changes
- [v4.2 → v4.2.1](guides/MIGRATION_v4.2.1.md) - Plans directory introduction and file reorganization

---

## Notes

For detailed technical changes in individual prompt files, see version histories within:
- `prompts/sys/System_Prompt.md`
- `prompts/analyzer/Resume_Analyzer_Prompt.md`
- `prompts/dev/Update_Doc_Prompt.md`
