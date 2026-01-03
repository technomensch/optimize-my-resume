#!/bin/bash
# SessionStart hook for Memory System integration
# Loads project context and suggests memory queries

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" || exit 1

# Detect session context
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
LAST_COMMIT=$(git log -1 --pretty=format:'%h - %s (%cr)' 2>/dev/null || echo "No commits")
UNCOMMITTED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')

# Check if recent work warrants documentation
RECENT_COMMITS=$(git log --since="1 week ago" --oneline 2>/dev/null | wc -l | tr -d ' ')
LESSONS_COUNT=$(find docs/lessons-learned -name "*.md" -not -name "README.md" 2>/dev/null | wc -l | tr -d ' ')

# Build context message
cat <<EOF
## Memory System Context

**Current Branch:** $CURRENT_BRANCH
**Last Commit:** $LAST_COMMIT
**Uncommitted Changes:** $UNCOMMITTED files
**Recent Activity:** $RECENT_COMMITS commits (past week)
**Lessons Captured:** $LESSONS_COUNT lessons

### Suggested Memory Queries

EOF

# Suggest /recall based on branch name
if [[ "$CURRENT_BRANCH" == *"memory"* ]]; then
    echo "- \`/recall memory system\` - Review memory architecture"
elif [[ "$CURRENT_BRANCH" == *"feature"* ]]; then
    echo "- \`/recall patterns\` - Check implementation patterns"
elif [[ "$CURRENT_BRANCH" == *"fix"* ]]; then
    echo "- \`/recall debugging\` - Review debugging lessons"
fi

# Suggest session-summary if lots of recent work
if [ "$RECENT_COMMITS" -gt 10 ]; then
    echo ""
    echo "⚠️ **$RECENT_COMMITS commits in past week** - Consider \`/session-summary\` to preserve context"
fi

# Link to uncommitted changes
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo ""
    echo "📝 **$UNCOMMITTED uncommitted files** - Document changes with \`/lesson-learned\` after commit"
fi

exit 0
