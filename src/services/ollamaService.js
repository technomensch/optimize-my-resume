/**
 * Ollama Service - Handles communication with local Ollama instance
 * Base URL: http://localhost:11434
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OllamaService {
  /**
   * Check if Ollama is running and accessible
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      return response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }

  /**
   * List all available models on the local Ollama instance
   */
  static async listModels() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      return [];
    }
  }

  /**
   * Generate a completion using Ollama
   * @param {string} model - The model name (e.g., 'llama3.1:8b')
   * @param {string} prompt - The prompt to send
   * @param {object} options - Additional options (temperature, max_tokens, etc.)
   */
  static async generate(model, prompt, options = {}) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            num_predict: options.max_tokens || 8000,
            ...options
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        text: data.response,
        model: data.model,
        context: data.context,
        done: data.done
      };
    } catch (error) {
      console.error('Ollama generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Chat completion using Ollama
   * @param {string} model - The model name
   * @param {Array} messages - Array of message objects {role, content}
   * @param {object} options - Additional options
   */
  static async chat(model, messages, options = {}) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            num_predict: options.max_tokens || 8000,
            ...options
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message,
        model: data.model,
        done: data.done
      };
    } catch (error) {
      console.error('Ollama chat failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze a resume using the specified Ollama model
   * @param {string} model - The model name
   * @param {string} resumeText - The resume text to analyze
   */
  static async analyzeResume(model, resumeText) {
    const prompt = `You are analyzing a resume. Return ONLY valid JSON with no markdown.

RESUME:
${resumeText}

CRITICAL: Keep ALL text fields concise (under 150 chars each). Be brief and direct.

Return JSON with this structure. For repairsNeeded, ONLY include the issue description (brief, 1 sentence). Save detailed suggestions for per-bullet context.

Identify these repair types:
- Metrics: bullets without quantified impact (%, $, numbers, time)
- Character count: bullets under 100 or over 210 chars
- Verb distribution: any category with fewer than 5% of total bullets
- Weak verbs: Responsible, Helped, Worked on, Participated
- Verb repetition: same category used twice in one position
- No impact: bullets lacking clear business outcome

{
  "verdict": "one sentence summary",
  "blockers": 0,
  "risks": 0,
  "tweaks": 0,
  "totalBullets": 0,
  "bulletsWithMetrics": 0,
  "verbDistribution": {
    "Built": 0,
    "Lead": 0,
    "Managed": 0,
    "Improved": 0,
    "Collaborate": 0
  },
  "averageCharCount": 100,
  "totalWordCount": 0,
  "repairsNeeded": [
    {
      "severity": "risk",
      "position": "Position 1: Job Title",
      "bulletNumber": 1,
      "issue": "Brief issue only (no suggestion here)"
    }
  ],
  "positions": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Jan 2020 - Dec 2021",
      "duration": "2 years",
      "inferredTitle": "Inferred Job Title",
      "seniority": "Senior",
      "reasoning": "Brief: why this title, what scope shows (max 100 chars)",
      "skillsHard": ["skill1", "skill2"],
      "skillsSoft": ["skill1", "skill2"],
      "bullets": [
        {
          "text": "Complete bullet text",
          "verb": "Built",
          "category": "Built",
          "hasMetrics": true,
          "metrics": ["50%", "$100K"],
          "charCount": 150,
          "recommendation": "Specific fix (only if has issues, max 100 chars)"
        }
      ]
    }
  ]
}`;

    return await this.generate(model, prompt, {
      temperature: 0.3, // Lower temperature for more consistent JSON
      max_tokens: 8000
    });
  }
}

export default OllamaService;
