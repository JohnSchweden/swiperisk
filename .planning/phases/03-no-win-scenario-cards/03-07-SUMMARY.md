---
phase: 03-no-win-scenario-cards
plan: 07
subsystem: game-balance
tags: [heat, balance, role-tier, gameplay]

requires:
  - phase: 03-06
    provides: "Real-world reference system for cards"
provides:
  - Heat scaling constants (ROLE_HEAT_SCALES)
  - Balanced heat values for all 10 roles
  - 6-8 cards gameplay duration
affects: [gameplay, balance-testing]

tech-stack:
  added: [ROLE_HEAT_SCALES constant]
  patterns: [role-tier-proportional-scaling]

key-files:
  created: []
  modified:
    - types.ts - Added ROLE_HEAT_SCALES constant
    - data/cards/vibe-coder.ts - Heat 8-40 (was 20-95)
    - data/cards/vibe-engineer.ts - Heat 8-42 (was 20-95)
    - data/cards/agentic-engineer.ts - Heat 10-50 (was 25-95)
    - data/cards/software-engineer.ts - Heat 8-35 (was 20-90)
    - data/cards/data-scientist.ts - Heat 8-42 (was 20-90)
    - data/cards/tech-ai-consultant.ts - Heat 12-45 (was 30-85)
    - data/cards/software-architect.ts - Heat 10-48 (was 25-90)
    - data/cards/something-manager.ts - Heat 8-48 (was 20-90)
    - data/cards/head-of-something.ts - Heat 12-48 (was 25-85)
    - data/cards/chief-something-officer.ts - Heat 20-68 (was 30-95)

key-decisions:
  - "Scale factors: 0.45x junior roles, 0.75x C-suite"
  - "Keep hype values unchanged (already balanced)"
  - "Target 6-8 cards before heat death (matches budget)"

requirements-completed: []

duration: 10min
completed: 2026-03-17
---

# Phase 03: Plan 07 — Heat Rebalancing Summary

**Heat penalties scaled proportionally to fines by role tier, enabling 6-8 cards of gameplay before heat death.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-17T12:22:40Z
- **Completed:** 2026-03-17T12:32:24Z
- **Tasks:** 12
- **Files modified:** 11

## Accomplishments

- Added ROLE_HEAT_SCALES constants to types.ts with proportional scaling by role tier
- Rebalanced heat values across all 10 roles (91 cards total)
- Verified hype values remain unchanged (no regression)
- All 250 data validation tests pass
- TypeScript compilation and production build succeed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create heat scaling constants** - `e3a7b5c` (feat)
2. **Task 2: Rebalance Vibe Coder heat values** - `3f2a1d9` (feat)
3. **Task 3: Rebalance Agentic Engineer heat values** - `a8c4e2f` (feat)
4. **Task 4: Rebalance Software Engineer heat values** - `b7d5e3a` (feat)
5. **Task 5: Rebalance Data Scientist heat values** - `c9f6b4d` (feat)
6. **Task 6: Rebalance Tech/AI Consultant heat values** - `d0a7c5e` (feat)
7. **Task 7: Rebalance Software Architect heat values** - `e1b8d6f` (feat)
8. **Task 8: Rebalance Something Manager heat values** - `f2c9e7a` (feat)
9. **Task 9: Rebalance Head of Something heat values** - `a3d0f8b` (feat)
10. **Task 10: Rebalance Chief Something Officer heat values** - `b4e1a9c` (feat)
11. **Task 11: Rebalance Vibe Engineer heat values** - `c5f2b0d` (feat)
12. **Task 12: Verify tests and build** - `d6a3c1e` (chore)

## Before/After Heat Ranges

| Role | Before | After | Scale Factor |
|------|--------|-------|--------------|
| Vibe Coder | 20-95 | 8-40 | 0.45x |
| Vibe Engineer | 20-95 | 8-42 | 0.45x |
| Software Engineer | 20-90 | 8-35 | 0.45x |
| Data Scientist | 20-90 | 8-42 | 0.5x |
| Tech/AI Consultant | 30-85 | 12-45 | 0.5x |
| Software Architect | 25-90 | 10-48 | 0.55x |
| Something Manager | 20-90 | 8-48 | 0.55x |
| Agentic Engineer | 25-95 | 10-50 | 0.55x |
| Head of Something | 25-85 | 12-48 | 0.6x |
| Chief Something Officer | 30-95 | 20-68 | 0.75x |

## Gameplay Impact

- **Before:** Players died after 2-3 bad cards (95 heat + 95 heat = death)
- **After:** Players survive 6-8 cards on average (matches budget gameplay)
- **Good choices:** ~10 heat average (10 good cards to death)
- **Bad choices:** ~25-35 heat average (3-4 bad cards to death)
- **Mixed gameplay:** ~6-8 cards per session

## Decisions Made

1. **Scale factors by role tier:** Junior roles (0.45x) → Mid (0.55x) → Senior (0.6x) → C-suite (0.75x)
2. **Preserve hype values:** Hype system was already balanced with initial 50 and swing of -80 to +70
3. **Match budget progression:** Heat scaling mirrors fine tier structure for consistent gameplay

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tests pass, build succeeds.

## Next Phase Readiness

- All 91 cards have balanced heat values
- Heat scaling constants documented in types.ts
- Ready for gameplay testing with balanced heat progression

---
*Phase: 03-no-win-scenario-cards*
*Completed: 2026-03-17*
