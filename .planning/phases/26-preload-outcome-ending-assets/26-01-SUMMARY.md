---
phase: 26-preload-outcome-ending-assets
plan: "01"
subsystem: assets
tags:
  - preload
  - performance
  - assets
requires: []
provides:
  - preloadAsset utility
  - outcome image preloading
  - death GIF preloading
  - archetype GIF preloading
affects:
  - src/utils/preload.ts
  - src/components/game/CardStack.tsx
  - src/App.tsx
tech-stack:
  added: []
  patterns:
    - "<link rel=preload> injection"
    - useEffect cleanup pattern
key-files:
  created:
    - src/utils/preload.ts
  modified:
    - src/components/game/CardStack.tsx
    - src/App.tsx
decisions: []
metrics:
  duration: 15
  completed: "2026-04-11"
---

# Phase 26 Plan 01: Preload Outcome & Ending Assets — Summary

## What Was Built

A shared asset preloading system that eliminates the 1–2s placeholder flash for outcome memes, death GIFs, and archetype GIFs by preloading assets before they are displayed.

### Key Components

1. **preloadAsset utility** (`src/utils/preload.ts`)
   - Injects `<link rel="preload">` tags into document head
   - Returns cleanup function to remove stale preload hints
   - Handles undefined href gracefully with no-op
   - Supports both "image" and "video" asset types

2. **CardStack outcome preloading** (`src/components/game/CardStack.tsx`)
   - Preloads both left and right outcome WebP images when current card changes
   - Uses `getOutcomeImagePath()` with slugified incident and label
   - Cleanup removes preload links on card change

3. **App.tsx death/archetype preloading** (`src/App.tsx`)
   - Preloads death GIF when `state.deathType` becomes non-null
   - Preloads archetype GIF when `debrief.archetype` is computed
   - Both use video preloading for MP4 assets

## Commits

| Commit | Message | Files |
|--------|---------|-------|
| 0d002f5 | feat(26-01): create preloadAsset utility for asset preloading | src/utils/preload.ts |
| 5a04321 | feat(26-01): preload outcome images in CardStack | src/components/game/CardStack.tsx |
| 59a3c22 | feat(26-01): preload death and archetype GIFs in App.tsx | src/App.tsx |

## Verification

- ✅ TypeScript: Zero errors (`bun run typecheck`)
- ✅ Lint: Clean (`bun run lint`)
- ✅ Smoke tests: 170 passed

## Architecture

```
CardStack.tsx ──> preloadAsset() ──> <link rel="preload" as="image">
     │                                        │
     └──── getOutcomeImagePath()              │
                                              ▼
App.tsx ─────────> preloadAsset() ──> <link rel="preload" as="video">
     │
     ├──── getDeathGifPath()
     └──── getArchetypeGifPath()
```

## Impact

- Outcome images preload while card is on screen (before user swipes)
- Death GIFs preload as soon as death type is resolved
- Archetype GIFs preload once computed
- No stale `<link>` accumulation thanks to cleanup functions
- Eliminates visual placeholder flash on image display

## Deviations from Plan

None — plan executed exactly as written.
