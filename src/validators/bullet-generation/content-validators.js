/**
 * Content Validators
 *
 * Validates content quality, constraints, and plausibility.
 */

/**
 * Validator: Limitation Enforcement
 * Rule #5: Limitations not overstated
 */
export function validateLimitationEnforcement(customizedBullets, honestLimitations) {
    const errors = [];

    if (!honestLimitations || honestLimitations.length === 0) {
        return { valid: true, errors: [] };
    }

    const limitationKeywords = honestLimitations.flatMap(limit => {
        const matches = limit.match(/(?:no|limited|lacking|without)\s+(\w+(?:\s+\w+)?)/gi) || [];
        return matches.map(m => m.replace(/^(no|limited|lacking|without)\s+/i, '').toLowerCase());
    });

    const allBulletText = customizedBullets
        .flatMap(pos => pos.bullets.map(b => b.text))
        .join(' ')
        .toLowerCase();

    limitationKeywords.forEach(keyword => {
        if (allBulletText.includes(keyword)) {
            errors.push({
                type: 'LIMITATION_VIOLATED',
                keyword: keyword,
                severity: 'CRITICAL',
                message: `Claimed skill "${keyword}" but it's listed in honest_limitations`,
                requiresRegeneration: true
            });
        }
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Validator: Skill Classification
 * Rule #7: Skills in correct tier
 */
export function validateSkillClassification(generatedContent) {
    const errors = [];

    const hardSkills = generatedContent.hardSkills || generatedContent.technicalSkills || [];
    const softSkills = generatedContent.softSkills || [];

    const hardSkillsLower = hardSkills.map(s => s.toLowerCase().trim());
    const softSkillsLower = softSkills.map(s => s.toLowerCase().trim());

    const overlap = hardSkillsLower.filter(s => softSkillsLower.includes(s));

    overlap.forEach(skill => {
        errors.push({
            type: 'SKILL_DUAL_CLASSIFICATION',
            skill: skill,
            severity: 'MEDIUM',
            message: `Skill "${skill}" classified as both hard and soft skill`,
            requiresRegeneration: true
        });
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Validator: Budget Enforcement
 * Rule #8: Claims within budget (Word counts and lengths)
 */
export function validateBudgetEnforcement(customizedBullets, professionalSummary) {
    const errors = [];
    const MIN_CHAR = 100;
    const MIN_WORDS = 350;
    const MAX_WORDS = 500;

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            const charCount = bullet.text.length;
            if (charCount < MIN_CHAR) {
                errors.push({
                    type: 'BULLET_TOO_SHORT',
                    position: position.position,
                    bulletIndex: bulletIdx,
                    actual: charCount,
                    minimum: MIN_CHAR,
                    severity: 'MEDIUM',
                    message: `Bullet has ${charCount} chars (min ${MIN_CHAR})`,
                    requiresRegeneration: true
                });
            }
        });
    });

    const allBulletWords = customizedBullets
        .flatMap(pos => pos.bullets.map(b => b.text))
        .join(' ')
        .split(/\s+/)
        .filter(w => w.length > 0);

    const summaryWords = professionalSummary?.text
        ? professionalSummary.text.split(/\s+/).filter(w => w.length > 0)
        : [];

    const totalWords = allBulletWords.length + summaryWords.length;

    if (totalWords < MIN_WORDS) {
        errors.push({
            type: 'TOTAL_WORDS_TOO_FEW',
            actual: totalWords,
            minimum: MIN_WORDS,
            severity: 'MEDIUM',
            message: `Total word count ${totalWords} (min ${MIN_WORDS})`,
            requiresRegeneration: true
        });
    }

    if (totalWords > MAX_WORDS) {
        errors.push({
            type: 'TOTAL_WORDS_TOO_MANY',
            actual: totalWords,
            maximum: MAX_WORDS,
            severity: 'MEDIUM',
            message: `Total word count ${totalWords} (max ${MAX_WORDS})`,
            requiresRegeneration: true
        });
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validator: Keyword Density
 * Rule #10: Keywords 15-25% density (per bullet limits)
 */
export function validateKeywordDensity(customizedBullets, useKeywords) {
    const errors = [];
    const MAX_KEYWORDS_PER_BULLET = 3;
    const MAX_KEYWORD_REPEATS = 2;

    const keywordsLower = useKeywords.map(k => k.toLowerCase().replace(/^custom:\s*/i, ''));

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            const bulletLower = bullet.text.toLowerCase();
            let keywordCount = 0;
            const keywordCounts = {};

            keywordsLower.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                const matches = bulletLower.match(regex) || [];
                if (matches.length > 0) {
                    keywordCount++;
                    keywordCounts[keyword] = matches.length;
                }
            });

            if (keywordCount > MAX_KEYWORDS_PER_BULLET) {
                errors.push({
                    type: 'TOO_MANY_KEYWORDS',
                    position: position.position,
                    bulletIndex: bulletIdx,
                    actual: keywordCount,
                    maximum: MAX_KEYWORDS_PER_BULLET,
                    severity: 'MEDIUM',
                    message: `Bullet has ${keywordCount} keywords (max ${MAX_KEYWORDS_PER_BULLET})`,
                    requiresRegeneration: true
                });
            }

            Object.entries(keywordCounts).forEach(([keyword, count]) => {
                if (count > MAX_KEYWORD_REPEATS) {
                    errors.push({
                        type: 'KEYWORD_REPEATED',
                        position: position.position,
                        bulletIndex: bulletIdx,
                        keyword: keyword,
                        count: count,
                        maximum: MAX_KEYWORD_REPEATS,
                        severity: 'MEDIUM',
                        message: `Keyword "${keyword}" used ${count} times in one bullet`,
                        requiresRegeneration: true
                    });
                }
            });
        });
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Validator: Metric Plausibility
 * Rule #11: Metrics realistic for role
 */
export function validateMetricPlausibility(customizedBullets) {
    const errors = [];
    const warnings = [];

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            const highPercentages = bullet.text.match(/\b(\d{3,})\s*%/g) || [];
            highPercentages.forEach(match => {
                const value = parseInt(match);
                if (value > 100 && !bullet.text.toLowerCase().includes('growth') && !bullet.text.toLowerCase().includes('increase')) {
                    warnings.push({
                        type: 'HIGH_PERCENTAGE',
                        position: position.position,
                        bulletIndex: bulletIdx,
                        value: match,
                        severity: 'WARNING',
                        message: `Percentage ${match} may be implausible (>100%)`
                    });
                }
            });

            const timeSavings = bullet.text.match(/reduced.*?by\s+(\d+)\s*%/gi) || [];
            timeSavings.forEach(match => {
                const value = parseInt(match.match(/\d+/)[0]);
                if (value > 100) {
                    errors.push({
                        type: 'IMPOSSIBLE_TIME_SAVINGS',
                        position: position.position,
                        bulletIndex: bulletIdx,
                        value: value,
                        severity: 'HIGH',
                        message: `Time savings of ${value}% is impossible`,
                        requiresRegeneration: true
                    });
                }
            });

            const largeNumbers = bullet.text.match(/\b(\d{7,})\b/g) || [];
            largeNumbers.forEach(num => {
                if (!bullet.text.includes('$') && !bullet.text.toLowerCase().includes('revenue')) {
                    warnings.push({
                        type: 'LARGE_NUMBER',
                        position: position.position,
                        bulletIndex: bulletIdx,
                        value: num,
                        severity: 'WARNING',
                        message: `Large number ${num} may need verification`
                    });
                }
            });
        });
    });

    return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validator: Scope Attribution
 * Rule #17: Credit correctly attributed
 */
export function validateScopeAttribution(customizedBullets, candidateProfile) {
    const warnings = [];

    const seniorScopePhrases = [
        'company-wide', 'enterprise-wide', 'organization-wide',
        'global', 'international', 'multinational',
        'C-suite', 'executive', 'board',
        'millions', 'billion',
        'hundreds of employees', '1000+ employees'
    ];

    const isJunior = candidateProfile?.experienceLevel === 'junior' ||
        candidateProfile?.yearsExperience < 3;

    if (!isJunior) {
        return { valid: true, errors: [], warnings: [] };
    }

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            const bulletLower = bullet.text.toLowerCase();

            seniorScopePhrases.forEach(phrase => {
                if (bulletLower.includes(phrase.toLowerCase())) {
                    warnings.push({
                        type: 'SCOPE_MISMATCH',
                        position: position.position,
                        bulletIndex: bulletIdx,
                        phrase: phrase,
                        severity: 'WARNING',
                        message: `Phrase "${phrase}" may be too senior for candidate level`
                    });
                }
            });
        });
    });

    return { valid: true, errors: [], warnings };
}

/**
 * Validator: Em-Dash
 * Rule #22: Format: "Verb phrase – metric" (Check for ATS compatibility)
 */
export function validateEmDash(customizedBullets, professionalSummary) {
    const errors = [];

    const checkForEmDash = (text, location) => {
        if (text.includes('—') || text.includes('–')) {
            errors.push({
                type: 'EM_DASH_FOUND',
                location: location,
                severity: 'MEDIUM',
                message: `Em-dash/en-dash found in ${location} - may break ATS`,
                requiresRegeneration: true
            });
        }
    };

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            checkForEmDash(bullet.text, `${position.position} bullet ${bulletIdx + 1}`);
        });
    });

    if (professionalSummary?.text) {
        checkForEmDash(professionalSummary.text, 'Professional Summary');
    }

    return { valid: errors.length === 0, errors };
}

export const contentValidators = [
    validateLimitationEnforcement,
    validateSkillClassification,
    validateBudgetEnforcement,
    validateKeywordDensity,
    validateMetricPlausibility,
    validateScopeAttribution,
    validateEmDash
];
