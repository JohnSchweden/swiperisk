---
phase: 19-refactor-the-design
plan: "12"
subsystem: ui
tags: [debrief, endings, kirk, victory, consistency, failure-lessons]

# Dependency graph
requires:
  - phase: 16-kobayashi-maru-ending-variety
    provides: DeathType.KIRK, deathVectorMap, generateDeathExplanation, FAILURE_LESSONS
  - phase: 14-situational-outcome-imagery
    provides: getDeathImagePath, ImageWithFallback
provides:
  - Kirk ending now has explanation + FailureLessonCard blocks matching death ending structure
  - Victory ending has "Why you survived" explanation block
  - KIRK added to FAILURE_LESSONS, DEATH_EXPLANATIONS, and RETRY_PROMPTS data
affects: debrief, endings, data/failureLessons

# Tech tracking
tech-stack:
  added: []
  patterns: [all DeathType variants now have failure lesson data — no more Exclude<KIRK>]

key-files:
  modified:
    - components/game/debrief/DebriefPage1Collapse.tsx
    - data/failureLessons.ts
  created: []

key-decisions:
  - "Kirk gets its own FAILURE_LESSONS, DEATH_EXPLANATIONS, and RETRY_PROMPTS entries — easter egg ending deserves educational content like all other endings"
  - "Victory gets a static 'Why you survived' explanation block — no image (none in imageMap) and no FailureLessonCard (victory is success, not failure)"
  - "Widened LessonDeathType from Exclude<DeathType, KIRK> to DeathType — all ending types now have complete data"

patterns-established:
  - "All DeathType variants have failure lesson data: FAILURE_LESSONS, DEATH_EXPLANATIONS, RETRY_PROMPTS"
  - "Victory (deathType=null) gets static explanation content, not death-vector-based"

requirements-completed: [DESIGN-01]

# Metrics
duration: 3min
completed: 2026-03-30
---

# Phase 19 Plan 12: Kirk and Victory Ending Consistency Summary

**Added missing explanation and lesson blocks to Kirk and Victory endings so all ending types share the same debrief structure**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-30T20:57:05Z
- **Completed:** 2026-03-30T21:00:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Kirk ending now shows "Why this ending" explanation + FailureLessonCard after the image, matching regular death ending structure
- Victory ending now shows "Why you survived" explanation block after the description
- KIRK added to all failure lesson data (FAILURE_LESSONS, DEATH_EXPLANATIONS, RETRY_PROMPTS) — 3 new easter-egg-specific lessons
- Removed `Exclude<DeathType, KIRK>` type narrowing — all DeathType variants now have complete data

## Task Commits

1. **Task 1: Add missing blocks to Kirk ending** - `aa07ccf` (feat)
2. **Task 2: Add image and missing blocks to Victory ending** - `f92d5f3` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `data/failureLessons.ts` — Added KIRK to FAILURE_LESSONS (3 lessons), DEATH_EXPLANATIONS, RETRY_PROMPTS; widened LessonDeathType to DeathType
- `components/game/debrief/DebriefPage1Collapse.tsx` — Widened getRandomLesson to accept DeathType; changed explanation/lesson computation to use deathType instead of regularDeathType; added victory explanation block

## Decisions Made
- Kirk gets full failure lesson data (not skipped) — the easter egg ending is educational like all others
- Victory gets explanation only — no image (none exists in imageMap) and no FailureLessonCard (victory is success, not failure)
- Widened type from Exclude<KIRK> to full DeathType — cleaner data model, no more special-case exclusions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All ending types now have consistent debrief structure
- Kirk/Victory/Death endings share the same explanation + lesson pattern
- Ready for next gap closure or refactoring plan

---
*Phase: 19-refactor-the-design*
*Completed: 2026-03-30*
