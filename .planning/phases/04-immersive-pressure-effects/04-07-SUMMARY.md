---
phase: 04-immersive-pressure-effects
plan: 07
subsystem: audio
tags: [pressure, audio, haptics, heat]

# Dependency graph
requires:
  - phase: 04-immersive-pressure-effects
    provides: "useIncidentPressure hook, pressureAudio service"
provides:
  - "isCritical = criticalFromScenario || heatHigh (no scenario gate)"
  - "GAIN_HEARTBEAT increased from 0.12 to 0.132"
affects: [gameplay, audio]

# Tech tracking
tech-stack:
  added: []
  patterns: [Web Audio API gain control]

key-files:
  created: []
  modified:
    - hooks/useIncidentPressure.ts
    - services/pressureAudio.ts

key-decisions:
  - "Changed isCritical logic to trigger on heat >= 70 regardless of pressure metadata presence"

patterns-established: []

requirements-completed: [IMMERSE-02, IMMERSE-03]

# Metrics
duration: 2 min
completed: 2026-03-08
---

# Phase 04 Plan 07: Card Stress and Heartbeat Gap Closure Summary

**Fixed card stress visuals to trigger when heat >= 70 without requiring pressure metadata; increased heartbeat volume 10%**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-08T19:57:56Z
- **Completed:** 2026-03-08T19:59:56Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Card stress effects (shake/flicker/pulse) now activate when heat >= 70, regardless of whether current card has pressure metadata
- Heartbeat volume increased 10% (0.12 → 0.132 gain)
- Fixed the gap where heat-based stress was gated behind scenario presence

## Task Commits

Each task was committed atomically:

1. **Task 1: isCritical includes heat without scenario gate** - `9cb6f16` (fix)
2. **Task 2: Heartbeat volume 10% louder** - `d989e40` (feat)

**Plan metadata:** (pending)

## Files Created/Modified
- `hooks/useIncidentPressure.ts` - Changed isCritical logic to include heat without scenario gate
- `services/pressureAudio.ts` - Increased GAIN_HEARTBEAT_STRESS from 0.12 to 0.132

## Decisions Made
- Changed isCritical = criticalFromScenario || (scenario != null && heatHigh) to criticalFromScenario || heatHigh to fix the gap where card stress only showed when card had pressure metadata

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0
**Impact on plan:** None - fixes applied as specified

## Issues Encountered
- None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Gap closure complete for card stress and heartbeat
- Ready for further testing/verification
