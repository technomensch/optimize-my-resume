# n8n Docker Integration Guide

This guide explains how to integrate the `optimize-my-resume` repository with n8n running in Docker, enabling AI agents to access modular rule files directly.

## Overview

By mounting your local repository into the n8n container, workflows can read optimization rules without duplicating content. This approach maintains a single source of truth while keeping your automation workflows in sync with rule updates.

## Prerequisites

- Docker and Docker Compose installed
- n8n container (or planned deployment)
- Local clone of the `optimize-my-resume` repository at:
  `/Users/mkaplan/Documents/GitHub/optimize-my-resume`

## Volume Mounting Strategy

### Mount Configuration

| Type | Path |
|------|------|
| **Host Path** | `/Users/mkaplan/Documents/GitHub/optimize-my-resume` |
| **Container Path** | `/data/optimize-my-resume` |
| **Mount Mode** | Read-only (`:ro`) |

### Why Read-Only?

Mounting as read-only (`:ro`) prevents workflows from accidentally modifying source files, ensuring:
- Rule files remain intact
- Git working directory stays clean
- No unintended writes from automation processes

## Deployment Methods

### Option A: Docker Compose (Recommended)

Create or update your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_SECURE_COOKIE=false
      - RULE_BASE_PATH=/data/optimize-my-resume
    volumes:
      # Persistent n8n data
      - n8n_data:/home/node/.n8n
      # Mount repository (read-only)
      - /Users/mkaplan/Documents/GitHub/optimize-my-resume:/data/optimize-my-resume:ro

volumes:
  n8n_data:
    driver: local
```

**Start the container:**
```bash
docker compose up -d
```

**View logs:**
```bash
docker compose logs -f n8n
```

### Option B: Docker Run Command

For quick testing or non-compose deployments:

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -e N8N_SECURE_COOKIE=false \
  -e RULE_BASE_PATH=/data/optimize-my-resume \
  -v ~/.n8n:/home/node/.n8n \
  -v /Users/mkaplan/Documents/GitHub/optimize-my-resume:/data/optimize-my-resume:ro \
  n8nio/n8n:latest
```

## Verifying the Mount

After starting your container, verify the mount is working:

```bash
# List files in the mounted directory
docker exec n8n ls -la /data/optimize-my-resume

# Check specific rule files
docker exec n8n find /data/optimize-my-resume/optimization-tools -name "*.md"

# Read a sample rule file
docker exec n8n cat /data/optimize-my-resume/core/format-rules.md
```

## Accessing Files in n8n Workflows

### Method 1: Read Binary File Node

The **Read Binary File** node provides direct file access.

**Configuration:**
- **File Path**: `/data/optimize-my-resume/optimization-tools/resume-analyzer/ra_job-history-creation.md`
- **Property Name**: `data`
- **Output**: Binary data (can be converted to string)

**Example with environment variable:**
```
{{ $env.RULE_BASE_PATH }}/core/format-rules.md
```

### Method 2: Execute Command Node

Use shell commands for dynamic file operations.

**List all rule files:**
```bash
find /data/optimize-my-resume -type f -name "*.md" | sort
```

**Read specific file:**
```bash
cat /data/optimize-my-resume/core/format-rules.md
```

**Find files by pattern:**
```bash
grep -r "specific keyword" /data/optimize-my-resume/optimization-tools
```

**Get file metadata:**
```bash
ls -lh /data/optimize-my-resume/core/format-rules.md
```

### Method 3: Code Node (JavaScript)

For advanced file processing:

```javascript
const fs = require('fs');
const path = require('path');

const basePath = process.env.RULE_BASE_PATH || '/data/optimize-my-resume';
const filePath = path.join(basePath, 'core', 'format-rules.md');

// Read file content
const content = fs.readFileSync(filePath, 'utf8');

// List all markdown files
const rulesDir = path.join(basePath, 'optimization-tools');
const files = fs.readdirSync(rulesDir)
  .filter(file => file.endsWith('.md'));

return {
  content,
  files
};
```

## Environment Variables

Using environment variables makes workflows portable across different environments.

### Setting Variables

**In docker-compose.yml:**
```yaml
environment:
  - RULE_BASE_PATH=/data/optimize-my-resume
  - N8N_SECURE_COOKIE=false
```

**In Docker run command:**
```bash
-e RULE_BASE_PATH=/data/optimize-my-resume
```

### Using Variables in Workflows

Reference environment variables with `$env`:

```
{{ $env.RULE_BASE_PATH }}/core/format-rules.md
{{ $env.RULE_BASE_PATH }}/optimization-tools/resume-analyzer/ra_job-history-creation.md
```

## Common File Paths

Quick reference for frequently accessed files:

| Type | Path |
|------|------|
| **Core Rules** | `/data/optimize-my-resume/core/` |
| **Analyzer Tools** | `/data/optimize-my-resume/optimization-tools/resume-analyzer/` |
| **All MD Files** | `find /data/optimize-my-resume -name "*.md"` |

## Troubleshooting

### Mount Not Visible

**Check container mounts:**
```bash
docker inspect n8n | grep -A 20 Mounts
```

**Verify path exists on host:**
```bash
ls -la /Users/mkaplan/Documents/GitHub/optimize-my-resume
```

### Permission Issues

If you need write access (not recommended), remove `:ro`:
```yaml
- /Users/mkaplan/Documents/GitHub/optimize-my-resume:/data/optimize-my-resume
```

### Path Issues in Workflows

- Use absolute paths inside the container: `/data/optimize-my-resume/...`
- Don't use host paths: `/Users/mkaplan/...` won't work inside container
- Always use forward slashes, even on Windows hosts

### Container Can't Read Files

**Check file permissions on host:**
```bash
ls -la /Users/mkaplan/Documents/GitHub/optimize-my-resume
```

**Verify user ID inside container:**
```bash
docker exec n8n id
```

## Best Practices

1. **Always use read-only mounts** for source repositories
2. **Use environment variables** for paths to enable portability
3. **Validate file existence** before reading in workflows
4. **Handle file read errors** gracefully in automation
5. **Document required files** in workflow descriptions
6. **Version your docker-compose.yml** in source control
7. **Test mount after container restarts** to ensure persistence

## Security Considerations

- Mount as read-only (`:ro`) to prevent accidental modifications
- Only expose the specific directory needed, not entire home directory
- Don't mount sensitive files or credentials
- Review n8n's file access permissions in your workflows
- Consider using Docker secrets for sensitive configuration

## Next Steps

1. Start n8n with the updated configuration
2. Create a test workflow to verify file access
3. Update existing workflows to use environment variables
4. Document which rule files your workflows depend on
5. Set up monitoring for file read errors in production workflows

## Additional Resources

- [n8n Docker Documentation](https://docs.n8n.io/hosting/installation/docker/)
- [Docker Volumes Guide](https://docs.docker.com/storage/volumes/)
- [n8n File System Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.filesreadwrite/)
