---
phase: 24-consensus-copy-and-funnel-fixes
plan: "02"
subsystem: ui
tags: [share, linkedin, kirk, brand, copy, k-maru]

requires:
  - phase: 24-consensus-copy-and-funnel-fixes
    provides: publicGameUrl helper from 24-01

provides:
  - K-Maru-first share text in formatShareText
  - Em dash title in getShareUrl
  - Dynamic URL in KIRK_SHARE_TEXT via getPublicGameUrl()
  - Concise ogDesc without Kobayashi Maru
  - Ghost style V2 DM button
  - LinkedIn share helper hint

affects: []

tech-stack:
  added: []
  patterns: [brand spine unification, template literals for dynamic URLs]

key-files:
  created: []
  modified:
    - src/utils/linkedin-share.ts
    - src/components/game/debrief/DebriefPage3Verdict.tsx

key-decisions:
  - "K-Maru leads brand voice everywhere, Kobayashi Maru is secondary/optional"
  - "Em dash (—) used instead of hyphen (-) for cleaner typography"
  - "V2 button demoted to ghost style to reduce visual competition with primary CTAs"
  - "Helper hint explains LinkedIn preview behavior to reduce user confusion"

patterns-established:
  - "Brand spine hierarchy: K-Maru > Kobayashi Maru > no-win simulation"
  - "Dynamic URL resolution via getPublicGameUrl() for environment flexibility"

requirements-completed:
  - BRAND-01
  - SHARE-01

# Metrics
duration: 2min
completed: 2026-04-10
---

# Phase 24 Plan 02: Brand Spine and Share Text Unification Summary

**K-Maru-first share copy, em dash typography, dynamic URL resolution, and V2 button demotion to ghost style**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-10T20:48:16Z
- **Completed:** 2026-04-10T20:50:52Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Updated formatShareText to K-Maru-first body copy with concise resilience line
- Fixed getShareUrl title to use em dash without "Archetype" suffix
- Replaced hardcoded URL in KIRK_SHARE_TEXT with getPublicGameUrl() helper
- Updated ogTitle to use em dash and lowercase "resilience"
- Simplified ogDesc to concise brag copy without "Kobayashi Maru" mention
- Added LinkedIn share helper hint explaining preview behavior
- Demoted V2 DM button from filled cyan to ghost/secondary style

## Task Commits

Each task was committed atomically:

1. **Task 1: Update linkedin-share.ts formatShareText and getShareUrl** - `5efa8f0` (fix)
2. **Task 2: Update DebriefPage3Verdict — KIRK text, meta tags, hint, V2 button** - `04a06f7` (fix)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `src/utils/linkedin-share.ts` - Updated formatShareText body and getShareUrl title to K-Maru-first copy
- `src/components/game/debrief/DebriefPage3Verdict.tsx` - Added getPublicGameUrl import, updated KIRK_SHARE_TEXT, fixed ogTitle/ogDesc, added helper hint, demoted V2 button

## Decisions Made

- K-Maru leads brand voice everywhere; Kobayashi Maru is secondary/optional (only appears in parentheses as "Kobayashi energy")
- Em dash (—) used instead of hyphen (-) for cleaner, more professional typography
- V2 button demoted to ghost style (border + transparent bg) to reduce visual competition with primary sharing CTAs
- Helper hint added to explain LinkedIn preview behavior — users should copy text first since LinkedIn shows static site preview

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Brand spine unification complete across all share surfaces
- Ready for Phase 24-03 or next phase in consensus copy series
- All share text now consistent with K-Maru-first voice

---
*Phase: 24-consensus-copy-and-funnel-fixes*
*Completed: 2026-04-10*
