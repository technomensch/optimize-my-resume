# Complete Workflow - Mermaid Journey

**Version:** 1.0
**Last Updated:** 2025-12-29

---

## Overview
The end-to-end journey of an optimized candidate. This diagram visualizes the modular nature of the v6.0 system, where each phase builds on the data artifacts of the previous one.

## Diagram

```mermaid
graph LR
    User([User]) --> P1[Phase 1: Foundation]
    P1 -->|Job History/JD| P2[Phase 2: Core Integration]
    P2 -->|Match Data| P3[Phase 3: Router/Workflows]
    P3 -->|Refined History| P4[Phase 4: Summary/Polish]
    P4 --> Result([Final Application])
    
    subgraph "The Feedback Loop"
    P3 -.->|Updates| P2
    P2 -.->|Results| P3
    end
    
    style P1 fill:#e1f5fe,stroke:#01579b
    style P2 fill:#fff3e0,stroke:#e65100
    style P3 fill:#f3e5f5,stroke:#4a148c
    style P4 fill:#e8f5e9,stroke:#1b5e20
```

## Key Decision Points
- **Feedback Loop:** The system encourages refining Phase 3 (Bullet updates) based on Phase 2 (Gap Analysis) until the score is optimized.
- **Artifact Persistence:** File-based state allows users to stop after Phase 1 and return days later to finish Phase 4.

## Inputs
- Initial career data
- Specific target opportunities

## Outputs
- Optimized resume bullets
- Strategic career summaries
- Data-backed application materials

## Related Phases
- **Flow:** Logical progression through 4 distinct functional blocks.
