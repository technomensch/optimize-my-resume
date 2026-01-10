# File Editing Workflow (Token Efficiency)

**Purpose:** Minimize token usage when working with existing files. This skill ensures Claude uses the most efficient approach for file operations.

**Version:** 1.0 (Created: 2026-01-09)

---

## ⚠️ CRITICAL RULE

**NEVER regenerate entire files with `create_file` when the file already exists.**

This wastes 90%+ of tokens compared to surgical editing.

---

## Token Cost Comparison

| Approach | Token Cost | When to Use |
|----------|------------|-------------|
| `create_file` (full file) | ~10,000-20,000 | Only for NEW files |
| `bash_tool` copy + `str_replace` | ~200-500 | Editing EXISTING files |
| `str_replace` only | ~100-300 | File already in outputs |

**Example:** A 1,200-line JSX file
- ❌ Regenerating: ~15,000 tokens
- ✅ Copy + edit 2 lines: ~400 tokens
- **Savings: 97%**

---

## Decision Tree

```
Does the file already exist?
│
├─ YES (in /mnt/user-data/uploads/ or /mnt/project/)
│   │
│   ├─ Need to edit it?
│   │   │
│   │   ├─ File NOT in /mnt/user-data/outputs/ yet
│   │   │   → Step 1: Copy with bash_tool
│   │   │   → Step 2: Edit with str_replace
│   │   │
│   │   └─ File already in /mnt/user-data/outputs/
│   │       → Edit directly with str_replace
│   │
│   └─ Need to view/reference only?
│       → Use view tool (no copy needed)
│
└─ NO (genuinely new file)
    → Use create_file
```

---

## Standard Workflow

### Step 1: Check if File Exists

```bash
# Check uploads
ls -la /mnt/user-data/uploads/

# Check project files
ls -la /mnt/project/

# Check outputs (already copied)
ls -la /mnt/user-data/outputs/
```

### Step 2: Copy to Outputs (if needed)

```bash
# Copy from uploads
cp /mnt/user-data/uploads/MyFile.jsx /mnt/user-data/outputs/

# Copy from project
cp /mnt/project/somefile.md /mnt/user-data/outputs/
```

### Step 3: Make Surgical Edits

Use `str_replace` for specific changes only:

```
str_replace:
  path: /mnt/user-data/outputs/MyFile.jsx
  old_str: "max_tokens: 5000"
  new_str: "max_tokens: 8000"
```

### Step 4: Present the File

```
present_files: ["/mnt/user-data/outputs/MyFile.jsx"]
```

---

## Tool Selection Guide

| Tool | Use For | Token Cost |
|------|---------|------------|
| `view` | Reading file contents | Low |
| `bash_tool` (cp) | Copying files | Very Low |
| `str_replace` | Changing specific text | Very Low |
| `create_file` | Creating NEW files only | High |

---

## Examples

### ✅ CORRECT: Editing an Uploaded File

User uploads `Phase1ResumeAnalyzer.jsx` and asks to change max_tokens.

```bash
# Step 1: Copy to outputs
cp /mnt/user-data/uploads/Phase1ResumeAnalyzer.jsx /mnt/user-data/outputs/

# Step 2: Edit specific line
str_replace:
  path: /mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx
  old_str: "max_tokens: 5000,"
  new_str: "max_tokens: 8000,  // v6.5.4 FIX"

# Step 3: Present
present_files: ["/mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx"]
```

**Total tokens: ~400**

---

### ❌ WRONG: Regenerating the Entire File

```
create_file:
  path: /mnt/user-data/outputs/Phase1ResumeAnalyzer.jsx
  file_text: |
    import React, { useState } from 'react';
    ... (1,200 lines) ...
```

**Total tokens: ~15,000** ← WASTEFUL

---

### ✅ CORRECT: Multiple Edits to Same File

```bash
# Copy once
cp /mnt/user-data/uploads/MyFile.jsx /mnt/user-data/outputs/

# Edit 1
str_replace for change A

# Edit 2
str_replace for change B

# Edit 3
str_replace for change C

# Present once at the end
present_files
```

---

### ✅ CORRECT: Creating a Genuinely New File

User asks to create a new issue tracking document that doesn't exist.

```
create_file:
  path: /mnt/user-data/outputs/docs/issues/issue-28-new-bug.md
  file_text: |
    # Issue #28: New Bug
    ... (new content) ...
```

This is appropriate because the file is NEW.

---

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Correct Approach |
|---------|--------------|------------------|
| Regenerating uploaded files | Wastes 90%+ tokens | Copy + str_replace |
| Using create_file to "update" | Rewrites entire file | str_replace only |
| Not copying to outputs first | Can't edit read-only files | Copy first, then edit |
| Multiple create_file calls | Each rewrites everything | One copy + multiple str_replace |

---

## File Location Rules

| Location | Access | Can Edit? |
|----------|--------|-----------|
| `/mnt/user-data/uploads/` | Read-only | No - copy first |
| `/mnt/project/` | Read-only | No - copy first |
| `/mnt/user-data/outputs/` | Read-write | Yes - edit directly |
| `/home/claude/` | Read-write | Yes - temporary work |

---

## Pre-Flight Checklist

Before editing any file, ask yourself:

- [ ] Does this file already exist somewhere?
- [ ] Have I checked uploads, project, and outputs?
- [ ] Am I using str_replace instead of create_file?
- [ ] Did I copy to outputs first (if needed)?
- [ ] Am I making surgical edits, not regenerating?

---

## Quick Reference Commands

```bash
# List uploaded files
ls /mnt/user-data/uploads/

# List project files
ls /mnt/project/

# Copy uploaded file to outputs
cp /mnt/user-data/uploads/FILENAME /mnt/user-data/outputs/

# Copy project file to outputs
cp /mnt/project/FILENAME /mnt/user-data/outputs/
```

---

**Created:** 2026-01-09  
**Version:** 1.0  
**Purpose:** Reduce token waste by 90%+ when editing existing files
