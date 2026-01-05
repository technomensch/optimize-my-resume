# Complete Workflow - Mermaid Journey

**Version:** 1.1 <!-- v1.1 Change: Added v6.3.x Guardrails and Core Modules -->
**Last Updated:** 2026-01-05

---

## Overview
The end-to-end journey of an optimized candidate. This diagram visualizes the modular nature of the v6.0 system, where each phase is reinforced by specific guardrails (Rules-as-Code) and validation modules.

## Diagram

```mermaid
graph TD
    User([User]) --> P1[Phase 1: Foundation]
    P1 -->|Job History/JD| G1{Fit Threshold Gate}
    
    subgraph "Validation Core"
    G1 -->|Score > 80%| M1[Portfolio Weighting]
    M1 --> M2[Adjacent Technical]
    M2 --> M3[Keyword Context]
    M3 --> M4[Industry Context]
    M4 --> M5[Role-Type Validation]
    end
    
    M5 --> P2[Phase 2: Core Integration]
    P2 -->|Match Data| P3[Phase 3: Router/Workflows]
    P3 -->|Refined History| G2{Quality Gate}
    
    subgraph "Output Hardening"
    G2 -->|Pass| Q1[Budget Enforcement]
    Q1 --> Q2[Verb Diversity]
    Q2 --> Q3[Secondary Grammar Check]
    end
    
    Q3 --> P4[Phase 4: Summary/Polish]
    P4 --> Result([Final Application])
    
    subgraph "The Feedback Loop"
    P3 -.->|Updates| P2
    P2 -.->|Results| P3
    end
    
    style P1 fill:#e1f5fe,stroke:#01579b
    style P2 fill:#fff3e0,stroke:#e65100
    style P3 fill:#f3e5f5,stroke:#4a148c
    style P4 fill:#e8f5e9,stroke:#1b5e20
    style G1 fill:#ffcdd2,stroke:#b71c1c
    style G2 fill:#ffcdd2,stroke:#b71c1c
```

## Key Decision Points
- **Fit Threshold Gate:** Evaluates if the candidate's core qualifications align enough to justify a deep dive.
- **Validation Core:** Five modules that prevent "LLM Optimism" (over-weighting portfolio projects or support roles).
- **Quality Gate:** Hard checks on character count (100-210), word count, and verb diversity.

## Inputs
- Initial career data
- Target opportunity JDs
- Portfolio projects (validated at 50% skill weight)

## Outputs
- Validated resume bullets
- Strategic career summaries
- Automated plain text export

## Related Phases
- **Flow:** Logical progression through 4 distinct functional blocks.
- **Integrity:** Guardrail #6 ensures backup/restore of data across every phase change.
