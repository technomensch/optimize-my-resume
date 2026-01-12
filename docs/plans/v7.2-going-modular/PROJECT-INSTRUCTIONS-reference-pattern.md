# PROJECT-INSTRUCTIONS Reference Pattern

## How to Reference artifact-creation-instructions.md

Add this to your PROJECT-INSTRUCTIONS.md file in the Phase 1 section:

---

## PHASE 1: FULL RESUME ANALYSIS (ARTIFACT VERSION)

### For Chat-Based Implementation
[Keep existing Phase 1 instructions here for chatbot use]

### For Artifact Creation (React Component)

**When user wants to create the React artifact:**

<artifact_creation_reference>
  <instruction priority="high">
    For complete instructions on creating the Phase 1 Resume Analyzer as a React artifact,
    see: /mnt/project/artifact-creation-instructions.md
  </instruction>

  <quick_reference>
    Key sections in artifact-creation-instructions.md:
    - Model Selection Configuration: Lines 15-95
    - Error Handling Guidelines: Lines 97-160
    - Architecture Overview: Lines 162-220
    - Step-by-Step Build Process: Lines 222-450
    - Testing Checklist: Lines 452-550
    - Known Issues (Issue #7): Lines 552-580
  </quick_reference>

  <when_to_use>
    Use artifact creation instructions when:
    - User asks to "create a React component"
    - User asks to "build the artifact"
    - User mentions "claude.ai artifact"
    - User wants a GUI/visual interface
    
    Use chat-based instructions when:
    - User is in a plain text chat environment
    - User wants conversational analysis only
    - No artifact creation requested
  </when_to_use>

  <integration_note>
    The artifact uses the same Phase 1 analysis logic as the chat version,
    but packages it in a React component with:
    - Model selection UI
    - Error handling displays
    - Visual results formatting
    - Interactive controls
  </integration_note>
</artifact_creation_reference>

---

## Benefits of This Approach

### Token Savings
- **Before:** 150,000+ tokens (dual versions inline)
- **After:** ~5,000 tokens (reference + essential context)
- **Savings:** ~145,000 tokens (96% reduction)

### Maintenance
- **Before:** Update 2 separate PROJECT-INSTRUCTIONS files
- **After:** Update 1 PROJECT-INSTRUCTIONS + 1 referenced file
- Single source of truth for chat logic
- Single source of truth for artifact logic

### Organization
- Chat instructions: In PROJECT-INSTRUCTIONS.md (always loaded)
- Artifact instructions: In project files (loaded only when needed)
- Clear separation of concerns
- Easy to find and update each

---

## File Structure

```
Your Project
├── PROJECT-INSTRUCTIONS.md (consolidated)
│   ├── Phase 1 (chat version)
│   ├── Phase 2 (chat version)
│   ├── Phase 3 (chat version)
│   └── Reference to artifact-creation-instructions.md
│
└── .claude/
    └── project files/
        ├── artifact-creation-instructions.md ← NEW
        ├── handoff-opus-truncation-fix.md
        ├── start-issue-tracking.md
        ├── create-handoff-backup.md
        ├── job_history_summaries_v8.txt
        └── other project files...
```

---

## Example Usage in Chat

**User:** "Can you create the Phase 1 analyzer as a React artifact?"

**Claude:** "I'll create the Phase 1 Resume Analyzer artifact. Let me reference the creation instructions..."

[Claude uses `view` tool to read /mnt/project/artifact-creation-instructions.md]

[Claude generates artifact following those instructions]

---

## What to Keep in PROJECT-INSTRUCTIONS

### Keep (Chat Logic):
- Phase 1 analysis methodology
- Bullet optimization rules
- JD comparison logic
- Job history schema
- Quality gates
- Verb diversity rules
- Character limits
- All core analysis logic

### Move to artifact-creation-instructions.md (GUI Logic):
- React component structure
- Model selection UI
- Error display components
- Token usage guidance UI
- Results visualization
- Interactive controls
- Step-by-step build process

---

## Migration Steps

### Step 1: Copy artifact-creation-instructions.md to Project Files
```bash
# From outputs to project files
cp /mnt/user-data/outputs/artifact-creation-instructions.md /path/to/project/.claude/
```

### Step 2: Update PROJECT-INSTRUCTIONS.md
Remove GUI-specific sections and replace with:
```xml
<artifact_creation_reference>
  See: /mnt/project/artifact-creation-instructions.md
</artifact_creation_reference>
```

### Step 3: Test References
In Claude.ai:
1. Ask: "Create the Phase 1 artifact"
2. Verify Claude reads artifact-creation-instructions.md
3. Verify artifact is generated correctly

### Step 4: Remove Old PROJECT-INSTRUCTIONS-GUI
Once confirmed working, delete the separate GUI version

---

## Token Usage Comparison

| Scenario | Before (Dual Files) | After (Consolidated) |
|----------|---------------------|----------------------|
| Chat only | 150K tokens | 75K tokens |
| Artifact creation | 150K tokens | 80K tokens (75K + 5K reference) |
| Both in same session | 150K tokens | 80K tokens |

**Why this works:**
- Chat: Loads only chat instructions
- Artifact: Loads chat + references artifact file as needed
- Never loads both inline simultaneously
