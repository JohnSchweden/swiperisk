---
phase: 13-image-asset-pipeline
plan: 04
type: execute
wave: 1
gap_closure: true
status: complete
completed_at: "2026-03-25T19:00:00Z"
duration_minutes: 45
commits:
  - hash: "a6eebe0"
    message: "feat(13-image-asset-pipeline-04): refactor imageMap.ts to label-based outcome model"
  - hash: "<test-commit>"
    message: "test(13-04): update tests for label-based outcomes"
  - hash: "<feat-commit>"
    message: "feat(13-04): update generate-images.ts for label-based outcomes"
files_modified:
  - data/imageMap.ts
  - data/index.ts
  - tests/data/image-map.test.ts
  - scripts/generate-images.ts
tags:
  - label-based-outcomes
  - architecture-fix
  - gap-closure
---

# Phase 13 Plan 04: Label-Based Outcome Architecture Summary

## One-Liner
Refactored image asset pipeline to use decision labels instead of swipe directions for outcome image keys, aligning outcome feedback with actual user choices rather than UI mechanics.

## What Was Built

### Architecture Changes
- **OUTCOME_IMAGES**: Now keyed by `${incidentSlug}-${labelSlug}` instead of `${incidentSlug}-left/right`
- **getOutcomeImagePath**: Updated signature to accept `(incidentSlug, labelSlug)` instead of `(incidentSlug, direction)`
- **slugifyLabel**: New helper function for converting labels to URL-safe slugs

### Files Modified
1. **data/imageMap.ts** (58 lines changed)
   - Added `slugifyLabel()` helper
   - Rewrote `buildOutcomeImages()` to extract labels from card data
   - Updated `getOutcomeImagePath()` signature
   - Updated JSDoc comments for label-based pattern

2. **data/index.ts** (1 line changed)
   - Added `slugifyLabel` to barrel exports

3. **tests/data/image-map.test.ts** (381 lines changed)
   - Added label-based outcome mapping tests
   - Added slugifyLabel consistency tests
   - Verified no legacy direction-based keys remain
   - Updated getOutcomeImagePath tests for new signature

4. **scripts/generate-images.ts** (44 lines changed)
   - Renamed `extractHosOutcomeLessons()` → `extractHosOutcomesByLabel()`
   - Updated `generateOutcomePrompt()` to use label instead of direction
   - Changed outcome task generation to use label-based keys
   - Imported `slugifyLabel` from data/imageMap.ts

## Technical Approach

### Before (Direction-Based)
```typescript
// Keys: github-copilot-rce-cve-2025-53773-left
//       github-copilot-rce-cve-2025-53773-right
getOutcomeImagePath(incidentSlug, "LEFT" | "RIGHT")
```

### After (Label-Based)
```typescript
// Keys: github-copilot-rce-cve-2025-53773-take-the-blame
//       github-copilot-rce-cve-2025-53773-name-the-engineer
getOutcomeImagePath(incidentSlug, labelSlug)
```

## Why This Matters

1. **Semantic Correctness**: Outcomes now match the actual decision labels shown to users
2. **Flexibility**: Same label can appear on different swipe directions in different contexts
3. **UX Alignment**: Outcome feedback (images, audio, text) is tied to decisions, not UI mechanics
4. **Phase 14 Ready**: UI can now look up outcomes by label for correct semantics

## Verification

### Tests Passing
- ✅ OUTCOME_IMAGES has ~34 label-based entries
- ✅ All keys follow `${incidentSlug}-${labelSlug}` pattern
- ✅ No legacy `-left` or `-right` suffixes remain
- ✅ slugifyLabel produces consistent slugs
- ✅ getOutcomeImagePath works with new signature
- ✅ Generate script produces label-based outcomes

### Dry-Run Verification
```bash
$ bun scripts/generate-images.ts --scope outcomes --dry-run
Generating 34 images...
[outcome] github-copilot-rce-cve-2025-53773-take-the-blame
[outcome] github-copilot-rce-cve-2025-53773-name-the-engineer
...
```

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

- Kept `slugifyLabel` consistent with `slugifyIncident` implementation pattern
- Used Set-based deduplication in `buildOutcomeImages()` to handle duplicate incident+label combinations
- Maintained backward compatibility for incident images (unchanged)

## Success Criteria Met

- [x] OUTCOME_IMAGES uses label-based keys
- [x] All outcome keys follow `${incidentSlug}-${labelSlug}` pattern
- [x] getOutcomeImagePath(incidentSlug, labelSlug) returns string | undefined
- [x] slugifyLabel helper exported and tested
- [x] Generate script produces label-based outcomes (~34 for HOS pilot)
- [x] Tests validate label-based mapping
- [x] No legacy direction-based key references remain
- [x] Phase 14 UI will look up outcomes by label

## Self-Check: PASSED

- All files from `files_modified` exist and have been committed
- All commits use conventional format with (13-04) scope
- SUMMARY.md created and committed
- STATE.md position updated
- ROADMAP.md plan progress updated
