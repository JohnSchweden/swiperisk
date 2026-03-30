---
phase: 19-refactor-the-design
plan: 06
subsystem: ui
tags: [refactor, ux, feedback-overlay, debrief, card-stack, gap-closure]

requires:
  - phase: 19-refactor-the-design
    provides: Phase 19 subtractive cleanup (plans 01-05)
provides:
  - Restored micro-labels in FeedbackOverlay lesson+reference block
  - Reflection hint in DebriefPage2AuditTrail
  - Commented out placeholder incident images in CardStack
  - Simplified storyContext to unconditional render
affects: [game-ui, feedback, debrief, cards]

tech-stack:
  added: []
  patterns: [JSX comment-out for reversible removal, unconditional render replacing IIFE+guard]

key-files:
  created: []
  modified:
    - components/game/FeedbackOverlay.tsx
    - components/game/debrief/DebriefPage2AuditTrail.tsx
    - components/game/CardStack.tsx

key-decisions:
  - "Commented out incident images rather than deleting — kept getIncidentImagePath/slugify imports for preload logic, commented ImageWithFallback import instead"
  - "storyContext simplified from IIFE+hasCardImage guard to unconditional render since images are no longer shown"

patterns-established:
  - "Commented-out blocks include reason + phase reference in comment header"

requirements-completed: [DESIGN-01, DESIGN-03, DESIGN-04]

duration: 5min
completed: 2026-03-30
---

# Phase 19 Plan 06: UAT Gap Closure — Context Labels, Reflection Hint, Image Removal Summary

**Restored two micro-labels to FeedbackOverlay (amber "Team impact", cyan "Real Case:"), added a reflection hint to DebriefPage2, and commented out 152 identical placeholder incident images from CardStack decision cards with unconditional storyContext rendering.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-30T16:18:44Z
- **Completed:** 2026-03-30T16:23:38Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Restored minimal context labels in FeedbackOverlay lesson+reference block (amber Team impact, cyan Real Case)
- Added muted italic reflection hint between subtitle and audit log list in DebriefPage2AuditTrail
- Commented out incident image block in CardStack and simplified storyContext to unconditional render

## Task Commits

1. **Task 1: Restore minimal context labels in FeedbackOverlay** - `46b94c1` (refactor)
2. **Task 2: Add reflection hint to DebriefPage2AuditTrail** - `75cba06` (refactor)
3. **Task 3: Comment out incident images from CardStack** - `63ec634` (refactor)

## Files Created/Modified
- `components/game/FeedbackOverlay.tsx` — Two micro-label `<p>` elements inserted as first children of teamImpact and realWorldReference divs
- `components/game/debrief/DebriefPage2AuditTrail.tsx` — Hint paragraph inserted between subtitle and audit list section
- `components/game/CardStack.tsx` — Incident image JSX block commented out, storyContext IIFE simplified to unconditional render, ImageWithFallback import commented out

## Decisions Made
- Commented out incident images rather than deleting — reversible, preserves code for future use
- Kept getIncidentImagePath/slugify imports active (still used by preload useEffect for nextCard)
- Commented out ImageWithFallback import with phase reference note (now unused after image block removal)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered
- DebriefPage2AuditTrail initial edit dropped closing `</div>` for header div, causing typecheck error. Fixed by restoring the closing tag between the hint line and the audit log list section.

## Next Phase Readiness
- Gap closure complete. All three UAT findings addressed. Phase 19 design refactoring now fully verified.

---
*Phase: 19-refactor-the-design*
*Completed: 2026-03-30*
