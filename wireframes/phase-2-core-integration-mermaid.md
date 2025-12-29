# Phase 2: Core Integration - Mermaid Workflow

**Version:** 1.0
**Last Updated:** 2025-12-29
**Related Modules:** `phases/phase-2/`

---

## Overview
Phase 2 performs the semantic matching between evidence and requirements. It uses high-confidence lookup to map resume achievements to JD needs, while protecting the user via safety gates.

## Diagram

```mermaid
graph TD
    InputJH[Job History] --> Match[Evidence Matcher]
    InputJD[Parsed JD] --> Match
    
    subgraph "Matching Logic"
    Match --> Extract[Requirement Extraction]
    Extract --> Search[History Lookup]
    Search --> Cite[Format Citations]
    end
    
    Cite --> Score[Calculate match %]
    
    subgraph "Blocking Gates"
    Score --> Gate1{Score < 50%?}
    Score --> Gate2{Missing Hard Skills?}
    Score --> Gate3{Location Mismatch?}
    end
    
    Gate1 -->|True| Warn[Warning & Confirmation]
    Gate2 -->|True| Warn
    Gate3 -->|True| Warn
    
    Gate1 & Gate2 & Gate3 -->|Pass/Override| Next([Proceed to Phase 3])
    Warn -->|Reject| End([Stop/Redirect])
    
    style Warn fill:#f66,stroke:#333
```

## Key Decision Points
- **Hard Skill Enforcement:** System prioritizes technical hard skills over soft skills for the matching logic.
- **Location Check:** Specifically looks for "Remote" vs "On-site" contradictions.

## Inputs
- Structured Job History v2.0
- 17-Point Parsed JD

## Outputs
- Comprehensive Gap Analysis
- Match Score (0-100)
- Detailed Evidence Table

## Files Involved
- `phases/phase-2/evidence-matching.md`
- `phases/phase-2-blocking-gates.md`

## Related Phases
- **Previous:** **Phase 1: Foundation**
- **Next:** **Phase 3: Router & Workflows**
