import { findBestMatch } from './matching-helper.js';

/**
 * Core Validators
 *
 * Validators for critical bugs (chronology, metadata, bullet counts).
 */

/**
 * Auto-corrects position metadata to match job history
 */
export function autoCorrectPositions(customizedBullets, eligiblePositions, jobHistory) {
    return customizedBullets.map(bullet => {
        const matchingJob = findBestMatch(bullet.position, jobHistory);

        if (matchingJob) {
            return {
                ...bullet,
                position: matchingJob.position, // Replace with exact title from history
                company: matchingJob.company,   // Replace with exact company from history
                dates: matchingJob.dates        // Replace with exact dates from history
            };
        }
        return bullet;
    });
}

/**
 * Validator: Chronology Depth
 */
export function validateChronologyDepth(customizedBullets, jobHistory) {
    const CURRENT_YEAR = 2026;
    const RECENCY_THRESHOLD = 6;
    const TENURE_THRESHOLD = 5;

    const errors = [];
    const eligiblePositions = [];

    // Step 1: Calculate which positions SHOULD be included
    jobHistory.forEach((job, idx) => {
        const endYear = job.dates.includes('Present')
            ? CURRENT_YEAR
            : parseInt(job.dates.split('-')[1]);
        const startYear = parseInt(job.dates.split('-')[0]);
        const yearsSinceEnd = CURRENT_YEAR - endYear;
        const jobDuration = endYear - startYear;

        if (yearsSinceEnd <= RECENCY_THRESHOLD || job.dates.includes('Present')) {
            eligiblePositions.push({ ...job, index: idx, reason: 'Recent/Current', bulletCount: '3-5' });
        } else if (yearsSinceEnd > RECENCY_THRESHOLD && jobDuration >= TENURE_THRESHOLD) {
            eligiblePositions.push({ ...job, index: idx, reason: 'Tenure Exception', bulletCount: '2-3' });
        }
    });

    // Step 2: Validate LLM included all eligible positions
    const llmPositionTitles = customizedBullets.map(p => p.position.toLowerCase().trim());
    const missingPositions = eligiblePositions.filter(ep =>
        !llmPositionTitles.includes(ep.position.toLowerCase().trim())
    );

    if (missingPositions.length > 0) {
        errors.push({
            type: 'MISSING_POSITIONS',
            message: `Missing ${missingPositions.length} chronology-eligible position(s)`,
            positions: missingPositions.map(p => p.position),
            requiresRegeneration: false // Auto-corrected by skeleton
        });
    }

    // Step 3: Validate LLM didn't include ineligible positions
    const extraPositions = customizedBullets.filter(cb => {
        const matchingJob = jobHistory.find(jh =>
            jh.position.toLowerCase().trim() === cb.position.toLowerCase().trim()
        );
        if (!matchingJob) return true; // Position not in job history at all

        const isEligible = eligiblePositions.some(ep =>
            ep.position.toLowerCase().trim() === cb.position.toLowerCase().trim()
        );
        return !isEligible;
    });

    if (extraPositions.length > 0) {
        errors.push({
            type: 'EXTRA_POSITIONS',
            message: `Included ${extraPositions.length} ineligible position(s)`,
            positions: extraPositions.map(p => p.position),
            requiresRegeneration: false // Auto-corrected by removal
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        eligiblePositions,
        correctedBullets: errors.length > 0 ? autoCorrectPositions(customizedBullets, eligiblePositions, jobHistory) : customizedBullets
    };
}

/**
 * Validator: Position Metadata
 * v9.2.2: Fixed to be non-destructive (always preserve bullets)
 */
export function validatePositionMetadata(customizedBullets, jobHistory, jobDescription) {
    const errors = [];
    const correctedBullets = [];

    customizedBullets.forEach((bullet, idx) => {
        // v9.2.2: Use findBestMatch for robust lookup
        const matchingJob = findBestMatch(bullet.position, jobHistory);

        if (!matchingJob) {
            errors.push({
                type: 'POSITION_NOT_IN_HISTORY',
                index: idx,
                llmPosition: bullet.position,
                message: `Position "${bullet.position}" not found in job history (using fuzzy matching)`,
                severity: 'WARNING', // v9.2.2: Downgraded to warning
                requiresRegeneration: false
            });
            // v9.2.2: ALWAYS preserve bullet even if metadata match fails
            correctedBullets.push({ ...bullet });
            return;
        }

        const correctedBullet = { ...bullet };

        const isIndependent = matchingJob.isIndependent ||
            matchingJob.position.toLowerCase().includes('independent') ||
            matchingJob.position.toLowerCase().includes('portfolio') ||
            matchingJob.company.toLowerCase().includes('personal project') ||
            matchingJob.company.toLowerCase().includes('independent');

        if (bullet.position !== matchingJob.position) {
            const hasSuffix = bullet.position.includes('(Independent Project)') ||
                bullet.position.includes('(Portfolio Project)');

            if (isIndependent && hasSuffix) {
                // This is valid labeling, don't flag as error
            } else {
                errors.push({
                    type: 'WRONG_POSITION_TITLE',
                    index: idx,
                    llmValue: bullet.position,
                    correctValue: isIndependent ? `${matchingJob.position} (Independent Project)` : matchingJob.position,
                    message: `Position title mismatch`,
                    requiresRegeneration: false
                });
                correctedBullet.position = isIndependent ? `${matchingJob.position} (Independent Project)` : matchingJob.position;
            }
        }

        if (bullet.company !== matchingJob.company) {
            const usedJDCompany = bullet.company === jobDescription.company;
            errors.push({
                type: usedJDCompany ? 'USED_JD_COMPANY' : 'WRONG_COMPANY',
                index: idx,
                llmValue: bullet.company,
                correctValue: matchingJob.company,
                severity: usedJDCompany ? 'CRITICAL' : 'HIGH',
                message: usedJDCompany
                    ? `Used JD company "${bullet.company}" instead of history company "${matchingJob.company}"`
                    : `Company mismatch`,
                requiresRegeneration: false
            });
            correctedBullet.company = matchingJob.company;
        }

        if (bullet.dates !== matchingJob.dates) {
            errors.push({
                type: 'WRONG_DATES',
                index: idx,
                llmValue: bullet.dates,
                correctValue: matchingJob.dates,
                message: `Dates mismatch`,
                requiresRegeneration: false
            });
            correctedBullet.dates = matchingJob.dates;
        }

        correctedBullets.push(correctedBullet);
    });

    return {
        valid: errors.length === 0,
        errors,
        correctedBullets
    };
}

/**
 * Validator: Chronological Order
 */
export function validateChronologicalOrder(customizedBullets) {
    const errors = [];

    const bulletsWithYears = customizedBullets.map((bullet, idx) => {
        const endYear = bullet.dates.includes('Present')
            ? 9999
            : parseInt(bullet.dates.split('-')[1]);
        return { ...bullet, endYear, originalIndex: idx };
    });

    let isSorted = true;
    for (let i = 0; i < bulletsWithYears.length - 1; i++) {
        if (bulletsWithYears[i].endYear < bulletsWithYears[i + 1].endYear) {
            isSorted = false;
            errors.push({
                type: 'WRONG_ORDER',
                message: `Positions not in reverse chronological order`,
                requiresRegeneration: false
            });
            break;
        }
    }

    const sortedBullets = bulletsWithYears
        .sort((a, b) => b.endYear - a.endYear)
        .map(({ endYear, originalIndex, ...bullet }) => bullet);

    return {
        valid: isSorted,
        errors,
        correctedBullets: sortedBullets
    };
}

/**
 * Validator: Bullet Counts
 */
export function validateBulletCounts(customizedBullets, eligiblePositions) {
    const errors = [];

    customizedBullets.forEach((bullet) => {
        const eligible = eligiblePositions.find(ep =>
            ep.position.toLowerCase().trim() === bullet.position.toLowerCase().trim()
        );

        if (!eligible) return;

        const bulletCount = bullet.bullets.length;
        const expectedRange = eligible.bulletCount;
        const [min, max] = expectedRange.split('-').map(Number);

        if (bulletCount < min || bulletCount > max) {
            errors.push({
                type: 'WRONG_BULLET_COUNT',
                position: bullet.position,
                actual: bulletCount,
                expected: expectedRange,
                severity: bulletCount === 1 ? 'CRITICAL' : 'HIGH',
                message: `Position "${bullet.position}" has ${bulletCount} bullet(s), expected ${expectedRange}`,
                requiresRegeneration: true
            });
        }
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Validator: Bullet Format
 */
export function validateBulletFormat(customizedBullets) {
    const errors = [];
    const CHAR_LIMIT = 210;
    const VALID_CATEGORIES = ['Built', 'Lead', 'Managed', 'Improved', 'Collaborate'];

    customizedBullets.forEach((position) => {
        position.bullets.forEach((bullet, bulletIdx) => {
            if (bullet.text.length > CHAR_LIMIT) {
                errors.push({
                    type: 'CHAR_LIMIT_EXCEEDED',
                    position: position.position,
                    bulletIndex: bulletIdx,
                    actual: bullet.text.length,
                    limit: CHAR_LIMIT,
                    severity: 'CRITICAL',
                    message: `Bullet exceeds ${CHAR_LIMIT} char limit`,
                    requiresRegeneration: true
                });
            }

            if (!VALID_CATEGORIES.includes(bullet.verbCategory)) {
                errors.push({
                    type: 'INVALID_VERB_CATEGORY',
                    position: position.position,
                    bulletIndex: bulletIdx,
                    message: `Invalid verb category "${bullet.verbCategory}"`,
                    requiresRegeneration: true
                });
            }
        });
    });

    return { valid: errors.length === 0, errors };
}

export const coreValidators = [
    validateChronologyDepth,
    validatePositionMetadata,
    validateChronologicalOrder,
    validateBulletCounts,
    validateBulletFormat
];
