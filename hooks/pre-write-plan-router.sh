#!/bin/bash
# PreToolUse hook for intelligent plan file routing
# Routes plans from .claude/plans/ to appropriate docs/plans/ subdirectories
# with user confirmation

set -euo pipefail

# Read hook input from stdin
HOOK_INPUT=$(cat)

# Extract file path and content from hook input
FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.input.file_path // ""')
CONTENT=$(echo "$HOOK_INPUT" | jq -r '.input.content // ""')

# Only process if this is a plan file in .claude/plans/
if [[ ! "$FILE_PATH" =~ \.claude/plans/.*\.md$ ]]; then
    # Not a plan file - allow without modification
    jq -n '{
        hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "allow"
        }
    }'
    exit 0
fi

# Extract plan filename
PLAN_FILENAME=$(basename "$FILE_PATH")

# Analyze content to determine category
SUGGESTED_CATEGORY=""
CONFIDENCE="unknown"

# Check for knowledge/documentation keywords
if echo "$CONTENT" | grep -iEq "documentation|knowledge|learning|memory system foundation|ADR|decision record|concept"; then
    SUGGESTED_CATEGORY="knowledge"
    CONFIDENCE="high"
# Check for memory system automation keywords
elif echo "$CONTENT" | grep -iEq "automation|hook|trigger|sessionstart|post-commit|skill"; then
    SUGGESTED_CATEGORY="memory"
    CONFIDENCE="high"
# Check for testing keywords
elif echo "$CONTENT" | grep -iEq "test|qa|validation|integration test|e2e|unit test"; then
    SUGGESTED_CATEGORY="testing"
    CONFIDENCE="medium"
# Check for review/analysis keywords
elif echo "$CONTENT" | grep -iEq "review|analysis|optimization|evaluation|assessment"; then
    SUGGESTED_CATEGORY="root"
    CONFIDENCE="medium"
else
    # Could not determine category
    SUGGESTED_CATEGORY="unknown"
    CONFIDENCE="low"
fi

# Build category path based on suggestion
if [[ "$SUGGESTED_CATEGORY" == "unknown" ]]; then
    SUGGESTED_PATH="$FILE_PATH"
elif [[ "$SUGGESTED_CATEGORY" == "root" ]]; then
    SUGGESTED_PATH="docs/plans/$PLAN_FILENAME"
elif [[ "$SUGGESTED_CATEGORY" == "testing" ]]; then
    SUGGESTED_PATH="docs/plans/testing/$PLAN_FILENAME"
else
    SUGGESTED_PATH="docs/plans/dev/$SUGGESTED_CATEGORY/$PLAN_FILENAME"
fi

# Build permission prompt message
if [[ "$SUGGESTED_CATEGORY" == "unknown" ]]; then
    PROMPT_MESSAGE="Could not auto-categorize plan: $PLAN_FILENAME

Please select the appropriate directory:

- knowledge/ - Documentation, ADRs, knowledge capture, concepts
- memory/ - Memory system features, automation, hooks
- testing/ - Test plans, QA strategies
- root (docs/plans/) - General plans, reviews, analyses

Original path: $FILE_PATH"
else
    PROMPT_MESSAGE="Plan file routing suggestion:

File: $PLAN_FILENAME
Detected category: $SUGGESTED_CATEGORY (confidence: $CONFIDENCE)
Suggested path: $SUGGESTED_PATH

Categories:
- knowledge/ - Documentation, ADRs, knowledge capture, concepts
- memory/ - Memory system features, automation, hooks
- testing/ - Test plans, QA strategies
- root (docs/plans/) - General plans, reviews, analyses

Original path: $FILE_PATH

Accept this suggestion or choose a different location?"
fi

# Return ask-user permission request
jq -n \
    --arg message "$PROMPT_MESSAGE" \
    --arg suggested_path "$SUGGESTED_PATH" \
    --arg original_path "$FILE_PATH" \
    '{
        hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "ask_user",
            permissionPrompt: {
                type: "question",
                message: $message,
                options: [
                    {
                        label: ("Use suggested: " + $suggested_path),
                        value: $suggested_path,
                        isDefault: true
                    },
                    {
                        label: "docs/plans/dev/knowledge/",
                        value: ("docs/plans/dev/knowledge/" + ($original_path | split("/") | last))
                    },
                    {
                        label: "docs/plans/dev/memory/",
                        value: ("docs/plans/dev/memory/" + ($original_path | split("/") | last))
                    },
                    {
                        label: "docs/plans/testing/",
                        value: ("docs/plans/testing/" + ($original_path | split("/") | last))
                    },
                    {
                        label: "docs/plans/ (root)",
                        value: ("docs/plans/" + ($original_path | split("/") | last))
                    },
                    {
                        label: ("Keep original: " + $original_path),
                        value: $original_path
                    }
                ],
                updatedInputField: "file_path"
            }
        }
    }'
