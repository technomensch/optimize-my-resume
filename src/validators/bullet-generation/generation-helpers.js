
import OllamaService from '../../services/ollamaService.js';
import { parseOriginalHistory, validateAndCorrectLLMResponse, determineExperienceLevel } from './index.js';

/**
 * LLM Call wrapper
 */
export async function callLLM(model, prompt, options) {
    const result = await OllamaService.generate(model, prompt, options);
    if (!result.success) {
        throw new Error(`LLM call failed: ${result.error}`);
    }
    return result.text;
}

/**
 * JSON response parser
 */
export function parseJSONResponse(responseText) {
    let cleaned = responseText.trim();
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in response');
    }
    return JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
}

/**
 * Generation loop
 */
export async function generateWithValidationLoop(
    selectedModel,
    baseGenerationPrompt,
    jobHistorySource,
    jobDescription,
    keywordsToUse,
    honestLimitations,
    ollamaOptions = { temperature: 0.3, max_tokens: 4000 },
    resumeSource = null, // Added for history parsing
    onProgress = null // Callback for UI progress updates: (attempt) => void
) {
    const MAX_ATTEMPTS = 3;
    let attempt = 0;
    let validationResult = null;
    let parsedContent = null;
    const persistentErrors = new Set();

    console.log(`[Generation] Starting with model: ${selectedModel}`);

    // Get a stable reference history BEFORE the loop
    const referenceHistory = await parseOriginalHistory(selectedModel, jobHistorySource, resumeSource);
    console.log('Reference History for Validation:', referenceHistory);

    while (attempt < MAX_ATTEMPTS) {
        attempt++;
        // Notify UI of progress
        if (onProgress) onProgress(attempt);
        let prompt = baseGenerationPrompt;

        if (attempt > 1 && validationResult?.errors?.length > 0) {
            const regenErrors = validationResult.errors.filter(e => e.requiresRegeneration);
            if (regenErrors.length > 0) {
                const errorMessages = regenErrors.map(e => `- ${e.message}`).join('\n');
                prompt = `${baseGenerationPrompt}\n\nCRITICAL: Previous attempt failed validation - MUST FIX:\n${errorMessages}\n\nPlease regenerate addressing these issues.`;

                // Track persistent errors
                regenErrors.forEach(e => persistentErrors.add(e.type || e.message));
                console.log(`[Generation] Attempt ${attempt}/${MAX_ATTEMPTS}: Persistent errors:`, Array.from(persistentErrors));
            }
        }

        try {
            console.log(`[Generation] Attempt ${attempt}/${MAX_ATTEMPTS}: Calling ${selectedModel}...`);
            const response = await callLLM(selectedModel, prompt, ollamaOptions);
            parsedContent = parseJSONResponse(response);

            validationResult = validateAndCorrectLLMResponse(
                parsedContent,
                referenceHistory, // Use stable reference
                jobDescription,
                keywordsToUse,
                honestLimitations,
                { experienceLevel: determineExperienceLevel(referenceHistory) }
            );

            const regenErrors = validationResult.errors.filter(e => e.requiresRegeneration);
            console.log(`[Generation] Attempt ${attempt}/${MAX_ATTEMPTS}: Validation complete - ${regenErrors.length} critical errors`);

            if (regenErrors.length === 0) {
                console.log(`[Generation] ✓ Success on attempt ${attempt}`);
                break;
            }
        } catch (err) {
            console.error(`[Generation] Attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err.message);
            persistentErrors.add(err.message);
            if (attempt >= MAX_ATTEMPTS) throw err;
        }
    }

    const finalSuccess = validationResult.errors.filter(e => e.requiresRegeneration).length === 0;
    console.log(`[Generation] Report - Model: ${selectedModel}, Attempts: ${attempt}, Success: ${finalSuccess}, ErrorCount: ${validationResult.errors.length}`);
    if (persistentErrors.size > 0) {
        console.log(`[Generation] Persistent issues:`, Array.from(persistentErrors));
    }

    return {
        content: validationResult.correctedContent,
        validationResult,
        attempts: attempt,
        success: finalSuccess
    };
}
