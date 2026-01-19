# Test Cases: Keyword Management UI

## Test Suite Overview
**Feature:** Keyword Manager
**Priority:** Medium

### TC-67-01: Toggle Keywords
**Steps:**
1. Click keyword in "USE" column.
**Expected:**
- Removes from "USE".
- Appears in "IGNORE".
- Style changes (grayed out).

### TC-67-02: Add Custom Keyword
**Steps:**
1. Enter "React, TypeScript" in input.
2. Click Add.
**Expected:**
- "React" and "TypeScript" appear in "USE" column.
- Marked with "(custom)" badge.
- Input clears.

### TC-67-03: Deduplication
**Steps:**
1. Add custom keyword "Python" (when "Python" already exists from JD).
**Expected:**
- No Duplicate created.
- Existing keyword highlights or flashes.

### TC-67-04: Generation Integration
**Steps:**
1. Move "Java" to IGNORE.
2. Add "Kotlin" to USE.
3. Click "Generate".
**Expected:**
- Prompt includes "Kotlin".
- Prompt excludes "Java".
