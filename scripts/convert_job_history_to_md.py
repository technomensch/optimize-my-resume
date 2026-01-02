#!/usr/bin/env python3
"""
Convert job history .txt file (with XML structure) to beautiful Markdown format.

Usage:
    python convert_job_history_to_md.py input.txt [output.md]

If output.md is not specified, it will be created in the same directory as input
with .md extension.
"""

import re
import sys
import os
from pathlib import Path


def extract_version_history(content):
    """Extract version history from HTML comments."""
    version_match = re.search(r'<!-- Version History:(.*?)-->', content, re.DOTALL)
    if not version_match:
        return ""

    history = version_match.group(1).strip()
    lines = history.split('\n')

    md_history = "## 📚 Version History\n\n"
    current_version = None

    for line in lines:
        line = line.strip()
        if not line or line.startswith('<!--') or line.startswith('-->'):
            continue

        # Version header (e.g., "v7.0: Description (Date)")
        if re.match(r'v\d+\.\d+:', line):
            parts = line.split(':', 1)
            version_num = parts[0]
            desc_and_date = parts[1].strip() if len(parts) > 1 else ""

            # Extract date if present
            date_match = re.search(r'\((.*?)\)$', desc_and_date)
            if date_match:
                date = date_match.group(1)
                desc = desc_and_date[:date_match.start()].strip()
                md_history += f"\n### {version_num}: {desc}\n**Date:** {date}\n\n"
            else:
                md_history += f"\n### {version_num}: {desc_and_date}\n\n"
            current_version = version_num
        # Change items (start with -)
        elif line.startswith('-'):
            md_history += f"- ✅ {line[1:].strip()}\n"

    return md_history + "\n---\n\n"


def extract_metadata(content):
    """Extract global metadata (format, last updated, total jobs)."""
    format_match = re.search(r'Format: (.+)', content)
    updated_match = re.search(r'Last Updated: (.+)', content)
    jobs_match = re.search(r'Total Jobs: (.+)', content)

    md = "## 📋 Document Information\n\n"
    if format_match:
        md += f"**Format:** {format_match.group(1)}  \n"
    if updated_match:
        md += f"**Last Updated:** {updated_match.group(1)}  \n"
    if jobs_match:
        md += f"**Total Positions:** {jobs_match.group(1)}  \n"

    return md + "\n---\n\n"


def extract_education(content):
    """Extract education section."""
    education_match = re.search(r'<education>(.*?)</education>', content, re.DOTALL)
    if not education_match:
        return ""

    edu_content = education_match.group(1)

    md = "## 🎓 Education\n\n"

    # Find all degrees
    degrees = re.findall(r'<degree type="(.*?)">(.*?)</degree>', edu_content, re.DOTALL)

    for degree_type, degree_content in degrees:
        title_match = re.search(r'<title>(.*?)</title>', degree_content)
        inst_match = re.search(r'<institution>(.*?)</institution>', degree_content)
        loc_match = re.search(r'<location>(.*?)</location>', degree_content)

        if title_match and inst_match:
            md += f"### {title_match.group(1)}\n"
            md += f"**Institution:** {inst_match.group(1)}  \n"
            if loc_match:
                md += f"**Location:** {loc_match.group(1)}  \n"
            md += "\n"

    return md + "---\n\n"


def extract_certifications(content):
    """Extract certifications section."""
    cert_match = re.search(r'<certifications>(.*?)</certifications>', content, re.DOTALL)
    if not cert_match:
        return ""

    cert_content = cert_match.group(1)

    md = "## 📜 Certifications\n\n"

    # Find all certifications
    certs = re.findall(r'<certification status="(.*?)">(.*?)</certification>', cert_content, re.DOTALL)

    for status, cert_details in certs:
        name_match = re.search(r'<name>(.*?)</name>', cert_details)
        issuer_match = re.search(r'<issuer>(.*?)</issuer>', cert_details)
        date_match = re.search(r'<date_earned>(.*?)</date_earned>', cert_details)

        if name_match:
            status_emoji = "✅" if status == "active" else "📋"
            md += f"{status_emoji} **{name_match.group(1)}**  \n"
            if issuer_match:
                md += f"   *Issuer:* {issuer_match.group(1)}  \n"
            if date_match:
                md += f"   *Earned:* {date_match.group(1)}  \n"
            md += "\n"

    return md + "---\n\n"


def extract_position(position_content, position_id):
    """Extract and format a single position."""
    # Determine emoji based on position
    position_emoji = "🎯" if position_id == "0" else "🏢"

    # Extract title from header
    title_match = re.search(r'POSITION \d+: (.+)', position_content)
    if not title_match:
        title_match = re.search(r'JOB POSITION \d+: (.+)', position_content)

    title = title_match.group(1) if title_match else f"Position {position_id}"

    md = f"## {position_emoji} Position {position_id}: {title}\n\n"

    # Metadata
    metadata_match = re.search(r'<metadata>(.*?)</metadata>', position_content, re.DOTALL)
    if metadata_match:
        metadata = metadata_match.group(1)

        job_title = re.search(r'<job_title>(.*?)</job_title>', metadata)
        company = re.search(r'<company>(.*?)</company>', metadata)
        duration = re.search(r'<duration>(.*?)</duration>', metadata)
        dates_section = re.search(r'<dates>(.*?)</dates>', metadata, re.DOTALL)

        md += "### 📊 Metadata\n\n"
        if job_title:
            md += f"**Role:** {job_title.group(1)}  \n"
        if company:
            md += f"**Company:** {company.group(1)}  \n"
        if dates_section:
            start = re.search(r'<start>(.*?)</start>', dates_section.group(1))
            end = re.search(r'<end>(.*?)</end>', dates_section.group(1))
            if start and end:
                md += f"**Period:** {start.group(1)} - {end.group(1)}  \n"
        if duration:
            md += f"**Duration:** {duration.group(1)}  \n"
        md += "\n"

    # Professional Summary
    summary_match = re.search(r'<professional_summary>(.*?)</professional_summary>', position_content, re.DOTALL)
    if summary_match:
        summary = summary_match.group(1).strip()
        md += "### 📝 Professional Summary\n\n"
        md += f"{summary}\n\n"

    # Core Responsibilities
    resp_match = re.search(r'<core_responsibilities>(.*?)</core_responsibilities>', position_content, re.DOTALL)
    if resp_match:
        resp_content = resp_match.group(1).strip()
        md += "### 🎯 Core Responsibilities\n\n"
        # Extract bullet points
        bullets = re.findall(r'- (.+?)(?=\n    -|\n  </core_responsibilities>|$)', resp_content, re.DOTALL)
        for bullet in bullets:
            bullet = bullet.strip().replace('\n    ', ' ')
            md += f"- {bullet}\n"
        md += "\n"

    # Key Achievements
    achievements_match = re.search(r'<key_achievements>(.*?)</key_achievements>', position_content, re.DOTALL)
    if achievements_match:
        ach_content = achievements_match.group(1).strip()
        md += "### 🏆 Key Achievements\n\n"

        # Check for structured achievements or bullet list
        structured_achievements = re.findall(r'<achievement id="(\d+)".*?>(.*?)</achievement>', ach_content, re.DOTALL)

        if structured_achievements:
            for ach_id, ach_details in structured_achievements:
                md += f"#### Achievement #{ach_id}\n\n"

                context = re.search(r'<context>(.*?)</context>', ach_details, re.DOTALL)
                action = re.search(r'<action>(.*?)</action>', ach_details, re.DOTALL)
                result = re.search(r'<result>(.*?)</result>', ach_details, re.DOTALL)
                impact = re.search(r'<impact>(.*?)</impact>', ach_details, re.DOTALL)

                if context:
                    md += f"**Context:** {context.group(1).strip()}\n\n"
                if action:
                    md += f"**Action:** {action.group(1).strip()}\n\n"
                if result:
                    md += f"**Result:** {result.group(1).strip()}\n\n"
                if impact:
                    md += f"**Impact:** {impact.group(1).strip()}\n\n"
        else:
            # Simple bullet list
            bullets = re.findall(r'- (.+?)(?=\n    -|\n  </key_achievements>|$)', ach_content, re.DOTALL)
            for bullet in bullets:
                bullet = bullet.strip().replace('\n    ', ' ')
                md += f"- ✅ {bullet}\n"

        md += "\n"

    # Hard Skills
    hard_skills_match = re.search(r'<hard_skills_demonstrated>(.*?)</hard_skills_demonstrated>', position_content, re.DOTALL)
    if hard_skills_match:
        skills_content = hard_skills_match.group(1).strip()
        md += "### 💼 Hard Skills Demonstrated\n\n"
        bullets = re.findall(r'- (.+?)(?=\n    -|\n  </hard_skills_demonstrated>|$)', skills_content, re.DOTALL)
        for bullet in bullets:
            bullet = bullet.strip()
            md += f"- {bullet}\n"
        md += "\n"

    # Impact Metrics
    metrics_match = re.search(r'<impact_metrics>(.*?)</impact_metrics>', position_content, re.DOTALL)
    if metrics_match:
        metrics_content = metrics_match.group(1).strip()
        md += "### 📊 Impact Metrics\n\n"
        md += "| Metric | Value |\n"
        md += "|--------|-------|\n"

        bullets = re.findall(r'- (.+?)(?=\n    -|\n  </impact_metrics>|$)', metrics_content, re.DOTALL)
        for bullet in bullets:
            bullet = bullet.strip()
            # Try to split metric into label and value
            if ':' in bullet:
                parts = bullet.split(':', 1)
                metric_name = parts[0].strip()
                metric_value = parts[1].strip()
                md += f"| {metric_name} | {metric_value} |\n"
            else:
                md += f"| Achievement | {bullet} |\n"
        md += "\n"

    md += "---\n\n"
    return md


def convert_to_markdown(txt_file_path, output_file_path=None):
    """Convert job history .txt to .md format."""
    # Read input file
    with open(txt_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine output path
    if output_file_path is None:
        output_file_path = Path(txt_file_path).with_suffix('.md')

    # Extract title
    title_match = re.search(r'COMPREHENSIVE JOB HISTORY SUMMARIES - VERSION (.+)', content)
    title = title_match.group(1) if title_match else "Job History"

    # Build markdown
    md = f"# 📋 Comprehensive Job History Summaries\n## Version {title}\n\n"
    md += "---\n\n"

    # Add version history
    md += extract_version_history(content)

    # Add metadata
    md += extract_metadata(content)

    # Add education
    md += extract_education(content)

    # Add certifications
    md += extract_certifications(content)

    # Extract all positions
    positions = re.findall(r'<position id="(\d+)">(.*?)</position>', content, re.DOTALL)

    for position_id, position_content in positions:
        # Find the header for this position
        header_pattern = f'POSITION {position_id}:.*?(?=<position id="{position_id}">)'
        header_match = re.search(header_pattern, content, re.DOTALL)
        if header_match:
            full_position = header_match.group(0) + f'<position id="{position_id}">' + position_content + '</position>'
        else:
            full_position = f'<position id="{position_id}">' + position_content + '</position>'

        md += extract_position(full_position, position_id)

    # Write output
    with open(output_file_path, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"✅ Converted {txt_file_path} to {output_file_path}")
    return output_file_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_job_history_to_md.py input.txt [output.md]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(input_file):
        print(f"Error: File not found: {input_file}")
        sys.exit(1)

    convert_to_markdown(input_file, output_file)
