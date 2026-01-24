/**
 * Matching Helper
 *
 * Strategies for position matching to prevent false negatives.
 */

/**
 * Calculates word overlap percentage between two strings
 */
export function wordOverlap(str1, str2) {
    const clean1 = str1.toLowerCase().trim();
    const clean2 = str2.toLowerCase().trim();
    const words1 = clean1.split(/\s+/).filter(w => w.length > 2);
    const words2 = clean2.split(/\s+/).filter(w => w.length > 2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const overlap = words1.filter(w => words2.includes(w)).length;
    const maxWords = Math.max(words1.length, words2.length);

    return overlap / maxWords;
}

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(a, b) {
    const tmp = [];
    for (let i = 0; i <= a.length; i++) tmp[i] = [i];
    for (let j = 0; j <= b.length; j++) tmp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            tmp[i][j] = Math.min(
                tmp[i - 1][j] + 1,
                tmp[i][j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return tmp[a.length][b.length];
}

/**
 * 4-strategy position matching to prevent false negatives
 * v9.2.2 logic
 */
export function findBestMatch(targetTitle, historyPositions) {
    if (!targetTitle || !historyPositions || historyPositions.length === 0) return null;

    const cleanTarget = targetTitle.toLowerCase().trim();

    // Strategy 1: Exact match
    let match = historyPositions.find(hp => hp.position.toLowerCase().trim() === cleanTarget);
    if (match) return match;

    // Strategy 2: Fuzzy contains
    match = historyPositions.find(hp =>
        hp.position.toLowerCase().includes(cleanTarget) ||
        cleanTarget.includes(hp.position.toLowerCase())
    );
    if (match) return match;

    // Strategy 3: Word overlap (> 50%)
    match = historyPositions.find(hp => wordOverlap(cleanTarget, hp.position) > 0.5);
    if (match) return match;

    // Strategy 4: Levenshtein distance (Distance <= 3)
    match = historyPositions.find(hp => levenshteinDistance(cleanTarget, hp.position.toLowerCase().trim()) <= 3);

    return match || null;
}
