#!/usr/bin/env python3
"""
Validate job history .txt file against schema template.

Checks for:
- Required XML tags
- Proper nesting
- Complete sections
- Consistent structure across positions

Usage:
    python validate_job_history.py <job_history_file.txt>
"""

import re
import sys
from pathlib import Path


class JobHistoryValidator:
    """Validates job history XML structure."""

    REQUIRED_GLOBAL_SECTIONS = [
        'education',
        'certifications',
        'master_skills_inventory'
    ]

    REQUIRED_POSITION_SECTIONS = [
        'metadata',
        'professional_summary',
        'core_responsibilities',
        'key_achievements',
        'hard_skills_demonstrated',
        'impact_metrics'
    ]

    OPTIONAL_POSITION_SECTIONS = [
        'soft_skills_demonstrated',
        'tools_technologies',
        'industry_domain',
        'methodology',
        'strategic_decisions',
        'team_scope',
        'honest_limitations'
    ]

    def __init__(self, file_path):
        self.file_path = file_path
        with open(file_path, 'r', encoding='utf-8') as f:
            self.content = f.read()
        self.errors = []
        self.warnings = []
        self.info = []

    def validate(self):
        """Run all validation checks."""
        print(f"\n🔍 Validating: {self.file_path}\n")

        self.check_header()
        self.check_version_history()
        self.check_global_sections()
        self.check_positions()
        self.check_xml_balance()

        self.print_results()

        return len(self.errors) == 0

    def check_header(self):
        """Validate file header format."""
        if not re.search(r'COMPREHENSIVE JOB HISTORY SUMMARIES - VERSION', self.content):
            self.errors.append("Missing header: 'COMPREHENSIVE JOB HISTORY SUMMARIES - VERSION'")
        else:
            self.info.append("✓ Header found")

        if not re.search(r'Format: v\d+\.\d+ Schema', self.content):
            self.warnings.append("Missing 'Format: vX.X Schema' line")

        if not re.search(r'Last Updated:', self.content):
            self.warnings.append("Missing 'Last Updated:' line")

        if not re.search(r'Total Jobs:', self.content):
            self.warnings.append("Missing 'Total Jobs:' line")

    def check_version_history(self):
        """Validate version history section."""
        if not re.search(r'<!-- Version History:', self.content):
            self.errors.append("Missing version history comment block")
        else:
            self.info.append("✓ Version history found")

            # Check for version entries
            version_entries = re.findall(r'v\d+\.\d+:', self.content)
            if version_entries:
                self.info.append(f"✓ Found {len(version_entries)} version entries")
            else:
                self.warnings.append("No version entries found in history")

    def check_global_sections(self):
        """Validate global profile sections."""
        for section in self.REQUIRED_GLOBAL_SECTIONS:
            if f'<{section}>' in self.content and f'</{section}>' in self.content:
                self.info.append(f"✓ Section '{section}' found")
            else:
                self.errors.append(f"Missing required global section: '{section}'")

    def check_positions(self):
        """Validate position structures."""
        positions = re.findall(r'<position id="(\d+)">(.*?)</position>', self.content, re.DOTALL)

        if not positions:
            self.errors.append("No positions found")
            return

        self.info.append(f"✓ Found {len(positions)} positions")

        for pos_id, pos_content in positions:
            self.validate_position(pos_id, pos_content)

    def validate_position(self, pos_id, content):
        """Validate a single position structure."""
        # Check required sections
        for section in self.REQUIRED_POSITION_SECTIONS:
            if f'<{section}>' in content and f'</{section}>' in content:
                continue
            else:
                self.errors.append(f"Position {pos_id}: Missing required section '{section}'")

        # Check metadata completeness
        if '<metadata>' in content:
            metadata = re.search(r'<metadata>(.*?)</metadata>', content, re.DOTALL)
            if metadata:
                meta_content = metadata.group(1)
                required_meta = ['job_title', 'company', 'dates', 'duration']
                for field in required_meta:
                    if f'<{field}>' not in meta_content:
                        self.warnings.append(f"Position {pos_id}: Missing metadata field '{field}'")

        # Check for professional summary length
        summary = re.search(r'<professional_summary>(.*?)</professional_summary>', content, re.DOTALL)
        if summary:
            summary_text = summary.group(1).strip()
            sentences = summary_text.count('.') + summary_text.count('!') + summary_text.count('?')
            if sentences < 2:
                self.warnings.append(f"Position {pos_id}: Professional summary is very short ({sentences} sentences)")

    def check_xml_balance(self):
        """Check for balanced XML tags."""
        # Find all opening tags
        opening_tags = re.findall(r'<(\w+)[^/>]*>', self.content)
        # Find all closing tags
        closing_tags = re.findall(r'</(\w+)>', self.content)

        # Count occurrences
        from collections import Counter
        open_counts = Counter(opening_tags)
        close_counts = Counter(closing_tags)

        # Check balance
        all_tags = set(opening_tags) | set(closing_tags)
        for tag in all_tags:
            open_count = open_counts.get(tag, 0)
            close_count = close_counts.get(tag, 0)
            if open_count != close_count:
                self.errors.append(
                    f"Unbalanced tag '{tag}': {open_count} opening, {close_count} closing"
                )

        if not self.errors:
            self.info.append("✓ All XML tags are balanced")

    def print_results(self):
        """Print validation results."""
        print("\n" + "=" * 70)

        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")

        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  • {warning}")

        if self.info:
            print(f"\n✓ INFO ({len(self.info)}):")
            for info_item in self.info:
                print(f"  {info_item}")

        print("\n" + "=" * 70)

        if self.errors:
            print("\n❌ VALIDATION FAILED\n")
            print("Fix the errors above and run validation again.")
        elif self.warnings:
            print("\n⚠️  VALIDATION PASSED WITH WARNINGS\n")
            print("Consider addressing the warnings for better quality.")
        else:
            print("\n✅ VALIDATION PASSED\n")
            print("Job history file matches template schema!")

        print("=" * 70 + "\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_job_history.py <job_history_file.txt>")
        sys.exit(1)

    file_path = sys.argv[1]

    if not Path(file_path).exists():
        print(f"Error: File not found: {file_path}")
        sys.exit(1)

    validator = JobHistoryValidator(file_path)
    success = validator.validate()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
