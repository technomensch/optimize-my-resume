# Solution Approach: Keyword Management UI & Prompts

## Overview
Implement keyword management in the WebGUI and enable equivalent control via LLM prompts.

---

## 1. WebGUI Implementation
- **State:** `keywordsToUse`, `keywordsToIgnore`.
- **UI:** Interactive "USE" vs "IGNORE" columns.

---

## 2. Prompt Implementation (Shadow Sync Required)
We must instruct the LLM to respect user-provided keyword constraints during chat interactions.

### Module: `optimization-tools/narrative-generator/ng_summary-generation.md`
Add logic to handle user overrides:

```xml
<user_keyword_preferences>
  IF the user provides a list of specific keywords to USE or IGNORE:
  1. **Strictly Enforce:** Do not use any keyword from the "IGNORE" list.
  2. **Prioritize:** Ensure valid keywords from the "USE" list are integrated (if evidence exists).
  3. **Custom Keywords:** If user adds a keyword not in the JD, treat it as a high-priority "USE" keyword (subject to evidence validation).
</user_keyword_preferences>
```

### Shadow Sync Protocol
1. **MODULE:** `optimization-tools/narrative-generator/ng_summary-generation.md` (Add preference logic).
2. **GOLD MASTER:** `PROJECT-INSTRUCTIONS.md` (Sync).
3. **ENTRYPOINT:** `Project-GUI-Instructions.md` (Verify).

---

## Files to Modify
- `Should-I-Apply-webgui.jsx`
- `optimization-tools/narrative-generator/ng_summary-generation.md`
- `PROJECT-INSTRUCTIONS.md`
- `Project-GUI-Instructions.md`

---

## Testing
See `test-cases.md`
