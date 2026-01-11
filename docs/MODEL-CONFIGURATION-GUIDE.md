# Model Configuration Guide

This guide explains how to customize the AI models available in the local development environment.

## Quick Reference

**Config File**: [`src/config/models.json`](../src/config/models.json)

## Model Configuration Structure

```json
{
  "ollama": [
    {
      "id": "model-name",           // Required: Exact Ollama model ID
      "name": "Display Name",       // Required: What users see in dropdown
      "desc": "Short description",  // Required: Model characteristics
      "recommended": true           // Optional: Auto-select this model
    }
  ],
  "claude": [
    // Claude models for production artifact (optional)
  ]
}
```

## Step-by-Step: Adding a New Model

### 1. Install the Model in Ollama

```bash
# Find available models at https://ollama.ai/library
ollama pull model-name

# Examples:
ollama pull llama3.1:8b
ollama pull codellama:13b
ollama pull mixtral:8x7b
```

### 2. Add to Configuration

Edit `src/config/models.json` and add your model to the `ollama` array:

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Recommended - Best balance of speed and quality",
      "recommended": true
    },
    {
      "id": "codellama:13b",          // ← New model
      "name": "💻 Code Llama",         // ← Custom name
      "desc": "Technical focus - Best for developer resumes"  // ← Description
    }
  ]
}
```

### 3. Restart Development Server

```bash
# Stop the dev server (Ctrl+C)
# Start it again
npm run dev
```

The new model will now appear in the dropdown.

## Properties Explained

### `id` (Required)
- **What**: The exact model name as it appears in Ollama
- **Format**: `model-name` or `model-name:version`
- **Examples**:
  - `llama3.1:8b`
  - `mistral`
  - `gemma2:9b`
- **Where to find**: Run `ollama list` to see installed models
- **⚠️ Important**: Must match exactly (case-sensitive)

### `name` (Required)
- **What**: Display name shown to users
- **Format**: Any string (emojis welcome!)
- **Examples**:
  - `"🦙 Llama 3.1"`
  - `"⚡ Mistral - Fast"`
  - `"Gemma 2 (9B)"`
- **Tips**:
  - Use emojis to make models distinguishable at a glance
  - Keep it short (2-4 words)
  - Include key characteristic in parentheses

### `desc` (Required)
- **What**: Brief description of model's strengths
- **Format**: Short phrase or sentence
- **Examples**:
  - `"Recommended - Best balance of speed and quality"`
  - `"Fast - Quick analysis for shorter resumes"`
  - `"Analytical - Detailed technical analysis"`
- **Tips**:
  - Mention speed, quality, or use case
  - Keep under 60 characters
  - Help users choose the right model

### `recommended` (Optional)
- **What**: Auto-selects this model when app loads
- **Format**: Boolean (`true` or `false`)
- **Default**: `false`
- **Use case**: Mark your most reliable/balanced model
- **⚠️ Note**: Only set one model as recommended

## Example Configurations

### Minimal Setup (1 Model)

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "Llama 3.1",
      "desc": "General purpose",
      "recommended": true
    }
  ]
}
```

### Balanced Setup (3 Models)

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Recommended - Best balance",
      "recommended": true
    },
    {
      "id": "mistral",
      "name": "⚡ Mistral",
      "desc": "Fast - Quick analysis"
    },
    {
      "id": "gemma2:9b",
      "name": "📊 Gemma 2",
      "desc": "Analytical - Detailed insights"
    }
  ]
}
```

### Power User Setup (Many Models)

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1 (8B)",
      "desc": "Recommended - Best all-around",
      "recommended": true
    },
    {
      "id": "llama3.1:70b",
      "name": "🦙 Llama 3.1 (70B)",
      "desc": "Slow but highest quality (requires 64GB RAM)"
    },
    {
      "id": "mistral",
      "name": "⚡ Mistral (7B)",
      "desc": "Fastest - 1-3 positions"
    },
    {
      "id": "mixtral:8x7b",
      "name": "🔥 Mixtral (47B)",
      "desc": "Advanced reasoning (requires 32GB RAM)"
    },
    {
      "id": "codellama:13b",
      "name": "💻 Code Llama (13B)",
      "desc": "Developer resumes"
    },
    {
      "id": "phi3",
      "name": "🎯 Phi-3 (3.8B)",
      "desc": "Low RAM - Works on 4GB"
    }
  ]
}
```

## Reordering Models

Models appear in the dropdown **in the order they're listed** in the config file.

**To change order**: Just move items up or down in the array.

```json
{
  "ollama": [
    // This appears FIRST in dropdown
    {
      "id": "mistral",
      "name": "⚡ Mistral",
      "desc": "Fast"
    },
    // This appears SECOND
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Balanced"
    }
  ]
}
```

## Removing Models

**To remove a model**: Delete its entire object from the array.

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Recommended",
      "recommended": true
    }
    // Removed: mistral, gemma2, etc.
  ]
}
```

**⚠️ Note**: Don't forget to remove the comma after the last item!

## Special Cases

### Model Variants (Quantization)

Ollama models come in different sizes:

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",        // 8 billion parameters
      "name": "Llama 3.1 (8B)",
      "desc": "Standard - 8GB RAM"
    },
    {
      "id": "llama3.1:70b",       // 70 billion parameters
      "name": "Llama 3.1 (70B)",
      "desc": "Premium - 64GB RAM"
    },
    {
      "id": "llama3.1:8b-q4_0",   // 4-bit quantized
      "name": "Llama 3.1 (8B, Quantized)",
      "desc": "Lightweight - 4GB RAM"
    }
  ]
}
```

### Specialized Models

```json
{
  "ollama": [
    {
      "id": "codellama:13b",
      "name": "💻 Code Llama",
      "desc": "Software engineers, DevOps"
    },
    {
      "id": "medllama2",
      "name": "⚕️ Med Llama",
      "desc": "Healthcare, medical professionals"
    },
    {
      "id": "sqlcoder",
      "name": "🗄️ SQL Coder",
      "desc": "Database, data engineers"
    }
  ]
}
```

## Emoji Suggestions

Add emojis to make models visually distinct:

| Emoji | Use Case |
|-------|----------|
| 🦙 | Llama models |
| ⚡ | Fast/lightweight models |
| 🔥 | High-performance models |
| 💻 | Code/technical models |
| 📊 | Analytical models |
| 🎯 | Precise/accurate models |
| 🚀 | Latest/cutting-edge models |
| ✨ | Creative/generative models |
| ⚕️ | Medical/healthcare models |
| 🗄️ | Data/SQL models |
| 🌐 | Multilingual models |

## Validation

The app automatically validates your configuration:

✅ **Valid**: Model exists in config AND installed in Ollama
⚠️ **Warning**: Model in config but NOT installed
🚫 **Hidden**: Model installed but NOT in config

### Missing Model Warning

If a configured model isn't installed, the app shows:

```
Missing Models
Some configured models are not installed. To use them, run:

ollama pull model-name
```

## Testing Your Configuration

### 1. Check Models Listed

```bash
ollama list
```

Should show all models you want to use.

### 2. Verify Config Syntax

```bash
# JSON linter (if installed)
jsonlint src/config/models.json

# Or just try to parse it
node -e "console.log(JSON.parse(require('fs').readFileSync('src/config/models.json')))"
```

### 3. Test in App

1. Start dev server: `npm run dev`
2. Look at model dropdown
3. Try selecting each model
4. Verify they work by analyzing a test resume

## Troubleshooting

### Model Not Appearing in Dropdown

**Possible causes:**
1. Model not installed in Ollama
2. Model ID typo in config
3. Invalid JSON syntax
4. Dev server not restarted

**Solution:**
```bash
# 1. Check if installed
ollama list

# 2. Install if missing
ollama pull model-name

# 3. Validate JSON
cat src/config/models.json | python -m json.tool

# 4. Restart server
npm run dev
```

### "Model Not Found" Error When Analyzing

**Cause**: Model ID in config doesn't match Ollama exactly

**Solution**:
```bash
# Get exact model name
ollama list

# Copy exact name to config
# Example: "llama3.1:8b" not "llama3.1" or "llama-3.1:8b"
```

### JSON Syntax Error

**Common mistakes:**

❌ **Trailing comma:**
```json
{
  "ollama": [
    {
      "id": "model",
      "name": "Model",
      "desc": "Description"
    },  // ← Remove this comma (last item)
  ]
}
```

✅ **Correct:**
```json
{
  "ollama": [
    {
      "id": "model",
      "name": "Model",
      "desc": "Description"
    }
  ]
}
```

❌ **Missing quotes:**
```json
{
  id: "model"  // ← Keys need quotes
}
```

✅ **Correct:**
```json
{
  "id": "model"
}
```

## Advanced: Dynamic Model Loading

Want to load models from Ollama automatically instead of config file?

See `src/services/ollamaService.js` method `listModels()`:

```javascript
const models = await OllamaService.listModels();
// Returns all installed Ollama models
```

This is already implemented - the app checks if configured models are installed and hides missing ones.

## Performance Considerations

### Model Size vs. Quality

| Size | RAM Needed | Speed | Quality | Best For |
|------|-----------|-------|---------|----------|
| 3-7B | 4-8GB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Quick analysis, low-end hardware |
| 8-13B | 8-16GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | **Recommended**, balanced |
| 30-40B | 32GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | High quality, slow |
| 70B+ | 64GB+ | ⚡ | ⭐⭐⭐⭐⭐ | Best quality, very slow |

### Recommended Setup by Hardware

**8GB RAM (Minimum):**
```json
["llama3.1:8b", "mistral", "phi3"]
```

**16GB RAM (Recommended):**
```json
["llama3.1:8b", "mistral", "gemma2:9b", "qwen2.5:7b", "codellama:13b"]
```

**32GB+ RAM (Power User):**
```json
Add: ["mixtral:8x7b", "llama3.1:70b"]
```

## Real-World Examples

### Resume Optimization Studio
```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🎯 Balanced",
      "desc": "General analysis",
      "recommended": true
    },
    {
      "id": "codellama:13b",
      "name": "💻 Tech Focus",
      "desc": "Developer/engineer resumes"
    },
    {
      "id": "qwen2.5:7b",
      "name": "✨ Creative",
      "desc": "Bullet rewrites"
    }
  ]
}
```

### Testing Lab
```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "v3.1 (8B)",
      "desc": "Current production"
    },
    {
      "id": "llama3.2:latest",
      "name": "v3.2 (Latest)",
      "desc": "Testing new version"
    },
    {
      "id": "mistral",
      "name": "Mistral",
      "desc": "Alternative baseline"
    }
  ]
}
```

### Minimal Setup (Token Budget)
```json
{
  "ollama": [
    {
      "id": "phi3",
      "name": "Phi-3",
      "desc": "Lightweight, fast",
      "recommended": true
    }
  ]
}
```

## Future Enhancements

Possible additions to configuration:

- **Temperature settings**: Per-model default temperature
- **Context window**: Specify max tokens per model
- **Model tags**: Categorize models (fast, quality, specialized)
- **Auto-detection**: Scan Ollama and auto-populate config
- **Model presets**: Quick-switch between config profiles

## Support

- **Ollama Models**: https://ollama.ai/library
- **Project Issues**: https://github.com/technomensch/optimize-my-resume/issues
- **Config Examples**: See `docs/examples/model-configs/`

---

**Last Updated**: January 2026
**Version**: 7.0.0
