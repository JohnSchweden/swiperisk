---
phase: 16-kobayashi-maru-ending-variety-system
plan: 01
subsystem: death-ending-system
tags: [death-vectors, card-outcomes, type-system, tdd]
dependency_graph:
  requires: []
  provides: [DeathVector-type, accumulateDeathVectors, determineDeathTypeFromVectors]
  affects: [death-type-resolution, card-outcome-schema]
tech_stack:
  added: []
  patterns: [optional-outcome-fields, vector-accumulation, archetype-affinity-tiebreaker]
key_files:
  created:
    - data/deathVectors.ts
    - unit/deathVectors.test.ts
  modified:
    - types.ts (added DeathVector, DeathVectorMap types)
    - data/index.ts (exported new functions)
decisions:
  - Death vectors are optional outcome fields (backward compatible with existing cards)
  - Archetype affinity is used only for tiebreaking when vectors have equal frequency
  - BANKRUPT and REPLACED_BY_SCRIPT always override vector-based logic
  - KIRK is excluded from vector resolution (easter egg gate, kirkCorruptionActive controls)
  - Legacy role-based death type determination preserved as fallback when vectors don't reach threshold (>=2)
metrics:
  duration: 25 minutes
  tasks_completed: 1
  files_created: 2
  files_modified: 2
  test_coverage: 13 tests covering accumulation, resolution, tie-breaking, fallback logic
  completion_date: 2026-03-25
---

# Phase 16 Plan 01: Death Vector Types and Accumulator - Summary

**TDD-driven implementation of death vector system foundation**

## What Was Built

This plan implemented the foundation for consequence-driven ending variety, replacing role-based-only death determination. The system allows card outcomes to declare which death type they push toward, accumulating patterns from player choices and resolving to the most-frequent death type.

### Key Components

**1. Type Definitions (types.ts)**
- Added optional `deathVector?: DeathType` field to Card outcome objects (onLeft/onRight)
- Created `DeathVectorMap` utility type: `Partial<Record<DeathType, number>>`
- Maintains backward compatibility: existing cards without vectors continue working

**2. Vector Accumulation (data/deathVectors.ts)**
- `accumulateDeathVectors(history, deck)` iterates through player choices and counts vector frequencies
- Gracefully handles missing cards and cards without vector hints
- Returns frequency map of death types pushed by player's choices

**3. Vector-Aware Death Determination (data/deathVectors.ts)**
- `determineDeathTypeFromVectors(vectorMap, budget, heat, hype, role, dominantArchetypeId)`
- Priority logic:
  1. BANKRUPT if budget <= 0 (always wins)
  2. REPLACED_BY_SCRIPT if heat >= 100 AND hype <= 10 (always wins)
  3. Highest-frequency vector with count >= 2 (vector-driven path)
  4. Archetype affinity tiebreaker when vectors are tied (SHADOW_ARCHITECT→PRISON, DISRUPTOR→CONGRESS, etc.)
  5. Fallback to legacy role-based death type determination

**4. Archetype Death Affinity (data/deathVectors.ts)**
- Maps 7 archetypes to their preferred death types:
  - SHADOW_ARCHITECT → PRISON
  - DISRUPTOR → CONGRESS
  - CONSERVATIVE → REPLACED_BY_SCRIPT
  - CHAOS_AGENT → FLED_COUNTRY
  - PRAGMATIST → BANKRUPT
  - BALANCED → AUDIT_FAILURE
  - KIRK → KIRK (never returned from vector logic)

### TDD Execution

**RED phase:** Created 13 comprehensive tests covering:
- Empty history returns empty map
- Single vector type counts correctly
- Mixed vectors accumulate properly
- Cards without vectors are skipped (backward compat)
- Unmatched card IDs are ignored
- Highest-frequency vector selected when count >= 2
- Tied vectors broken by archetype affinity
- Legacy fallback when no vector reaches threshold
- Budget/heat/hype override conditions
- KIRK excluded from vector logic

**GREEN phase:** Implemented all functions to pass tests (13/13 passing)

**REFACTOR phase:** No refactoring needed; code is clean and minimal

## Verification

✓ All 13 deathVectors tests pass
✓ All 19 gameReducer tests still pass (backward compatibility verified)
✓ TypeScript typecheck passes (no type errors)
✓ Biome linting passes (all style checks)
✓ Pre-commit hooks: all checks passed

## Output Artifacts

- **Commit:** `0777d72` — "feat(16-01): define death vector types and accumulator with TDD"
- **Files created:** 2 (deathVectors.ts, deathVectors.test.ts)
- **Files modified:** 2 (types.ts, data/index.ts)
- **Test coverage:** 13 tests, 100% pass rate

## Deviations from Plan

None — plan executed exactly as specified. TDD approach produced clean, well-tested code with full backward compatibility.

## Next Steps

Plan 16-02 will integrate vector-based death type resolution into the game state machine's death determination flow. Plans 16-03 and 16-04 add congressional hearing cards and debrief enhancements to complete the ending variety system.
