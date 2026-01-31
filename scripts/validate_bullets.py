#!/usr/bin/env python3
"""
validate_bullets.py - External Guardrail Validation for Generated Bullets

Purpose: Validates LLM-generated bullet output against project guardrails.
         Runs OUTSIDE the LLM - cannot be bypassed by the model.

Usage:
    python scripts/validate_bullets.py [input_file]
    cat output.txt | python scripts/validate_bullets.py

Exit Codes:
    0 = All validations passed
    1 = One or more validations failed

Created: 2026-01-30
Context: ENFORCEMENT_STRUCTURAL_SOLUTIONS.md - Solution B1
"""

import sys
import re
import unicodedata
from typing import List, Tuple, Dict
from dataclasses import dataclass


def sanitize_input(text: str) -> str:
    """
    Layer 0: Input Sanitization & Normalization (arXiv 2504.11168)
    1. Normalize to UTF-8 (NFKC)
    2. Strip zero-width characters (U+200B, U+200C, U+200D)
    3. Strip other suspicious non-printable characters
    """
    # Normalize Unicode characters
    text = unicodedata.normalize('NFKC', text)
    
    # Strip zero-width characters and other hidden control chars
    # U+200B: Zero Width Space
    # U+200C: Zero Width Non-Joiner
    # U+200D: Zero Width Joiner
    # U+FEFF: Byte Order Mark
    hidden_chars = ['\u200b', '\u200c', '\u200d', '\ufeff']
    for char in hidden_chars:
        text = text.replace(char, '')
        
    # Strip non-printable characters (except common ones like \n, \t)
    text = "".join(ch for ch in text if unicodedata.category(ch)[0] != "C" or ch in ['\n', '\t', '\r'])
    
    return text


@dataclass


@dataclass
class ValidationResult:
    """Result of a single validation check."""
    guardrail: str
    description: str
    passed: bool
    details: str


def check_budget_allocation_table(text: str) -> ValidationResult:
    """
    G40-Stage1: Verify Budget Allocation Table is present.
    This is the Stage 1 checkpoint - must appear BEFORE bullets.
    """
    # Look for common patterns indicating budget allocation table
    patterns = [
        r"Budget Allocation Table",
        r"Position\s*\|.*Recency",
        r"Position\s*\|.*Bullets",
        r"\|\s*Position\s*\|.*\|.*Est.*Words",
    ]

    found = any(re.search(p, text, re.IGNORECASE) for p in patterns)

    return ValidationResult(
        guardrail="G40-Stage1",
        description="Budget Allocation Table present",
        passed=found,
        details="Found" if found else "NOT FOUND - Stage 1 checkpoint missing"
    )


def check_final_reconciliation_table(text: str) -> ValidationResult:
    """
    G40-Stage3: Verify Final Reconciliation Table is present.
    This is the Stage 3 checkpoint - must appear AFTER bullets.
    """
    patterns = [
        r"Final Reconciliation",
        r"Reconciliation Table",
        r"Guardrail Health Check",
        r"\|\s*Requirement\s*\|.*Actual",
        r"\|\s*Check\s*\|.*Value\s*\|.*Pass",
    ]

    found = any(re.search(p, text, re.IGNORECASE) for p in patterns)

    return ValidationResult(
        guardrail="G40-Stage3",
        description="Final Reconciliation Table present",
        passed=found,
        details="Found" if found else "NOT FOUND - Stage 3 checkpoint missing"
    )


def extract_positions(text: str) -> List[int]:
    """
    Extract position numbers mentioned in the output.
    Returns list of position IDs found.
    """
    # Look for various position header patterns
    patterns = [
        r"Position\s+(\d+)",
        r"P(\d+)\s*[-:]",
        r"Position\s*#?(\d+)",
        r"\*\*Position\s+(\d+)",
    ]

    positions = set()
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        positions.update(int(m) for m in matches)

    return sorted(list(positions))


def check_position_count(text: str, expected_min: int = 5) -> ValidationResult:
    """
    G12: Verify minimum number of positions are included.
    Default expects at least 5 positions (adjustable based on recency thresholds).
    """
    positions = extract_positions(text)
    passed = len(positions) >= expected_min

    return ValidationResult(
        guardrail="G12",
        description=f"Minimum {expected_min} positions included",
        passed=passed,
        details=f"Found {len(positions)} positions: {positions}" if positions else "NO positions found"
    )


def check_chronological_order(text: str) -> ValidationResult:
    """
    G12: Verify positions appear in chronological order (0, 1, 2, 3...).
    Position 0 should be first (most recent), increasing order thereafter.
    """
    positions = extract_positions(text)

    if not positions:
        return ValidationResult(
            guardrail="G12",
            description="Chronological order",
            passed=False,
            details="Cannot verify - no positions found"
        )

    # Check if sorted in ascending order (Position 0 first, then 1, 2, 3...)
    is_sorted = positions == sorted(positions)

    return ValidationResult(
        guardrail="G12",
        description="Positions in chronological order",
        passed=is_sorted,
        details=f"Order: {positions}" + (" (correct)" if is_sorted else " (WRONG - should be ascending)")
    )


def extract_bullets(text: str) -> List[Tuple[int, str]]:
    """
    Extract bullet points from text.
    Returns list of (position_id, bullet_text) tuples.
    """
    bullets = []
    current_position = -1

    lines = text.split('\n')
    for line in lines:
        # Check for position header
        pos_match = re.search(r'Position\s+(\d+)', line, re.IGNORECASE)
        if pos_match:
            current_position = int(pos_match.group(1))
            continue

        # Check for bullet point
        bullet_match = re.match(r'^[\s]*[•\-\*]\s*(.+)$', line)
        if bullet_match and current_position >= 0:
            bullet_text = bullet_match.group(1).strip()
            if len(bullet_text) > 20:  # Filter out short non-bullets
                bullets.append((current_position, bullet_text))

    return bullets


def check_bullet_character_limits(text: str, min_chars: int = 100, max_chars: int = 210) -> ValidationResult:
    """
    G24: Verify each bullet is within character limits (100-210 chars).
    """
    bullets = extract_bullets(text)

    if not bullets:
        return ValidationResult(
            guardrail="G24",
            description=f"Bullet character limits ({min_chars}-{max_chars})",
            passed=False,
            details="No bullets found to validate"
        )

    violations = []
    for pos_id, bullet in bullets:
        char_count = len(bullet)
        if char_count < min_chars or char_count > max_chars:
            violations.append(f"Position {pos_id}: {char_count} chars")

    passed = len(violations) == 0

    return ValidationResult(
        guardrail="G24",
        description=f"Bullet character limits ({min_chars}-{max_chars})",
        passed=passed,
        details=f"{len(bullets)} bullets checked" if passed else f"VIOLATIONS: {violations}"
    )


def estimate_word_count(text: str) -> int:
    """
    Estimate word count of bullet content (excluding headers and tables).
    """
    # Extract just the bullet text
    bullets = extract_bullets(text)
    all_bullet_text = ' '.join(bullet for _, bullet in bullets)
    return len(all_bullet_text.split())


def check_word_count(text: str, min_words: int = 350, max_words: int = 500) -> ValidationResult:
    """
    G8: Verify total word count is within budget (350-500 words).
    """
    word_count = estimate_word_count(text)
    passed = min_words <= word_count <= max_words

    return ValidationResult(
        guardrail="G8",
        description=f"Word count budget ({min_words}-{max_words})",
        passed=passed,
        details=f"Estimated {word_count} words" + (" (within range)" if passed else f" (OUT OF RANGE)")
    )


def check_per_bullet_gates(text: str) -> ValidationResult:
    """
    G40-Stage2: Check if per-bullet validation gates are visible.
    Look for evidence of Stage 2 checkpoint execution.
    """
    patterns = [
        r"Character\s*Count.*\d+",
        r"char[s]?.*\d+",
        r"\d+\s*chars",
        r"Verb\s*Category",
        r"\[Built\]|\[Lead\]|\[Managed\]|\[Improved\]|\[Collaborate\]",
        r"Stage 2",
        r"Per-Bullet",
    ]

    evidence_count = sum(1 for p in patterns if re.search(p, text, re.IGNORECASE))
    passed = evidence_count >= 2  # Require at least 2 types of evidence

    return ValidationResult(
        guardrail="G40-Stage2",
        description="Per-bullet validation gates visible",
        passed=passed,
        details=f"Found {evidence_count} indicators" + (" (sufficient)" if passed else " (INSUFFICIENT - Stage 2 evidence missing)")
    )


def check_verb_diversity(text: str, min_categories: int = 3) -> ValidationResult:
    """
    G9: Check for verb category diversity across bullets.
    Should use at least 3 different verb categories.
    """
    verb_categories = {
        'Built': ['built', 'created', 'developed', 'designed', 'engineered', 'architected', 'constructed', 'established', 'pioneered'],
        'Lead': ['led', 'directed', 'managed', 'oversaw', 'supervised', 'coordinated', 'guided', 'mentored', 'spearheaded'],
        'Managed': ['managed', 'administered', 'operated', 'maintained', 'organized', 'facilitated', 'executed', 'conducted'],
        'Improved': ['improved', 'enhanced', 'optimized', 'streamlined', 'accelerated', 'reduced', 'increased', 'transformed'],
        'Collaborate': ['collaborated', 'partnered', 'worked', 'supported', 'assisted', 'contributed', 'aligned', 'interfaced'],
    }

    bullets = extract_bullets(text)
    categories_used = set()

    for _, bullet in bullets:
        bullet_lower = bullet.lower()
        first_word = bullet_lower.split()[0] if bullet_lower.split() else ""

        for category, verbs in verb_categories.items():
            if any(verb in first_word for verb in verbs):
                categories_used.add(category)

    passed = len(categories_used) >= min_categories

    return ValidationResult(
        guardrail="G9",
        description=f"Verb diversity (min {min_categories} categories)",
        passed=passed,
        details=f"Categories used: {list(categories_used)}" + (" (sufficient)" if passed else " (INSUFFICIENT)")
    )


def validate_output(text: str) -> List[ValidationResult]:
    """
    Run all validation checks on the provided text.
    Returns list of ValidationResult objects.
    """
    results = []

    # Stage 1 checkpoint
    results.append(check_budget_allocation_table(text))

    # Position coverage and order
    results.append(check_position_count(text))
    results.append(check_chronological_order(text))

    # Stage 2 checkpoints
    results.append(check_per_bullet_gates(text))
    results.append(check_bullet_character_limits(text))
    results.append(check_verb_diversity(text))

    # Word count budget
    results.append(check_word_count(text))

    # Stage 3 checkpoint
    results.append(check_final_reconciliation_table(text))

    return results


def print_results(results: List[ValidationResult]) -> bool:
    """
    Print validation results in a formatted table.
    Returns True if all passed, False otherwise.
    """
    print("\n" + "=" * 70)
    print("BULLET GENERATION VALIDATION REPORT")
    print("=" * 70)

    all_passed = True

    for result in results:
        status = "PASS" if result.passed else "FAIL"
        icon = "✅" if result.passed else "❌"

        if not result.passed:
            all_passed = False

        print(f"\n[{result.guardrail}] {result.description}")
        print(f"  Status: {icon} {status}")
        print(f"  Details: {result.details}")

    print("\n" + "=" * 70)

    if all_passed:
        print("OVERALL: ✅ ALL VALIDATIONS PASSED")
    else:
        failed_count = sum(1 for r in results if not r.passed)
        print(f"OVERALL: ❌ {failed_count} VALIDATION(S) FAILED")

    print("=" * 70 + "\n")

    return all_passed


def main():
    """Main entry point."""
    # Read input from file or stdin
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                text = f.read()
        except FileNotFoundError:
            print(f"Error: File not found: {input_file}")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading file: {e}")
            sys.exit(1)
    else:
        # Read from stdin
        text = sys.stdin.read()

    if not text.strip():
        print("Error: No input provided")
        print("Usage: python validate_bullets.py [input_file]")
        print("   or: cat output.txt | python validate_bullets.py")
        sys.exit(1)

    # Run sanitization (Layer 0)
    text = sanitize_input(text)

    # Run validation
    results = validate_output(text)

    # Print results and exit with appropriate code
    all_passed = print_results(results)
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
