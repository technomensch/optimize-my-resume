# Export Chat History to Archive

**Purpose:** Manually export the current chat conversation to `/chat-history/` before context compaction.

**Version:** 1.0
**Created:** 2025-12-12

---

## Instructions for Assistant

When the user types `/chat-history`, follow this workflow:

### Step 1: Generate Timestamp

Create timestamp in format: `YYYY_MM_DD-HH_MM_SS`

**Example:** `2025_12_12-15_30_45`

**JavaScript reference:**
```javascript
const now = new Date();
const timestamp = now.toISOString()
  .replace(/T/, '-')
  .replace(/\..+/, '')
  .replace(/:/g, '_')
  .replace(/-/g, '_')
  .substring(0, 19);
// Result: "2025_12_12-15_30_45"
```

### Step 2: Check Tracker for Last Export

**Read tracker file:** `chat-history/.chat-history-tracker.json`

**If tracker doesn't exist:**
- Copy from template: `chat-history/.chat-history-tracker.template.json`
- This is a fresh start (first export)

**If tracker exists:**
- Read `lastExportTimestamp` and `totalExports`
- Determine if this is incremental or fresh export

### Step 3: Determine Export Type

**Full Export** (use when):
- No previous exports (`totalExports === 0`)
- User explicitly requests full export
- Previous export was >24 hours ago

**Incremental Export** (use when):
- Previous manual export exists
- Previous export was recent (<24 hours)
- Continuation filename: `YYYY_MM_DD-HH_MM_SS-chat_history_continuation.txt`

### Step 4: Inform User

Provide export instructions:

```markdown
## Chat History Export Ready

**Export Details:**
- **Timestamp:** [YYYY-MM-DD HH:MM:SS]
- **Filename:** `[filename].txt`
- **Export Type:** [Full / Incremental Continuation]
- **Full Path:** `/chat-history/[filename].txt`

**Action Required:**

1. **Export from Claude Code:**
   - Click the export/download icon in the chat interface
   - Or use keyboard shortcut (if available)
   - Copy the full conversation text

2. **Save to Project:**
   - Navigate to: `[full-path-to-project]/chat-history/`
   - Create new file: `[filename].txt`
   - Paste the conversation content
   - Save

3. **Confirm Export:**
   - Reply "done" or "exported" when complete
   - I'll update the tracker to mark this export

**Tracker Status:**
- Previous exports: [count]
- Last export: [timestamp or "None"]
[If incremental: "- Since last export: ~[estimated] new messages"]

**Note:** This file is gitignored and will stay local to your machine.
```

### Step 5: Wait for User Confirmation

After user confirms export (replies "done", "exported", "saved", etc.):

### Step 6: Update Tracker

**Add new entry to tracker:**

```json
{
  "timestamp": "2025-12-12T15:30:45Z",
  "filename": "2025_12_12-15_30_45-chat_history.txt",
  "messageCount": 0,  // Not tracked automatically yet
  "exportType": "manual",
  "notes": ""  // Optional user note
}
```

**For incremental exports, also include:**
```json
{
  "incrementalFrom": "2025_12_12-14_00_00-chat_history.txt"
}
```

**Update tracker metadata:**
- `lastExportTimestamp`: Set to current timestamp
- `totalExports`: Increment by 1

**Write updated tracker back to file.**

Confirm to user:
```markdown
✅ **Export tracked successfully!**

Your chat history has been archived to:
`chat-history/[filename].txt`

**Tracker Updated:**
- Total exports: [new count]
- Last export: [timestamp]

When the chat auto-compacts later, only NEW messages (after this export) will be archived automatically.
```

---

## File Naming Standards

### Full Export
**Format:** `YYYY_MM_DD-HH_MM_SS-chat_history.txt`

**Examples:**
- `2025_12_12-09_15_30-chat_history.txt`
- `2025_12_12-14_45_00-chat_history.txt`

### Incremental/Continuation Export
**Format:** `YYYY_MM_DD-HH_MM_SS-chat_history_continuation.txt`

**Examples:**
- `2025_12_12-16_30_00-chat_history_continuation.txt`
- `2025_12_13-10_15_00-chat_history_continuation.txt`

**Use continuation suffix when:**
- A manual export was created earlier in the session
- This export contains only new messages since that baseline
- Prevents duplicate archiving

---

## Tracker Schema Reference

```json
{
  "exports": [
    {
      "timestamp": "ISO 8601 timestamp",
      "filename": "Export filename",
      "messageCount": 0,
      "exportType": "manual | auto",
      "incrementalFrom": "Baseline filename (for continuations)",
      "notes": "Optional user notes"
    }
  ],
  "lastExportTimestamp": "ISO 8601 timestamp | null",
  "totalExports": 0,
  "version": "1.0"
}
```

---

## Automatic Export Integration (Future)

**When Claude Code triggers auto-compaction:**

1. Check tracker for last manual export
2. If manual export exists and is recent:
   - Only export NEW messages since that baseline
   - Use continuation filename
   - Reference baseline in `incrementalFrom`
3. If no manual export or very old:
   - Export full conversation
   - Use standard filename

**This prevents duplicate archiving** of messages the user already saved manually.

---

## Usage Examples

### Example 1: First Export

**User:** `/chat-history`

**Assistant:**
```
## Chat History Export Ready

**Export Details:**
- **Timestamp:** 2025-12-12 14:30:00
- **Filename:** `2025_12_12-14_30_00-chat_history.txt`
- **Export Type:** Full (first export)

**Action Required:**
[Instructions as above]

**Tracker Status:**
- Previous exports: 0
- Last export: None
```

### Example 2: Incremental Export

**User:** `/chat-history` (after already exporting at 14:00)

**Assistant:**
```
## Chat History Export Ready

**Export Details:**
- **Timestamp:** 2025-12-12 16:30:00
- **Filename:** `2025_12_12-16_30_00-chat_history_continuation.txt`
- **Export Type:** Incremental Continuation

**Action Required:**
[Instructions as above]

**Tracker Status:**
- Previous exports: 1
- Last export: 2025-12-12 14:00:00
- Since last export: ~2.5 hours of conversation

**Note:** This export only needs to include messages AFTER 14:00.
If you're exporting the full conversation, that's fine - the tracker will still
record this as a continuation point.
```

---

## Error Handling

### Tracker File Missing

**If `.chat-history-tracker.json` doesn't exist:**
1. Copy from `.chat-history-tracker.template.json`
2. Initialize with empty exports array
3. Proceed with export as first-time

### Tracker File Corrupted

**If JSON is invalid:**
1. Create backup: `.chat-history-tracker.json.bak`
2. Initialize fresh tracker
3. Warn user about backup

---

## Related Commands

- `/lessons-learned` - Create lessons learned document
- `/lessons-learned update <file>` - Update existing lessons learned
- `/doc-update` - Standard documentation update protocol

---

**Created:** 2025-12-12
**Version:** 1.0
**Related Docs:**
- `docs/lessons-learned/Lessons_Learned_Chat_History_Workflow.md`
- `chat-history/.chat-history-tracker.template.json`
