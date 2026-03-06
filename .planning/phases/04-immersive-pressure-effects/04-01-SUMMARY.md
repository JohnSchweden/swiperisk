---
phase: 04-immersive-pressure-effects
plan: 01
subsystem: game-logic
tags: [react, typescript, pressure, countdown, feedback-overlay]

# Dependency graph
requires:
  - phase: 02-new-role-set-impact-zones
    provides: RoleType, ROLE_CARDS, card decks
provides:
  - PRESSURE_SCENARIOS map keyed by card ID (urgent, countdown, team-impact)
  - useIncidentPressure hook for derived pressure state
  - Timer expiry auto-resolves to real outcome (no undo)
  - PressureCueController mount point for Phase 04-02/04-03
  - Team-impact text path in FeedbackOverlay
affects: [04-02, 04-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [pressure metadata separate from cards, countdown-as-final-decision]

key-files:
  created: [data/pressureScenarios.ts, hooks/useIncidentPressure.ts, components/game/PressureCueController.tsx]
  modified: [types.ts, data/index.ts, hooks/index.ts, components/game/index.ts, App.tsx, components/game/GameScreen.tsx, components/game/FeedbackOverlay.tsx]

key-decisions:
  - "Pressure metadata lives in dedicated map; cards remain unchanged"
  - "Timer expiry is a final decision path—no undo affordance"
  - "Only incidents explicitly marked urgent receive countdown"

patterns-established:
  - "Pressure state derived from live card + metrics, not hardcoded stage checks"
  - "Choice handling guarded by isChoiceLockedRef to prevent duplicates"

requirements-completed: []

# Metrics
duration: 25min
completed: 2026-03-06
---

# Phase 04 Plan 01: Pressure Metadata & Orchestration Summary

**Pressure metadata, useIncidentPressure hook, timer/undo orchestration, and PressureCueController mount point for immersive effects**

## Performance

- **Duration:** ~25 min
- **Tasks:** 2
- **Files modified:** 8 created/modified

## Accomplishments

- PRESSURE_SCENARIOS map with urgent cards (dev_1, fin_insider_bot, man_attention_track), countdown lengths, timeout resolution, team-impact copy
- useIncidentPressure hook deriving isUrgent, countdownSec, timeoutResolvesTo, isCritical, getTeamImpact from current card + heat
- Auto-resolve on countdown expiry into real left/right outcome; no undo path
- Duplicate choice prevention via isChoiceLockedRef
- FeedbackOverlay accepts optional teamImpact; PressureCueController mounted with live pressure props

## Task Commits

1. **Task 1: Add pressure metadata** — `c180b8a` (feat)
2. **Task 2: Wire pressure state, timer expiry, no-undo orchestration** — `feb2c16` (feat) + prior `eaba2d5` (useIncidentPressure, PressureCueController, FeedbackOverlay teamImpact)

## Files Created/Modified

- `types.ts` — PressureScenarioMetadata, PressureOutcomeMetadata
- `data/pressureScenarios.ts` — Map of card ID → urgency, countdown, team-impact
- `data/index.ts` — Export PRESSURE_SCENARIOS
- `hooks/useIncidentPressure.ts` — Derived pressure state hook
- `hooks/index.ts` — Export useIncidentPressure
- `components/game/PressureCueController.tsx` — Mount point for stress cues (placeholder)
- `components/game/index.ts` — Export PressureCueController
- `components/game/FeedbackOverlay.tsx` — Optional teamImpact prop + render
- `components/game/GameScreen.tsx` — countdownValue, isCountdownActive props; data-pressure-countdown for 04-02
- `App.tsx` — useIncidentPressure, useCountdown, handleTimerExpiry, isChoiceLockedRef, PressureCueController mount

## Decisions Made

- Urgent incidents: dev_1 (15s), fin_insider_bot (12s), man_attention_track (18s)
- Timeout resolves to configured direction (LEFT/RIGHT); no separate "timed out" state
- Countdown reset on card transition via currentCardId dependency

## Deviations from Plan

None — plan executed as written.

## Issues Encountered

**Swipe preview test flakiness:** 2 failures in `swipe preview text appears on drag` (desktop + mobile). Deferred to `.planning/phases/04-immersive-pressure-effects/deferred-items.md`. CardStack unchanged; likely pre-existing selector/timing sensitivity.

## Next Phase Readiness

- 04-02 can consume countdownValue, isCountdownActive from GameScreen and pressure props from PressureCueController
- 04-03 can use teamImpact path in FeedbackOverlay for audio/haptics escalation

## Self-Check: PASSED

- All created files exist: types.ts, data/pressureScenarios.ts, hooks/useIncidentPressure.ts, components/game/PressureCueController.tsx
- Task commits present: c180b8a, feb2c16

---
*Phase: 04-immersive-pressure-effects*
*Completed: 2026-03-06*
