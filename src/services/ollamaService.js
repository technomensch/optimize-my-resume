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

AFTER analyzing all positions, provide a HOLISTIC Resume Narrative Analysis:

1. What is this person's primary career identity? (one sentence)
   - Is it CLEAR (✅) or UNCLEAR (⚠️)?

2. What is their career arc? (Early → Mid → Current stage progression)
   - Is it COHESIVE (✅) or DISJOINTED (⚠️)?

3. Narrative strength score: 0-100 based on career coherence
   - 85-100: Extremely clear, no confusion
   - 70-84: Mostly clear, minor gaps
   - 50-69: Some confusion, needs work
   - 0-49: Very unclear, major issues

4. What's working well? (Consistent threads, clear progression)

5. What confusion points might a hiring manager spot?
   - For each: Title, Issue, Fix, Hiring Manager Question

6. Which roles are they a strong/moderate/weak fit for?
   - Strong Match (90%+ fit): List specific roles
   - Moderate Match (70-85% fit): List roles with conditions
   - Weak Match (<60% fit): List poor-fit roles

7. How can they strengthen their narrative based on target roles?
   - Provide conditional guidance: "If targeting [Role Type]:\n→ [Action 1]\n→ [Action 2]"

Return this in the narrativeAnalysis object shown above. Do NOT provide per-position reasoning fields.

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
  "narrativeAnalysis": {
    "primaryIdentity": "Technical Writer with Infrastructure Documentation Focus",
    "identityClear": true,
    "careerArc": "Technical Writer → Senior Technical Writer → Lead Documentation Specialist",
    "arcCohesive": true,
    "narrativeStrength": 85,
    "whatsWorking": "Strong consistency in technical documentation roles with clear progression from individual contributor to leadership. Documentation frameworks and cross-team collaboration are recurring strengths.",
    "confusionPoints": [
      {
        "title": "Job Title Inconsistency",
        "issue": "Multiple similar-sounding titles across positions",
        "fix": "Standardize title format in cover letter",
        "question": "What's the difference between these roles?"
      }
    ],
    "roleFitMatrix": {
      "strong": ["Technical Writer", "Documentation Lead", "Content Strategist"],
      "moderate": ["Technical Program Manager", "Developer Relations"],
      "weak": ["Software Engineer"]
    },
    "strengtheningRecommendations": "If targeting Technical Writer roles:\n→ Emphasize documentation framework experience\n→ Highlight cross-team collaboration\n\nIf targeting Documentation Lead roles:\n→ Showcase team leadership examples\n→ Demonstrate strategic documentation planning"
  },
  "positions": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Jan 2020 - Dec 2021",
      "duration": "2 years",
      "seniority": "Senior",
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
