#!/bin/bash
# Install git hooks from templates
# Run this after cloning the repository

set -euo pipefail

HOOKS_DIR=".git/hooks"
TEMPLATE_DIR="hooks"

echo "Installing git hooks..."

# Install post-commit hook
if [ -f "$TEMPLATE_DIR/post-commit.template" ]; then
    cp "$TEMPLATE_DIR/post-commit.template" "$HOOKS_DIR/post-commit"
    chmod +x "$HOOKS_DIR/post-commit"
    echo "✅ Installed post-commit hook"
else
    echo "❌ post-commit.template not found"
    exit 1
fi

echo ""
echo "Git hooks installed successfully!"
echo "Run a git commit to test the Memory System suggestions."
