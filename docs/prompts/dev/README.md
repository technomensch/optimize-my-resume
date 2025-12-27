# Developer Documentation

## Purpose

This directory contains developer tools and protocols for maintaining the Resume Optimizer project.

## Files

| File | Version | Purpose |
|------|---------|---------|
| [Update_Doc_Prompt.md](Update_Doc_Prompt.md) | v1.3 | Documentation update SOP |
| [Testing_Protocol.md](Testing_Protocol.md) | v1.0 | Prompt testing guidelines |

## Update_Doc_Prompt.md Overview

**Standard Operating Procedure for documentation updates:**

1. **Identify Targets** - Which docs need updating?
2. **User Verification** - Confirm with user (interactive)
3. **Version Strategy** - Minor (x.x.1) or Major (x.1.0)?
4. **Apply Updates** - Follow formatting rules
5. **Test-First Validation** - Code before docs
6. **Roadmap Sync** - Update ROADMAP.md

**Key Rules:**
- Version history at top of each file
- Inline comments for changes (`<!-- vX.X Change -->`)
- Code file version headers
- Version history consolidation at major milestones

## Testing_Protocol.md Overview

**Prompt testing procedures:**

1. **Smoke Tests** - Quick validation (5-10 min)
2. **Regression Tests** - Prevent breaking changes (15-20 min)
3. **Feature Tests** - Validate new functionality (20-30 min)
4. **Edge Case Tests** - Handle unusual inputs (15-20 min)

**Includes:**
- Test case templates
- Sample test data (resumes, JDs)
- Pass/fail criteria
- Testing checklist

## Quick Start for Contributors

**Before making changes:**
1. Read [Update_Doc_Prompt.md](Update_Doc_Prompt.md)
2. Understand version numbering
3. Review testing requirements in [Testing_Protocol.md](Testing_Protocol.md)

**After making changes:**
1. Run smoke tests
2. Update version histories
3. Update [CHANGELOG.md](../../CHANGELOG.md)
4. Update [ROADMAP.md](../../ROADMAP.md) if applicable

## Best Practices

- **Always increment version** when changing prompt logic
- **Add inline comments** at change locations
- **Test before documenting** - code first, docs second
- **Use major versions** for breaking changes
- **Consolidate history** at major milestones

## Related Documentation

- [CHANGELOG](../../CHANGELOG.md) - User-facing release notes
- [ROADMAP](../../ROADMAP.md) - Project roadmap
- [Parameters Reference](../PARAMETERS.md) - Global parameters
