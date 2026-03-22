---
phase: 05-expanded-ai-risk-scenarios
plan: 02
subsystem: cards

tags: [prompt-injection, model-drift, ai-security, card-content, phase-05]

requires:
  - phase: 05-01
    provides: "Card content foundation and test framework"

provides:
  - 40 new scenario cards (20 prompt injection + 20 model drift)
  - Cross-role incident coverage with role-specific framing
  - Authentic 2024-2025 incident sourcing
  - Balanced penalty distribution per role tier

affects:
  - data/cards/*.ts (all 10 role deck files)
  - tests/data/* (card validation tests)
  - Phase 05-03 (explainability + shadow AI cards)

tech-stack:
  added: []
  patterns:
    - Card ID format: {category}_{role_abbrev}_{number}
    - No-win dilemma structure with both outcomes penalized
    - 3-personality feedback per outcome (ROASTER, ZEN_MASTER, LOVEBOMBER)
    - RealWorldReference linking to documented incidents

key-files:
  created: []
  modified:
    - data/cards/chief-something-officer.ts (4 cards added)
    - data/cards/head-of-something.ts (4 cards added)
    - data/cards/something-manager.ts (4 cards added)
    - data/cards/tech-ai-consultant.ts (4 cards added)
    - data/cards/data-scientist.ts (4 cards added)
    - data/cards/software-architect.ts (4 cards added)
    - data/cards/software-engineer.ts (4 cards added)
    - data/cards/vibe-coder.ts (4 cards added)
    - data/cards/vibe-engineer.ts (4 cards added)
    - data/cards/agentic-engineer.ts (4 cards added)

key-decisions:
  - "Reused 2-3 real incidents across roles with different organizational framing (C-suite: liability, engineer: implementation, etc.)"
  - "Set ~20% of cards (4 of 20 per category) as urgent with PressureScenarioMetadata capability"
  - "Maintained penalty correlation: higher fines align with higher heat per heat-correlation.test.ts"
  - "Used 2024-2025 documented incidents: CVE-2025-53773, CVE-2025-54135, EchoLeak, model drift studies"

requirements-completed:
  - RISK-01
  - RISK-02

duration: 17min
completed: 2026-03-22
---

# Phase 05 Plan 02: Expanded AI Risk Cards (Prompt Injection + Model Drift) Summary

**40 new scenario cards across 10 role decks: 20 prompt injection + 20 model drift, all sourced from authenticated 2024-2025 incidents**

## Performance

- **Duration:** 17 min
- **Started:** 2026-03-22T21:37:31Z
- **Completed:** 2026-03-22T21:54:00Z
- **Tasks:** 4 (1 verification + 2 card generation + 1 validation)
- **Files modified:** 10

## Accomplishments

- ✓ Verified deck.ts handles 20+ cards (O(n) Fisher-Yates shuffle, no hardcoded limits)
- ✓ Added 20 prompt injection cards (2 per role × 10 decks)
- ✓ Added 20 model drift cards (2 per role × 10 decks)
- ✓ All cards reference authenticated 2024-2025 incidents (CVEs, studies, documented breaches)
- ✓ All cards include 3-personality feedback (ROASTER, ZEN_MASTER, LOVEBOMBER)
- ✓ All cards follow Card Design Checklist (both outcomes penalized, balanced ratios)
- ✓ All 586 data validation tests pass

## Task Commits

1. **Task 1: Verify deck.ts** - Documented in commit `8f10dcd`
2. **Task 2-3: Add prompt injection and model drift cards** - `8f10dcd` (feat: add 40 cards)

## Files Created/Modified

- `data/cards/chief-something-officer.ts` - 4 cards: CVE response, e-commerce breach, QoQ accuracy, 91% failure stat
- `data/cards/head-of-something.ts` - 4 cards: Copilot team exposure, review escape, team blame, retrain delay
- `data/cards/something-manager.ts` - 4 cards: Budget security tradeoff, review cost, quarterly target, compute budget
- `data/cards/tech-ai-consultant.ts` - 4 cards: Memory poison, vendor claim, CV screening drift, support liability
- `data/cards/data-scientist.ts` - 4 cards: Training poison, CVE response, detection methodology, retraining frequency
- `data/cards/software-architect.ts` - 4 cards: Architecture redesign, API gateway, pipeline architecture, versioning strategy
- `data/cards/software-engineer.ts` - 4 cards: CVE remediation, deploy timeline, deploy pipeline, integration priority
- `data/cards/vibe-coder.ts` - 4 cards: Hidden instructions, Copilot memory, LLM version pinning, code quality drift
- `data/cards/vibe-engineer.ts` - 4 cards: Validation latency, cache poisoning, retraining cost, scaling decision
- `data/cards/agentic-engineer.ts` - 4 cards: Agent API injection, multi-agent propagation, autonomous drift, coordination degradation

## Decisions Made

1. **Incident Reusability:** Used 2-3 core incidents (CVE-2025-53773, EchoLeak, model drift studies) and reframed through each role's organizational lens rather than finding 40 unique incidents.

2. **Urgency Distribution:** Marked ~20% of cards (4 of 20 per category) with urgent flag capability for PressureScenarioMetadata, focusing on security breaches and active drift scenarios.

3. **Penalty Correlation:** Maintained heat/fine correlation per heat-correlation.test.ts requirements - higher fines align with higher heat values.

4. **ID Naming:** Used format `{category}_{role_abbrev}_{descriptor}` (e.g., `cso_prompt_injection_copilot_cve`) for readability and uniqueness.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. Heat/Fine Correlation Test Failure**
- **Found during:** Task 4 validation
- **Card affected:** `hos_model_drift_team_blame`
- **Issue:** onRight had heat 18/fine 3M, onLeft had heat 14/fine 5M - violated correlation expectation
- **Fix:** Adjusted onLeft heat from 14 to 20 (higher heat aligns with higher fine for "taking heat" narrative)
- **Verification:** All tests pass after adjustment

## Next Phase Readiness

- All 10 role decks expanded from 9-10 cards to 13-14 cards
- Card validation infrastructure confirmed working (586 tests pass)
- Ready for Phase 05-03: Explainability + Shadow AI cards (next 40 cards)
- No blockers or technical debt

---
*Phase: 05-expanded-ai-risk-scenarios*
*Completed: 2026-03-22*
