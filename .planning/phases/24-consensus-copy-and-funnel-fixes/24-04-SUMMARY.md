---
phase: 24-consensus-copy-and-funnel-fixes
plan: "04"
subsystem: data-hygiene
tags: [en-dash, typography, tests, linkedin-share, death-endings]

# Dependency graph
requires:
  - phase: 24-consensus-copy-and-funnel-fixes
    provides: Copy updates from 24-02 (K-Maru branding)
provides:
  - En-dash year ranges throughout failureLessons.ts
  - Updated unit test expectations for new share text format
  - Updated Playwright PRISON heading matcher
affects:
  - 24-consensus-copy-and-funnel-fixes
  - CI test suite

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "En-dash (U+2013) for year ranges following editorial standards"
    - "Test expectations kept in sync with production copy"

key-files:
  created: []
  modified:
    - src/data/failureLessons.ts
    - unit/linkedin-share.test.ts
    - tests/image-collapse-page.spec.ts

key-decisions:
  - "Used en-dash (U+2013) not hyphen for all year ranges per editorial standard"
  - "Updated test assertions to match new K-Maru-first share text format"

patterns-established:
  - "Year ranges: Use en-dash (–) not hyphen (-) for date ranges"

requirements-completed:
  - HYGIENE-01
  - TEST-01
  - TEST-02

# Metrics
duration: 4min
completed: 2026-04-10T21:01:57Z
---

# Phase 24: Plan 04 — Data Hygiene and Test Alignment Summary

**Replaced 10 hyphenated year ranges with en-dashes and updated test expectations to match K-Maru branding**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-10T20:57:50Z
- **Completed:** 2026-04-10T21:01:57Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Replaced 10 hyphenated year ranges (2024-2025, etc.) with typographically correct en-dashes (2024–2025)
- Updated linkedin-share.test.ts expectations for new K-Maru-first share text format
- Updated image-collapse-page.spec.ts PRISON heading matcher to new title
- All 420 unit tests passing (including 13 linkedin-share tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: En-dash year ranges in failureLessons.ts** - `4f5be5c` (fix)
2. **Task 2: Update linkedin-share.test.ts and image-collapse-page.spec.ts** - `5e4a3b8` (test)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/data/failureLessons.ts` - Replaced 10 hyphenated year ranges with en-dashes
- `unit/linkedin-share.test.ts` - Updated test expectations for new K-Maru share text format, added em dash title test
- `tests/image-collapse-page.spec.ts` - Updated PRISON heading matcher to "Federal indictment (jumpsuit included)"

## Decisions Made
- Used en-dash (U+2013) not hyphen for year ranges following the editorial standard already used in IntroScreen
- Updated all test assertions to match the new share text format from 24-02 (K-Maru leads, Kobayashi energy secondary)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All unit tests pass (420 passed, 1 skipped). Smoke test failures for HoS critical card audio are pre-existing infrastructure issues unrelated to this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All data hygiene complete
- Tests aligned with production state
- Ready for Phase 24 continuation or next phase

---
*Phase: 24-consensus-copy-and-funnel-fixes*
*Completed: 2026-04-10*
