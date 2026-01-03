# md-job-history

Convert job history .txt files (with XML structure) to beautiful Markdown format for presentations and human review.

## Description

This skill converts job history files from XML-structured .txt format to beautifully formatted Markdown (.md) files that render nicely in GitHub, Notion, VS Code, and other Markdown viewers.

**Purpose:**
- Keep .txt format for optimal LLM consumption (semantic XML structure)
- Generate .md format for human presentations and quick review
- Maintain both formats: .txt as source of truth, .md for viewing

## Usage

```
/md-job-history <job_history_file_name>
```

**Parameters:**
- `job_history_file_name` (optional): Path to the .txt file to convert
  - If not provided, Claude will ask for the filename
  - Can be relative path (e.g., `chat-history/claude_generated_job_history_summaries_v7.txt`)
  - Can be absolute path

**Output:**
- Creates .md file in the same directory as the input .txt file
- Filename: Same as input but with .md extension
- Example: `v7.txt` → `v7.md`

## Examples

### With filename provided
```
/md-job-history chat-history/claude_generated_job_history_summaries_v7.txt
```

### Without filename (Claude will ask)
```
/md-job-history
```
Claude: "Which job history file would you like to convert to Markdown?"
User: "chat-history/claude_generated_job_history_summaries_v7.txt"

## What the Markdown Output Includes

The generated .md file features:

✅ **Beautiful Formatting:**
- Emoji section headers (📋 📚 🎓 🏢 🎯)
- Tables for impact metrics
- Hierarchical structure with # ## ### headers
- Bold/italic text for emphasis
- Bullet points and numbered lists

✅ **All Content Preserved:**
- Version history
- Education & certifications
- All positions with complete details
- Professional summaries
- Core responsibilities
- Key achievements
- Hard skills
- Impact metrics

✅ **Optimal for:**
- GitHub README display
- Notion import
- VS Code preview
- PDF export for presentations
- Quick visual scanning
- Sharing with stakeholders

## Technical Details

**Conversion Script:** `scripts/convert_job_history_to_md.py`

**How It Works:**
1. Reads .txt file with XML structure
2. Parses XML tags and content
3. Converts to Markdown with proper formatting
4. Writes .md file to same directory

**Format Comparison:**

| Feature | .txt (XML) | .md (Markdown) |
|---------|------------|----------------|
| **LLM Readability** | ⭐⭐⭐⭐⭐ Optimal | ⭐⭐⭐⭐ Very Good |
| **Human Readability (raw)** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Very Good |
| **Human Readability (rendered)** | ⭐ None | ⭐⭐⭐⭐⭐ Excellent |
| **Semantic Clarity** | ⭐⭐⭐⭐⭐ Explicit tags | ⭐⭐⭐ Implicit headers |
| **GitHub/Notion Rendering** | ⭐ Raw text | ⭐⭐⭐⭐⭐ Beautiful |
| **Presentation Ready** | ❌ No | ✅ Yes |

## Best Practices

1. **Keep .txt as source of truth**
   - Edit the .txt file for content updates
   - Regenerate .md when needed for presentations

2. **Regenerate .md after updates**
   - Run `/md-job-history` after editing .txt
   - Keeps presentation version in sync

3. **Use .md for:**
   - Presentations to stakeholders
   - Quick visual review
   - GitHub repository documentation
   - Notion workspace imports
   - PDF exports

4. **Use .txt for:**
   - LLM consumption (Claude, Gemini, ChatGPT, Copilot)
   - Source editing
   - Maximum semantic clarity
   - Version control diffs

## Troubleshooting

**File not found:**
- Check the path is correct
- Use `ls` to verify filename
- Use tab completion for paths

**Permission denied:**
- Ensure you have write access to the directory
- Check file permissions

**Formatting issues:**
- Verify input file has proper XML structure
- Check for unclosed tags in source .txt
- Review conversion script output for errors

## Related Files

- **Conversion Script:** `scripts/convert_job_history_to_md.py`
- **Example Input:** `chat-history/claude_generated_job_history_summaries_v7.txt`
- **Example Output:** `chat-history/claude_generated_job_history_summaries_v7.md`

## Version

- **Created:** January 2, 2026
- **Last Updated:** January 2, 2026
- **Version:** 1.0
