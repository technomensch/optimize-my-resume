# Lessons Learned: Keyword Authenticity and Verification Logic

- **Date:** 2026-01-19
- **Category:** Architecture / Logic
- **Tags:** #keywords #verification #guardrail-32 #should-i-apply #hallucination-prevention

---

## The Problem

During the development of the "Should-I-Apply" WebGUI customization feature, we discovered that allowing users to add custom keywords created a high risk of **hallucination**. If a user added "Kubernetes" but their job history only mentioned "Docker," the LLM (in its attempt to be "helpful") would often fabricate a Kubernetes achievement, such as "Managed K8s clusters for 3 years," to ensure the keyword was included.

This violated our core principle of **defensibility**.

---

## The Solution: Guardrail #32 and Lightweight Integration

We implemented a three-tier solution to solve this without sacrificing flexibility:

### 1. The Verification Hub
Instead of just a text box, we built a UI state that tracks every keyword. The system runs a background `grep` or semantic search across the 12-section Job History (XML) to verify every keyword.

### 2. The Verification Modal (Behavioral Friction)
We introduced intentional friction. If a user tries to generate content using an unverified keyword, we interrupt the flow with a modal: *"I couldn't verify this skill in your history. Including it may be indefensible. Proceed anyway?"*

### 3. Lightweight Integration Pattern
We discovered that we don't have to reject unverified skills; we just have to change the *syntax* of how they are included. We instructed the LLM to use "Lightweight Integration" for unverified items—using phrases like "leveraged exposure to" instead of "led development of."

---

## Result and Impact

- **Hallucination Rate:** dropped to near zero for unverified keywords.
- **User Confidence:** Users reported feeling "safer" knowing the system was checking their work.
- **Integrity:** The system maintains a clear 1:1 link between the raw job history and the optimized output.

---

## Lessons Learned

1.  **AI is too "Helpful":** LLMs will lie to satisfy a user request unless explicitly told that "Lightweight" integration is an acceptable middle ground.
2.  **Visual Proof Matters:** Showing a "Verified" badge creates an immediate psychological sense of security for the candidate.
3.  **Friction is a Feature:** In safety-critical or high-stakes contexts (job applications), slowing the user down with a confirmation modal increases perceived value and trust.

---

## Related Resources

- **ADR-007:** [Keyword Verification Hub](../decisions/ADR-007-keyword-verification-hub.md)
- **ADR-008:** [Two-Step Verification Policy](../decisions/ADR-008-two-step-verification-policy.md)
- **Rule:** [Guardrail #32](../../PROJECT-INSTRUCTIONS.md#guardrail-32)
