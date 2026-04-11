---
phase: 26-preload-outcome-ending-assets
plan: "02"
subsystem: ui
tags:
  - loading
  - performance
  - images
requires:
  - 26-01 (preloadAsset utility)
provides:
  - ImageWithFallback loading prop
  - eager loading for above-fold images
affects:
  - src/components/ImageWithFallback.tsx
  - src/components/game/FeedbackOverlay.tsx
  - src/components/game/debrief/DebriefPage1Collapse.tsx
  - src/components/game/debrief/DebriefPage3Verdict.tsx
tech-stack:
  added: []
  patterns:
    - Native img loading attribute
    - Above-the-fold eager loading
key-files:
  created: []
  modified:
    - src/components/ImageWithFallback.tsx
    - src/components/game/FeedbackOverlay.tsx
    - src/components/game/debrief/DebriefPage1Collapse.tsx
    - src/components/game/debrief/DebriefPage3Verdict.tsx
decisions: []
metrics:
  duration: 10
  completed: "2026-04-11"
---

# Phase 26 Plan 02: ImageWithFallback Eager Loading — Summary

## What Was Built

Extended ImageWithFallback component with an optional `loading` prop and applied `loading="eager"` to all above-the-fold overlay and debrief images to eliminate the placeholder flash independent of preloading.

### Key Components

1. **ImageWithFallback loading prop** (`src/components/ImageWithFallback.tsx`)
   - Added optional `loading?: "lazy" | "eager"` to interface
   - Default value: `"lazy"` (browser default behavior)
   - Applied only to `<img>` elements (video has no loading attribute)

2. **FeedbackOverlay outcome meme** (`src/components/game/FeedbackOverlay.tsx`)
   - Added `loading="eager"` to outcome image
   - Shown immediately in overlay after swipe

3. **DebriefPage1Collapse death GIFs** (`src/components/game/debrief/DebriefPage1Collapse.tsx`)
   - Added `loading="eager"` to DeathEndingCard component
   - Added `loading="eager"` to Kirk GIF rendering

4. **DebriefPage3Verdict archetype GIF** (`src/components/game/debrief/DebriefPage3Verdict.tsx`)
   - Added `loading="eager"` to archetype badge image

## Commits

| Commit | Message | Files |
|--------|---------|-------|
| ee99434 | feat(26-02): add loading prop to ImageWithFallback | src/components/ImageWithFallback.tsx |
| 0fdc181 | feat(26-02): apply loading=eager to overlay and debrief images | FeedbackOverlay.tsx, DebriefPage1Collapse.tsx, DebriefPage3Verdict.tsx |

## Verification

- ✅ TypeScript: Zero errors (`bun run typecheck`)
- ✅ Lint: Clean (`bun run lint`)
- ✅ Smoke tests: 170 passed
- ✅ Grep confirms 4 `loading="eager"` usages across 3 files

## Call Sites Updated

| File | Component | Image Type |
|------|-----------|------------|
| FeedbackOverlay.tsx | Outcome meme | WebP |
| DebriefPage1Collapse.tsx | Death GIF (regular) | MP4 |
| DebriefPage1Collapse.tsx | Death GIF (Kirk) | MP4 |
| DebriefPage3Verdict.tsx | Archetype GIF | MP4 |

## Architecture

```
ImageWithFallback
├── loading="lazy" (default) ──> most images
└── loading="eager" ───────────> above-fold critical images
         ├── FeedbackOverlay outcome
         ├── DebriefPage1 death GIF
         ├── DebriefPage1 Kirk GIF
         └── DebriefPage3 archetype GIF
```

## Impact

- Browser no longer defers loading of overlay and debrief images
- Images load immediately when component mounts
- Works in conjunction with preload system (Plan 26-01) for maximum performance
- Video elements unchanged (no valid loading attribute)
- Victory image remains lazy (out of scope, deferred per plan)

## Deviations from Plan

None — plan executed exactly as written.
