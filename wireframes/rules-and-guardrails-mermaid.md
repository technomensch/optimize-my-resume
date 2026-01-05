# Rules and Guardrails - Mermaid Flow

**Version:** 1.0 <!-- v1.0 Initial: Mapping v6.3.x Guardrail Flows -->
**Last Updated:** 2026-01-05

---

## Overview
This diagram visualizes the "Phased Defense" strategy of the system, showing how different guardrails engage at different stages of the optimization process.

## Diagram

```mermaid
flowchart TD
    Input([Raw User Input]) --> G6{G6: Data Loss<br/>Prevention}
    G6 --> P1[Phase 1: History Parsing]
    
    P1 --> G19{G19: Fit Score<br/>Consistency}
    
    subgraph "Validation Core (v6.3.1)"
        G19 -->|Score Check| V1[M1: Portfolio<br/>Weighting]
        V1 --> V2[M2: Adjacent<br/>Technical]
        V2 --> V3[M3: Keyword<br/>Context]
        V3 --> V4[M4: Industry<br/>Context]
        V4 --> V5[M5: Role-Type<br/>Validation]
    end
    
    V5 --> P2[Phase 2/3: Optimization]
    
    subgraph "Output Hardening (v6.3.0)"
        P2 --> Q1[G8: Budget<br/>Compliance]
        Q1 --> Q2[G12: Freshness<br/>Priority]
        Q2 --> Q3[G15: Repetition<br/>Scanner]
        Q3 --> Q4[G22: Em-Dash<br/>Validation]
        Q4 --> Q5[Verb Diversity<br/>Check]
    end
    
    Q5 --> Final([Validated Resume])
    
    style G6 fill:#ffcdd2,stroke:#b71c1c
    style G19 fill:#ffcdd2,stroke:#b71c1c
    style V1 fill:#e1f5fe,stroke:#01579b
    style V2 fill:#e1f5fe,stroke:#01579b
    style V3 fill:#e1f5fe,stroke:#01579b
    style V4 fill:#e1f5fe,stroke:#01579b
    style V5 fill:#e1f5fe,stroke:#01579b
    style Q1 fill:#e8f5e9,stroke:#1b5e20
    style Q2 fill:#e8f5e9,stroke:#1b5e20
    style Q3 fill:#e8f5e9,stroke:#1b5e20
    style Q4 fill:#e8f5e9,stroke:#1b5e20
    style Q5 fill:#e8f5e9,stroke:#1b5e20
```

## Guardrail Stages

1.  **Ingestion Protection (Red):** `G#6` and `G#19` ensure the system doesn't lose data or provide delusional fit scores based on weak evidence.
2.  **Calibrated Assessment (Blue):** The `Validation Core` (M1-M5) applies specific weights and masks to the candidate's history to ensure "Technical Writer" isn't matched as "Senior Software Engineer" without genuine evidence.
3.  **Production Hardening (Green):** Hard formatting rules ensure the output is technically perfect for ATS (Applicant Tracking Systems), including character counts and symbol consistency.

## Priority Legend
- **CRITICAL:** Will stop execution or trigger mandatory regeneration (G#6, G#8, G#19, M3, M5).
- **HIGH:** Flags issues to user or applies significant score penalties (M1, M2, M4, G#12, G#15).
- **MODERATE:** Routine formatting and polish (G#20, G#22).
