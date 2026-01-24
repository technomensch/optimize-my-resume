/**
 * History Parser
 *
 * Extracts and parses job history with LLM and regex fallback.
 * v9.2.2 logic
 */

export async function parseOriginalHistory(selectedModel, jobHistorySource, resumeSource) {
    let content = '';
    if (jobHistorySource) content = jobHistorySource.content;
    else if (resumeSource) content = resumeSource.content;

    if (!content) return { positions: [], parsingMethod: 'failed', errors: ['No content to parse'] };

    try {
        // First Pass: LLM Extraction
        const prompt = `Extract ALL positions from this job history. Return ONLY a JSON array of objects.
    
    Format:
    [
      {
        "position": "Title",
        "company": "Company",
        "dates": "Start-End",
        "isIndependent": true/false
      }
    ]
    
    Content:
    ${content}`;

        // Note: OllamaService and other global services are assumed to be available in the context where this is used,
        // or passed in if this was a truly decoupled module. For now, we maintain the existing usage pattern.
        if (typeof OllamaService !== 'undefined') {
            const response = await OllamaService.generate(selectedModel, prompt, { temperature: 0 });
            if (response.success) {
                let text = response.text.trim();
                text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                const start = text.indexOf('[');
                const end = text.lastIndexOf(']');
                if (start !== -1 && end !== -1) {
                    const positions = JSON.parse(text.substring(start, end + 1));
                    return { positions, parsingMethod: 'llm', errors: [] };
                }
            }
        }
    } catch (err) {
        console.warn('History parsing failed, falling back to regex:', err);
    }

    // FALLBACK: Regex parsing (v9.2.2 Safety)
    const positions = [];
    const lines = content.split('\n');

    // Pattern A: Title at Company (Date range)
    const patternA = /^#*\s*([^|\n(]+)\s+(?:at|@)\s+([^|\n(]+)\s*\(([^)]+)\)/;
    // Pattern B: Title | Company | Dates
    const patternB = /^#*\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^|\n]+)/;

    lines.forEach(line => {
        let match = line.match(patternA);
        if (match) {
            positions.push({
                position: match[1].trim(),
                company: match[2].trim(),
                dates: match[3].trim(),
                isIndependent: match[1].toLowerCase().includes('independent') || match[1].toLowerCase().includes('portfolio')
            });
            return;
        }

        match = line.match(patternB);
        if (match) {
            positions.push({
                position: match[1].trim(),
                company: match[2].trim(),
                dates: match[3].trim(),
                isIndependent: match[1].toLowerCase().includes('independent') || match[1].toLowerCase().includes('portfolio')
            });
        }
    });

    return {
        positions,
        parsingMethod: positions.length > 0 ? 'regex' : 'failed',
        errors: positions.length > 0 ? [] : ['Could not extract any positions from history']
    };
}

/**
 * Extracts job history from LLM's parsed output
 * Used to convert optimized JSON back to a format validators understand
 */
export function extractJobHistoryFromLLMOutput(customizedBullets) {
    if (!customizedBullets || !Array.isArray(customizedBullets)) return [];
    return customizedBullets.map(pos => ({
        position: pos.position,
        company: pos.company,
        dates: pos.dates,
        bullets: pos.bullets ? pos.bullets.map(b => typeof b === 'string' ? b : (b.text || '')) : []
    }));
}
