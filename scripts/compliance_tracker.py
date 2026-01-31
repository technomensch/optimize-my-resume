#!/usr/bin/env python3
"""
compliance_tracker.py - Layer 5: Compliance Tracking & Observability

Purpose: Logs per-guardrail Pass/Fail status to detect enforcement drift over time.
         Calculates compliance rates per session and platform.
"""

import sys
import json
import os
from datetime import datetime
from typing import List, Dict

LOG_FILE = "docs/governance/compliance_logs.json"

def log_compliance(results: List[Dict], platform: str = "unknown"):
    """
    Append validation results to the compliance log.
    results: List of dicts like {"guardrail": "G1", "passed": True}
    """
    log_entry = {
        "timestamp": datetime.isoformat(datetime.now()),
        "platform": platform,
        "results": results,
        "summary": {
            "total": len(results),
            "passed": sum(1 for r in results if r["passed"]),
            "rate": round(sum(1 for r in results if r["passed"]) / len(results) * 100, 2) if results else 0
        }
    }

    # Ensure directory exists
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

    # Load existing logs
    data = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r') as f:
                data = json.load(f)
        except json.JSONDecodeError:
            pass

    data.append(log_entry)

    # Write back
    with open(LOG_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"Compliance logged: {log_entry['summary']['rate']}% pass rate.")

if __name__ == "__main__":
    # If run directly as a script, expect JSON results on stdin
    try:
        input_data = sys.stdin.read()
        if input_data:
            results_list = json.loads(input_data)
            log_compliance(results_list)
    except Exception as e:
        print(f"Error logging compliance: {e}")
