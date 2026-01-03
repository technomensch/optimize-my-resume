# Session Summaries Index

**Total Sessions:** 0
**Last Session:** N/A
**Last Updated:** 2026-01-02

---

## What Are Session Summaries?

Session summaries capture the work done in Claude Code sessions before context limits or at major milestones. Each summary documents:
- What was built or modified
- Decisions made and why
- Problems solved
- Lessons learned
- Files touched
- Commits created

**Purpose:** Preserve session context for future reference and knowledge retention.

---

## Organization

Sessions are organized by month in YYYY-MM/ directories:

```
docs/sessions/
├── 2026-01/
│   ├── 2026-01-02_memory-system-design.md
│   └── 2026-01-02_job-history-updates.md
├── 2025-12/
│   └── ...
└── template.md
```

---

## 2026-01 (0 sessions)

(Sessions will appear here as they're created)

---

## How to Use

**Create a session summary:**
```bash
/session-summary
```

**Find related sessions:**
```bash
/recall <topic>
```

**Browse by month:**
```bash
ls docs/sessions/2026-01/
```

---

## When to Create Summaries

**Recommended triggers:**
- Before hitting context limits (~180K tokens)
- After completing major features
- At end of significant debugging sessions
- When switching between unrelated tasks
- End of work day if significant progress made

**Auto-suggested by:**
- `/patch` completion (for complex work)
- Context limit warnings
- `/doc-update` completion (for major updates)

---

## Related Resources

- **Lessons Learned:** [../lessons-learned/](../lessons-learned/)
- **ADRs:** [../decisions/](../decisions/)
- **Knowledge Graph:** [../knowledge/](../knowledge/)
- **Template:** [template.md](template.md)

---

**Created:** 2026-01-02
**Last Updated:** 2026-01-02
