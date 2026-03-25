---
phase: 13-image-asset-pipeline
plan: 05
subsystem: image-asset-pipeline
tags: [typescript, image-generation, labels, hos-cards]

# Dependency graph
requires:
  - phase: 13-03
    provides: Contract compliance and per-incident outcome model
  - phase: 13-04
    provides: Label-based outcome architecture
provides:
  - Single slug generation using actual decision labels from card data
  - Label-based outcome keys (shield-the-team, give-names-to-compliance)
  - Deduplication for incidents appearing in multiple cards
affects:
  - scripts/generate-images.ts

tech-stack:
  added: []
  patterns:
    - "Extract outcomes by label from HOS card data"
    - "Deduplicate using Map with labelSlug as key"

key-files:
  created: []
  modified:
    - scripts/generate-images.ts

key-decisions:
  - "Use Map with labelSlug key for deduplication when same incident appears in multiple cards"

patterns-established:
  - "Label-based outcome generation: Extract actual choice labels from card data instead of hardcoded directions"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-03-25
---

# Phase 13 Plan 05: Fix Single Slug Generation to Use Labels Summary

**Single slug generation now uses actual decision labels (e.g., "shield-the-team") instead of swipe directions ("left"/"right") from HOS card data**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-25T19:30:00Z
- **Completed:** 2026-03-25T19:45:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added `_extractOutcomesForIncident()` helper function that extracts outcomes from HOS cards using actual choice labels
- Updated single slug case to iterate over extracted outcomes with label-based slugs
- Replaced hardcoded "left"/"right" direction-based generation with label-based generation
- Implemented deduplication using Map with labelSlug as key (handles same incident in multiple cards)
- Outcome prompts now include actual choice labels and card-specific lessons

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix single slug outcome generation to use labels** - `1dbe23c` (feat)

**Plan metadata:** `docs(13-05): complete single-slug-label-fix plan`

## Files Created/Modified

- `scripts/generate-images.ts` - Added `_extractOutcomesForIncident()` function and updated single slug case to use label-based outcomes

## Decisions Made

- Used Map with labelSlug as key for deduplication to handle cases where the same incident appears in multiple HOS cards (e.g., "Samsung ChatGPT Code Leak" appears in both hos_shadow_ai_team_discovery and shadow_ai_hos_1)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Initial implementation returned duplicate outcomes because "Samsung ChatGPT Code Leak" incident appears in two different HOS cards. Fixed by using Map with labelSlug as key for deduplication.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Single slug generation now correctly produces label-based outcome files
- Ready for image generation with proper naming convention
- No blockers

---
*Phase: 13-image-asset-pipeline*
*Completed: 2026-03-25*
