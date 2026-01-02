# Job History Template System

**Purpose:** Ensure consistent job history generation across ALL LLMs (Claude, Gemini, ChatGPT, Copilot)

**Version:** 1.0
**Created:** January 2, 2026

---

## 🎯 Overview

This template system guarantees that any LLM will generate job history summaries with **identical structure**, regardless of which AI assistant is used.

### The Problem We Solved

**Before:**
- ❌ Different LLMs might use different tag names
- ❌ Sections might appear in different orders
- ❌ Some sections might be missing
- ❌ Inconsistent date formats
- ❌ No way to validate output

**After:**
- ✅ All LLMs follow exact same schema
- ✅ Guaranteed section order and completeness
- ✅ Standardized formatting
- ✅ Automated validation
- ✅ Consistent conversion to Markdown

---

## 📁 Files in This System

### 1. Templates

| File | Purpose |
|------|---------|
| `job_history_template.xml` | **XML schema template** - Exact structure all LLMs must follow |
| `job_history_template.md` | **Markdown template** - Presentation format structure |
| `LLM_GENERATION_INSTRUCTIONS.md` | **LLM instructions** - How to use templates consistently |

### 2. Scripts

| File | Purpose |
|------|---------|
| `../scripts/convert_job_history_to_md.py` | Convert .txt (XML) → .md (Markdown) |
| `../scripts/validate_job_history.py` | Validate .txt matches template schema |

### 3. Skills

| File | Purpose |
|------|---------|
| `../.claude/skills/md-job-history.md` | `/md-job-history` skill documentation |

---

## 🔄 How It Works

### Generation Workflow

```
User provides job bullets
       ↓
LLM reads: LLM_GENERATION_INSTRUCTIONS.md
       ↓
LLM follows: job_history_template.xml (exact schema)
       ↓
LLM generates: job_history_vX.txt (XML format)
       ↓
Validation: validate_job_history.py
       ↓
Conversion: convert_job_history_to_md.py
       ↓
Output: job_history_vX.txt (source) + job_history_vX.md (presentation)
```

### Key Guarantees

**1. Schema Consistency**
```xml
<!-- ALL LLMs will generate this exact structure: -->
<position id="N">
  <metadata>...</metadata>
  <professional_summary>...</professional_summary>
  <core_responsibilities>...</core_responsibilities>
  <key_achievements>...</key_achievements>
  <hard_skills_demonstrated>...</hard_skills_demonstrated>
  <soft_skills_demonstrated>...</soft_skills_demonstrated>
  <tools_technologies>...</tools_technologies>
  <impact_metrics>...</impact_metrics>
  <industry_domain>...</industry_domain>
  <methodology>...</methodology>
  <strategic_decisions>...</strategic_decisions>
  <team_scope>...</team_scope>
  <honest_limitations>...</honest_limitations>
</position>
```

**2. Section Order**
- Sections always appear in the same order (see template)
- No variations between LLMs

**3. Tag Names**
- Exact tag names defined in template
- No synonyms or alternatives allowed

**4. Date Formats**
- Standardized: "Month Year" (e.g., "January 2025")
- Current: "Present"
- Unknown: "Not specified"

---

## 🚀 Quick Start

### For LLMs Generating Job History

**Step 1:** Read the instructions
```
Reference: templates/LLM_GENERATION_INSTRUCTIONS.md
```

**Step 2:** Follow the template
```
Structure: templates/job_history_template.xml
```

**Step 3:** Validate output
```bash
python3 scripts/validate_job_history.py <output_file.txt>
```

**Step 4:** Generate Markdown
```bash
python3 scripts/convert_job_history_to_md.py <output_file.txt>
```

### For Users

**Generate both formats:**
```
"Please generate my job history following the template system.
I want both XML (.txt) and Markdown (.md) formats."
```

**Convert existing .txt to .md:**
```
/md-job-history chat-history/claude_generated_job_history_summaries_v7.txt
```

**Validate existing file:**
```bash
python3 scripts/validate_job_history.py chat-history/job_history_vX.txt
```

---

## 📊 Format Comparison

| Feature | .txt (XML) | .md (Markdown) |
|---------|------------|----------------|
| **LLM Readability** | ⭐⭐⭐⭐⭐ Optimal | ⭐⭐⭐⭐ Very Good |
| **Human Readability (raw)** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Very Good |
| **Human Readability (rendered)** | ⭐ None | ⭐⭐⭐⭐⭐ Excellent |
| **Semantic Clarity** | ⭐⭐⭐⭐⭐ Explicit tags | ⭐⭐⭐ Implicit headers |
| **Presentation Ready** | ❌ No | ✅ Yes |
| **Schema Validation** | ✅ Yes | ❌ No |
| **Source of Truth** | ✅ Yes | ❌ No (generated from .txt) |

**Best Practice:**
- Keep .txt as source of truth
- Generate .md for presentations
- Edit .txt, regenerate .md

---

## ✅ Validation

### What Gets Validated

The validation script checks:

1. **Required sections present**
   - education, certifications, master_skills_inventory
   - All required position sections

2. **XML structure**
   - Balanced tags (every `<tag>` has `</tag>`)
   - Proper nesting

3. **Metadata completeness**
   - job_title, company, dates, duration present

4. **Professional summary quality**
   - At least 2 sentences

### Running Validation

```bash
python3 scripts/validate_job_history.py <file.txt>
```

**Success output:**
```
✅ VALIDATION PASSED
Job history file matches template schema!
```

**Failure output:**
```
❌ VALIDATION FAILED
Fix the errors above and run validation again.

❌ ERRORS (2):
  • Missing required global section: 'education'
  • Position 1: Missing required section 'core_responsibilities'
```

---

## 🔧 Customization

### Adding New Sections

To add a new section to the schema:

1. **Update template:**
   - Add to `job_history_template.xml`
   - Add to `job_history_template.md`

2. **Update validation:**
   - Add to `REQUIRED_POSITION_SECTIONS` or `OPTIONAL_POSITION_SECTIONS`
   - in `validate_job_history.py`

3. **Update conversion:**
   - Add extraction logic to `convert_job_history_to_md.py`

4. **Update instructions:**
   - Add to `LLM_GENERATION_INSTRUCTIONS.md`

5. **Test:**
   - Generate sample with new section
   - Validate
   - Convert to Markdown
   - Verify output

---

## 📚 Examples

### Example 1: Validating Existing File

```bash
$ python3 scripts/validate_job_history.py \
    chat-history/claude_generated_job_history_summaries_v7.txt

🔍 Validating: chat-history/claude_generated_job_history_summaries_v7.txt

✓ INFO (8):
  ✓ Header found
  ✓ Version history found
  ✓ Found 5 version entries
  ✓ Section 'education' found
  ✓ Section 'certifications' found
  ✓ Section 'master_skills_inventory' found
  ✓ Found 6 positions
  ✓ All XML tags are balanced

✅ VALIDATION PASSED
Job history file matches template schema!
```

### Example 2: Converting to Markdown

```bash
$ python3 scripts/convert_job_history_to_md.py \
    chat-history/claude_generated_job_history_summaries_v7.txt

✅ Converted chat-history/claude_generated_job_history_summaries_v7.txt
   to chat-history/claude_generated_job_history_summaries_v7.md
```

### Example 3: Using /md-job-history Skill

```
User: /md-job-history

Claude: Which job history file would you like to convert to Markdown?

User: chat-history/claude_generated_job_history_summaries_v7.txt

Claude: [Runs conversion script]
✅ Generated chat-history/claude_generated_job_history_summaries_v7.md
```

---

## 🎯 Best Practices

### 1. Always Validate After Generation

```bash
# After LLM generates job_history_vX.txt:
python3 scripts/validate_job_history.py job_history_vX.txt
```

### 2. Keep .txt as Source of Truth

- Edit the .txt file for content updates
- Regenerate .md when needed
- Version control both files (but .txt is authoritative)

### 3. Use Templates as Reference

Before generating:
```
"Please follow templates/job_history_template.xml exactly
and refer to chat-history/claude_generated_job_history_summaries_v7.txt
for style and tone examples."
```

### 4. Validate Before Sharing

Never share job history without validating first:
```bash
# Validate → Convert → Share
python3 scripts/validate_job_history.py file.txt && \
python3 scripts/convert_job_history_to_md.py file.txt
```

### 5. Version Increments

When updating:
- v7.0 → v7.1 (minor changes, additions)
- v7.1 → v8.0 (major restructuring, new positions)

---

## 🔍 Troubleshooting

### Problem: Validation Fails

**Solution:**
1. Read error messages carefully
2. Open both the file and template side-by-side
3. Fix missing/misordered sections
4. Re-validate

### Problem: Conversion Produces Ugly Markdown

**Solution:**
1. Check if .txt has proper XML structure
2. Ensure tags are balanced
3. Verify content between tags isn't malformed
4. Re-run conversion after fixes

### Problem: Different LLM Generated Different Structure

**Solution:**
1. Ensure LLM was given `LLM_GENERATION_INSTRUCTIONS.md`
2. Explicitly reference `job_history_template.xml`
3. Validate output - it will catch inconsistencies
4. Regenerate following template exactly

---

## 📈 Future Enhancements

Potential additions:

- [ ] JSON schema validation (in addition to current regex)
- [ ] Automated version increment suggestions
- [ ] Diff tool to compare versions
- [ ] HTML export with CSS styling
- [ ] PDF generation from Markdown
- [ ] Interactive web viewer for job history
- [ ] API endpoint for programmatic generation
- [ ] GitHub Action for automatic validation

---

## 📞 Support

**Documentation:**
- Template schema: `job_history_template.xml`
- LLM instructions: `LLM_GENERATION_INSTRUCTIONS.md`
- Skill guide: `../.claude/skills/md-job-history.md`

**Scripts:**
- Validation: `../scripts/validate_job_history.py`
- Conversion: `../scripts/convert_job_history_to_md.py`

**Examples:**
- Latest version: `../chat-history/claude_generated_job_history_summaries_v7.txt`
- Markdown version: `../chat-history/claude_generated_job_history_summaries_v7.md`

---

## 📝 Version History

### v1.0 (January 2, 2026)
- ✅ Initial template system created
- ✅ XML template defined
- ✅ Markdown template created
- ✅ Validation script implemented
- ✅ Conversion script tested
- ✅ LLM instructions documented
- ✅ /md-job-history skill created

---

**Last Updated:** January 2, 2026
**System Version:** 1.0
**Maintained by:** Project Owner
