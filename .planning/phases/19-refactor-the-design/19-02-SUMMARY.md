---
phase: 19-refactor-the-design
plan: "02"
subsystem: ui
tags: [debrief, visual-clutter, minimalism, tdd, playwright]

# Dependency graph
requires:
  - phase: 16
    provides: death vector system and explanation generation
  - phase: 17
    provides: shuffle-aware feedback and TTS system
provides:
  - DebriefPage1Collapse with stripped filler copy and constrained images
  - Playwright test confirming clutter removal
affects: debrief-ux, visual-consistency

# Tech tracking
tech-stack:
  added: []
  patterns: [subtractive-design, tdd-red-green, data-testid-for-testing]

key-files:
  created:
    - tests/debrief-page1-clutter.spec.ts
  modified:
    - components/game/debrief/DebriefPage1Collapse.tsx

key-decisions:
  - "Used TDD (red-green) cycle: wrote failing tests first, then implemented removals"
  - "Removed personality replay lines entirely — they were filler copy not matching minimalist design DNA"
  - "Constrained death/Kirk images to max-h-[220px] to prevent viewport overflow"
  - "Kept victory trophy animation (animate-pulse) — no competing image for victory case"

patterns-established:
  - "Subtractive design pattern: remove clutter by deleting unused constants, functions, and JSX blocks"
  - "data-testid attributes for Playwright targeting of component sections"

requirements-completed: [DESIGN-02]

# Metrics
duration: 12min
completed: 2026-03-28
---

# Phase 19 Plan 02: Debrief Page 1 Clutter Removal Summary

**Stripped filler copy (progressText, replay lines, double trophy) and constrained death/Kirk images to 220px max-height in DebriefPage1Collapse via TDD red-green cycle**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-28T23:46:22Z
- **Completed:** 2026-03-28T23:58:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Removed PERSONALITY_REPLAY_LINES constant, getPersonalityReplayLine function, progressText, replayLine, retryPrompt variables and all JSX references
- Added max-h-[220px] overflow-hidden to DeathEndingCard and Kirk image wrappers
- Removed second trophy icon from Unlocked Endings header, added data-testid="debrief-endings-box"
- All 3 Playwright tests pass confirming clean state
- Fixed pre-existing DebriefPage3Verdict.tsx missing unlockedEndingsCount destructure (Rule 3)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing Playwright test** - `aa4e32e` (test)
2. **Task 2: Strip filler copy and constrain images** - `9ff3e65` (feat)
3. **Task 3: Confirm Playwright test passes** - (verification only, no code changes)

**Plan metadata:** (pending)

_Note: Task 3 is verification-only — tests pass against Task 2 implementation_

## Files Created/Modified
- `components/game/debrief/DebriefPage1Collapse.tsx` - Removed filler copy, constrained images, cleaned up imports
- `tests/debrief-page1-clutter.spec.ts` - Playwright test verifying clutter removal (3 tests)

## Decisions Made
- Used TDD red-green cycle: wrote failing tests before implementation
- Kept victory trophy animation (animate-pulse) — no competing image in victory case, animation serves its purpose
- Removed unused imports (getRetryPrompt, PersonalityType) and variables (personality from state destructure)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed pre-existing merge conflict state in DebriefPage3Verdict.tsx**
- **Found during:** Task 1 (pre-commit hook blocked by typecheck failure)
- **Issue:** `unlockedEndingsCount` was in props interface but not destructured, causing type error. File had `UU` (unmerged) git status.
- **Fix:** Added `unlockedEndingsCount` to component destructure
- **Files modified:** components/game/debrief/DebriefPage3Verdict.tsx
- **Verification:** typecheck passes
- **Committed in:** Task 1 commit (bundled)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Pre-existing type error needed fixing to unblock commits. No scope creep.

## Issues Encountered
- Pre-commit hook ran typecheck on all files, revealing DebriefPage3Verdict.tsx had unresolved merge state — fixed by adding missing destructure

## Next Phase Readiness
- DebriefPage1Collapse is now clutter-free matching minimalist design DNA
- Remaining Phase 19 plans: DebriefPage2 reflection prompt removal, CardStack padding reduction, DebriefPage3 endings hint removal

---

*Phase: 19-refactor-the-design*
*Completed: 2026-03-28*
