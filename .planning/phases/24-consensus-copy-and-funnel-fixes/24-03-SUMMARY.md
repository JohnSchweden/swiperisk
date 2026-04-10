---
phase: 24-consensus-copy-and-funnel-fixes
plan: "03"
subsystem: ui
tags: [copy, debrief, intro, personality, funnel]

requires:
  - phase: 24-01
    provides: Copy voice patterns established

provides:
  - Cynical-literate victory copy in DebriefPage1
  - Pedagogical card order (lesson before explanation) for non-Kirk deaths
  - Intro blurb for audit trail page
  - Updated amber reflection line
  - PersonalitySelect bridge line about narrator accents
  - Team Mode copy-link button in IntroScreen

affects:
  - Debrief flow UX
  - IntroScreen Team Mode engagement

tech-stack:
  added: []
  patterns:
    - JSX conditional rendering for card order
    - navigator.clipboard API for copy functionality

key-files:
  created: []
  modified:
    - src/components/game/debrief/DebriefPage1Collapse.tsx
    - src/components/game/debrief/DebriefPage2AuditTrail.tsx
    - src/components/game/PersonalitySelect.tsx
    - src/components/game/IntroScreen.tsx

key-decisions:
  - Non-Kirk death path renders FailureLessonCard before ExplanationCard for pedagogical anchor
  - Kirk path retains original order (explanation before lesson) to preserve break-character flow
  - Team Mode gets actionable copy-link button to increase sharing

requirements-completed:
  - DEBRIEF-01
  - DEBRIEF-02
  - DEBRIEF-03
  - INTRO-01
  - PERSONALITY-01

duration: 3min
completed: 2026-04-10
---

# Phase 24 Plan 03: Consensus Copy and Funnel Fixes Summary

**Applied cynical-literate register across debrief pages, swapped card order for pedagogical clarity, and added actionable Team Mode copy-link button.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-10T20:52:34Z
- **Completed:** 2026-04-10T20:55:40Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Victory copy now uses cynical-literate voice ("uneasy truce", "still legal") matching IntroScreen register
- Non-Kirk debrief path shows lesson card before explanation (pedagogical anchor pattern)
- DebriefPage2 introduces audit log with paper-trail framing
- PersonalitySelect clarifies narrator accent / US satire mismatch for players
- Team Mode section has functional copy-link button with proper data-testid

## Task Commits

1. **Task 1: DebriefPage1Collapse victory copy + non-Kirk card order swap** - `f2125e9` (fix)
2. **Task 2: DebriefPage2, PersonalitySelect, IntroScreen copy updates** - `1cd3249` (fix)

**Plan metadata:** `TBD` (docs: complete plan)

## Files Created/Modified

- `src/components/game/debrief/DebriefPage1Collapse.tsx` - Victory copy with cynical register; restructured card order
- `src/components/game/debrief/DebriefPage2AuditTrail.tsx` - Intro blurb for audit trail; updated amber reflection line
- `src/components/game/PersonalitySelect.tsx` - Bridge line about narrator accents
- `src/components/game/IntroScreen.tsx` - Copy game link button in Team Mode section

## Decisions Made

- Non-Kirk death path: lesson before explanation (pedagogical anchor)
- Kirk path: kept original order (explanation before lesson) to maintain break-character narrative flow
- Added comments documenting the card order rule for future maintainers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Copy voice now consistent across all debrief pages
- Ready for remaining Phase 24 plans (funnel fixes, OG meta, etc.)

---
*Phase: 24-consensus-copy-and-funnel-fixes*
*Completed: 2026-04-10*
