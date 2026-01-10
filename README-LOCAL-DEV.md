# Local Development Environment - Ollama Integration

This branch (`7.0.0-create-local-dev-test-environment`) contains the local development setup for Optimize My Resume using Ollama AI models.

## Overview

- **Production**: Uses Claude API (artifact in Claude.ai) - requires tokens, cloud-based
- **Local Dev**: Uses Ollama (this setup) - free, unlimited, runs on your machine

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Ollama** installed and running
   - Install: https://ollama.ai/download
   - Start: `ollama serve` (in a separate terminal)
3. **Ollama Models** (at least one required):
   ```bash
   # Recommended - best for resume analysis
   ollama pull llama3.1:8b

   # Optional - other models
   ollama pull mistral
   ollama pull gemma2:9b
   ollama pull qwen2.5:7b
   ollama pull phi3
   ```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Ollama (if not already running)
```bash
# In a separate terminal
ollama serve
```

### 3. Run the Development Server
```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
optimize-my-resume/
├── src/
│   ├── components/
│   │   └── ResumeAnalyzer.jsx       # Main UI component (Ollama version)
│   ├── services/
│   │   └── ollamaService.js         # Ollama API integration
│   ├── config/
│   │   └── models.json              # ⭐ Model configuration (EDIT THIS!)
│   ├── App.jsx                      # App shell with Ollama status
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Tailwind CSS
├── docs/plans/hand-offs/v6.5.4-hand_off/completed artifacts/
│   └── Phase1ResumeAnalyzer.jsx     # Original Claude version (for reference)
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Dependencies and scripts
```

## Customizing Models

### Easy Method: Edit Config File

Open `src/config/models.json` and modify the `ollama` array:

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",              // ← Model ID (must match Ollama)
      "name": "🦙 Llama 3.1",            // ← Display name
      "desc": "Recommended - Best for resumes", // ← Description
      "recommended": true                // ← Shows first in dropdown
    },
    {
      "id": "mistral",
      "name": "⚡ Mistral",
      "desc": "Fast - Quick analysis"
    }
    // Add more models here...
  ]
}
```

**To add a new model:**
1. Install it: `ollama pull model-name`
2. Add to `models.json`
3. Restart dev server

**To change order:**
- Just reorder the array in `models.json`

**To remove a model:**
- Delete it from the array

### Available Properties

- `id` (required): Exact Ollama model name
- `name` (required): Display name with emoji
- `desc` (required): Short description
- `recommended` (optional): Set to `true` for auto-selection

## Features

### Local Development Benefits

✅ **Unlimited Usage** - No token limits
✅ **Offline Capable** - Works without internet (after models downloaded)
✅ **Privacy** - Resume data never leaves your machine
✅ **Free** - No API costs
✅ **Fast Iteration** - Experiment with different models
✅ **Model Flexibility** - Easy to add/remove/test models

### Ollama Status Indicator

The app shows Ollama connection status:
- 🟢 **Connected** - Ollama running, models available
- 🔴 **Disconnected** - Ollama not running
- 🔵 **Checking** - Testing connection

### Model Auto-Detection

The app only shows models that are:
1. Configured in `models.json`
2. Actually installed on your system

If a configured model is missing, the app shows installation instructions.

## Troubleshooting

### "Ollama Not Running" Error

**Solution:**
```bash
# Start Ollama in a separate terminal
ollama serve
```

### "Model Not Found" Error

**Solution:**
```bash
# Pull the model
ollama pull llama3.1:8b
```

### JSON Parsing Errors

**Cause:** Model produced invalid JSON (common with complex resumes)

**Solutions:**
1. Switch to Llama 3.1 (best JSON accuracy)
2. Simplify resume (3-4 positions, 2-3 bullets each)
3. Try again (models can be inconsistent)

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
```

### Slow Analysis

**Cause:** Large resume or underpowered hardware

**Solutions:**
1. Use smaller model (Mistral, Phi-3)
2. Reduce resume size
3. Upgrade RAM (8GB minimum recommended)

## Model Recommendations

| Model | Speed | Quality | RAM | Best For |
|-------|-------|---------|-----|----------|
| **llama3.1:8b** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB | General use (recommended) |
| **mistral** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 6GB | Quick analysis |
| **gemma2:9b** | ⭐⭐ | ⭐⭐⭐⭐ | 10GB | Detailed technical analysis |
| **qwen2.5:7b** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB | Creative bullet rewrites |
| **phi3** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 4GB | Low RAM systems |

## Development vs Production

### Local Dev (This Branch)
- Uses Ollama models
- Free and unlimited
- Runs on your machine
- Best for development and testing

### Production (Claude Artifact)
- Uses Claude API (Haiku/Sonnet/Opus)
- Cloud-based
- Token limits apply
- Best for end users

### Switching Between Environments

**To test Claude integration locally:**
1. Checkout main branch
2. Copy `docs/plans/.../Phase1ResumeAnalyzer.jsx` to `src/components/`
3. Create `.env` with Claude API key
4. Modify to use Claude API instead of Ollama

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

### Ollama API (http://localhost:11434)

- `GET /api/tags` - List installed models
- `POST /api/generate` - Generate completion
- `POST /api/chat` - Chat completion

## Next Steps

### Phase 2: Additional Features

Future enhancements for this local dev environment:

1. **Bullet Optimization** - Rewrite individual bullets
2. **Job Description Matching** - Compare resume to JD
3. **Multi-Model Comparison** - Test same resume with different models
4. **Resume History** - Save and compare analyses
5. **Export Options** - PDF, DOCX, JSON formats

### Contributing

To add features to this local dev environment:

1. Create feature branch from `7.0.0-create-local-dev-test-environment`
2. Make changes
3. Test with multiple Ollama models
4. Submit PR

## License

Same as main project.

## Support

- **Ollama Issues**: https://github.com/ollama/ollama/issues
- **Project Issues**: https://github.com/technomensch/optimize-my-resume/issues

---

**Note**: This is the local development version. For the production Claude-based artifact, see the main README and `docs/plans/hand-offs/v6.5.4-hand_off/`.
