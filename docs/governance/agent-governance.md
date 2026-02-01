# Agent Governance & Development Protocols

**Version:** 1.0.0
**Status:** ACTIVE (Source of Truth)
**Last Updated:** January 29, 2026

> **📋 Registry Reference:** All guardrails defined in this file are indexed in [Guardrail Registry](guardrail-registry.md). Use the registry for unified lookups (G31, G36, G42, modularity_compliance).

---

## 🏗️ System Maintenance & Modularity

<!-- SILENT SYNC: system_maintenance_rule -->
<system_maintenance_rule id="system_maintenance_rule">
  CRITICAL: This is the logic baseline for agent development.
  When updating logic, check for <modular_reference> tags within the file. 
  1. If a reference exists, apply the update to the external module file FIRST.
  2. Sync the Gold Master (PROJECT-INSTRUCTIONS.md) text to match the module exactly.
  3. Ensure Project-GUI-Instructions.md reflects these changes (usually automatic via reference).
</system_maintenance_rule>

<!-- SILENT SYNC: modularity_compliance -->
<guardrail id="modularity_compliance" priority="CRITICAL">
  <instruction>You MUST NOT modify logic directly in the GUI context. Ensure all system logic follows the v8 hub-and-spoke modular architecture.</instruction>
  <process>
    1. [NEW] Create standalone module in /optimization-tools/.
    2. [SHADOW] Add "Silent Sync" HTML markers in Gold Master (PROJECT-INSTRUCTIONS.md).
    3. [MODULAR] Replace GUI logic with &lt;modular_reference file="..." /&gt;.
  </process>
</guardrail>

---

## 🛠️ Project pathing & Resolve Behavior

<!-- SILENT SYNC: path_resolution -->
<path_resolution id="path_resolution">
  <claude_web_artifact>
    When using this system as a Claude Project with uploaded files:
    - Files uploaded to Project Knowledge are accessible via /files/[filename.md]
    - Example: optimization-tools/resume-analyzer/ra_job-history-creation.md → /files/job-history-creation.md
    - The system will auto-resolve paths based on context
  </claude_web_artifact>
  
  <local_repository>
    When using the full repository locally or with Claude Desktop:
    - Use paths relative to project root
    - Example: optimization-tools/resume-analyzer/ra_job-history-creation.md
  </local_repository>

  <modular_reference_behavior>
    All `<modular_reference file="...">` tags resolve automatically based on context.
    If file is not found at the specified path, check /files/ prefix.
  </modular_reference_behavior>
</path_resolution>

---

## 🛠️ Issue Tracking Workflows

<!-- SILENT SYNC: issue_tracking_workflow -->
<issue_tracking_workflow id="issue_tracking_workflow">
  <local_environment>
     - Use GitHub CLI: `gh issue create`
     - Or use GitHub Web UI to log issues
  </local_environment>

  <claude_web_interface>
     - Create or update `docs/discovered_issues.md` in the chat context
     - OR ask Claude to generate an "Issue Report" block using `docs/templates/issue_template.md`
     - Copy-paste the report to your external tracking system
  </claude_web_interface>
</issue_tracking_workflow>

---

## 📦 Unified Workflow System

<!-- SILENT SYNC: unified_workflow_system -->
<unified_workflow_system id="unified_workflow_system">
  <governance>
    All AI agent workflows (Claude Code, Antigravity, Gemini) are consolidated into `.agent/workflows/` as the Single Source of Truth (SSoT).
    - Claude Code skills are synchronized via symbolic link: `.claude/skills` → `.agent/workflows`
    - Logic updates MUST be applied to `.agent/workflows/` FIRST.
    - Never modify agent-specific hidden directories directly if a unified workflow equivalent exists.
  </governance>

  <symbolic_synchronization_symsync>
    To ensure "Environment Parallax" (logic drift between agents) is avoided:
    1. Verify link integrity at session start: `ls -ld .claude/skills`
    2. Any new reusable logic must be added as a `.md` workflow in `.agent/workflows/`.
    3. Use the `SSoT_MARKER` within work plans to indicate cross-agent dependency.
  </symbolic_synchronization_symsync>

  <git_governance_enforcement id="G31">
    1. **Release Hierarchy:** All branches MUST be prefixed with the semantic version (e.g., `v9.3.4-`).
    2. **Issue Linkage:** All commits and PRs MUST reference the GitHub Issue ID (e.g., `Closes #95`).
    3. **Titling Policy:** GitHub issues MUST use `[BUG]` or `[ENHANCEMENT]` prefixes.
    4. **Persistence:** Local Tracking IDs (ENH-XXX or issue-XXX) MUST be present in issue bodies.
  </git_governance_enforcement>
</unified_workflow_system>

---

## 🚦 Issue Tracking & Lifecycle Governance

<!-- SILENT SYNC: guardrail_31 -->
<guardrail id="31" priority="CRITICAL">
  <name>workflow_lifecycle_compliance</name>
  <priority>CRITICAL</priority>
  <instruction>Establish project infrastructure before planning or execution. Strictly follow naming and tagging policies.</instruction>
  <naming_policy>
    - **GitHub Issues:** Must prefix title with `[BUG]` or `[ENHANCEMENT]`.
    - **GitHub Labels:** Apply `bug` or `enhancement` labels.
    - **Local ID:** Include `Local Tracking ID: issue-N` or `ENH-NNN` in the issue body.
    - **Plans & Branches:** Must include version prefix (e.g., `v9.3.4-issue-N-slug`).
    - **PR Titles:** Should be descriptive and mirror the clean GitHub Issue title (including prefix).
  </naming_policy>
  <steps>
    1. Identify or create a GitHub Issue (gh issue create) matching naming policy.
    2. Establish a dedicated feature/patch branch with version prefix.
    3. [MANDATORY] Create Draft PR immediately to link branch to issue (gh pr create --draft).
    4. Update ROADMAP.md and CHANGELOG.md status.
    5. Save implementation plan to docs/plans/[branch-name].md.
  </steps>
</guardrail>

<!-- SILENT SYNC: local_tracking_persistence_guardrail -->
<local_tracking_persistence_guardrail id="36" priority="HIGH">
  <priority>HIGH</priority>
  <instruction>Always maintain the link between local documentation and GitHub issues.</instruction>
  <rule>The Local ID (issue-N / ENH-NNN) MUST be present in the GitHub issue body and all local documentation files for that issue.</rule>
</local_tracking_persistence_guardrail>

---

## 🔒 Security & Data Integrity

<!-- SILENT SYNC: justified_data_access_guardrail -->
<justified_data_access_guardrail id="G42" priority="CRITICAL">
  <intent>Prevent unauthorized or unexplained browsing of sensitive job history or user resume data.</intent>
  <rule>
    Whenever you are about to read, edit, or search files within the `/job-history/` or `/user-data/` directories, or analyze a raw user-provided resume:
    1. You MUST first state your specific technical or logical justification for the access.
    2. The justification MUST be visible to the user and tied to an active Step in an Implementation Plan.
    3. FORMAT AGNOSTICISM: Do not assume the data is in the v12.1+ standard format. Logic must be robust enough to handle raw text and perform "on-the-fly" tagging.
  </rule>
</justified_data_access_guardrail>
