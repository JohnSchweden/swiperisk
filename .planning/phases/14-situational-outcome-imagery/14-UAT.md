---
status: diagnosed
phase: 14-situational-outcome-imagery
source:
  - 14-01-SUMMARY.md
  - 14-03-SUMMARY.md
  - 14-04-SUMMARY.md
  - 14-05-SUMMARY.md
started: 2026-03-27T12:00:00Z
updated: 2026-03-27T12:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. ImageWithFallback Renders with Glitch Placeholder
expected: Image component displays glitch placeholder (dark gradient with cyan icon and scanline animation) while image loads or on error
result: issue
reported: "Test image-fallback.spec.ts test 'a) Glitch placeholder shown while image loads' fails: placeholder icon 'i.fa-solid.fa-image' not found on intro screen. Tests b), c), d) pass. Root cause: test runs on intro screen where no ImageWithFallback components exist. Also, image-transitions.spec.ts and image-cls.spec.ts use HTTP instead of HTTPS (http://localhost:3000 vs https://localhost:3000) causing all 4 tests to fail with net::ERR_EMPTY_RESPONSE."
severity: minor

### 2. Incident Cards Display Images (HOS Role)
expected: HOS incident card shows 16:9 image above the card text, image loads lazily with smooth fade-in
result: pass
reported: "ImageWithFallback component exists with correct implementation (native lazy loading, decode() API, glitch placeholder, 300ms fade-in). Component used in CardStack for incident images. Verified via code inspection."

### 3. Outcome Overlay Shows Images
expected: Feedback overlay (win/lose screens) displays situational image with matching aspect ratio, fades in smoothly
result: pass
reported: "FeedbackOverlay width matches CardStack (max-w-full lg:max-w-[43rem]). ImageWithFallback used in overlay. Verified via code inspection."

### 4. Debrief Collapse Page Shows Death Images
expected: Game Over page displays full-width death-type-specific image above the death icon (7 death types supported)
result: issue
reported: "DebriefContainer component (lines 41-43) returns null for DEBRIEF_PAGE_1 case. DebriefPage1Collapse exists and is exported from components/game/index.ts but is NOT imported or rendered in DebriefContainer.tsx. The switch statement only handles DEBRIEF_PAGE_2 and DEBRIEF_PAGE_3. All image-collapse-page.spec.ts tests fail because DEBRIEF_PAGE_1 renders nothing. This is a missing wiring bug."
severity: major

### 5. Debrief Verdict Page Shows Archetype Badge
expected: Verdict page shows 1:1 archetype badge image centered above archetype name (7 archetypes supported)
result: pass
reported: "DebriefPage3Verdict component properly renders with ImageWithFallback and getArchetypeImagePath. Component is correctly imported and rendered in DebriefContainer for DEBRIEF_PAGE_3. Verified via code inspection."

### 6. KIRK Collapse Image Renders
expected: KIRK death type shows specific glitch-style collapse image on game over page (easter egg)
result: issue
reported: "Same root cause as test 4: DebriefPage1Collapse is never rendered because DebriefContainer returns null for DEBRIEF_PAGE_1. The KIRK-specific image block in DebriefPage1Collapse (lines 286-294) can never execute."
severity: major

### 7. KIRK Archetype Badge Renders
expected: KIRK archetype shows kirk.webp glitch image on verdict page (easter egg)
result: pass
reported: "DebriefPage3Verdict handles KIRK archetype with specific styling. Component is correctly rendered in DebriefContainer. Verified via code inspection."

### 8. Images Lazy Load and Decode Smoothly
expected: Images use native lazy loading, decode before showing to prevent jank, fade in over 300ms
result: pass
reported: "ImageWithFallback.tsx verified: loading='lazy' on img element (line 117), handleLoad uses img.decode() API (lines 49-62), transition-opacity duration-300 classes applied. CSS glitch-placeholder class used. Verified via code inspection."

## Summary

total: 8
passed: 5
issues: 3
pending: 0
skipped: 0

## Gaps

- truth: "Debrief collapse page (DEBRIEF_PAGE_1) shows death-type-specific images"
  status: failed
  reason: "DebriefContainer component returns null for DEBRIEF_PAGE_1 stage. DebriefPage1Collapse exists and is exported but is NOT imported or rendered in DebriefContainer.tsx. The switch statement only handles DEBRIEF_PAGE_2 and DEBRIEF_PAGE_3."
  severity: major
  test: 4
  root_cause: "Missing import and case handler in DebriefContainer.tsx for DEBRIEF_PAGE_1"
  artifacts:
    - path: "components/game/debrief/DebriefContainer.tsx"
      issue: "Missing import of DebriefPage1Collapse and missing case handler for DEBRIEF_PAGE_1"
  missing:
    - "Import DebriefPage1Collapse in DebriefContainer.tsx"
    - "Add case GameStage.DEBRIEF_PAGE_1: return <DebriefPage1Collapse ... />"

- truth: "KIRK death type shows collapse image on game over page"
  status: failed
  reason: "Same root cause as DEBRIEF_PAGE_1: component never renders because DebriefContainer returns null for this stage"
  severity: major
  test: 6
  root_cause: "DebriefContainer.tsx missing DEBRIEF_PAGE_1 case handler (same as above)"
  artifacts:
    - path: "components/game/debrief/DebriefContainer.tsx"
      issue: "Missing DEBRIEF_PAGE_1 case handler"
  missing:
    - "Import DebriefPage1Collapse in DebriefContainer.tsx"
    - "Add case GameStage.DEBRIEF_PAGE_1: return <DebriefPage1Collapse ... />"

- truth: "Image test files use correct HTTPS protocol"
  status: failed
  reason: "tests/image-transitions.spec.ts and tests/image-cls.spec.ts use http://localhost:3000 instead of https://localhost:3000, causing all 8 tests to fail with net::ERR_EMPTY_RESPONSE"
  severity: minor
  test: 1
  root_cause: "Tests use hardcoded http://localhost:3000 URL instead of https://localhost:3000. Dev server uses HTTPS."
  artifacts:
    - path: "tests/image-transitions.spec.ts"
      issue: "Uses http://localhost:3000 on line 5 instead of https://localhost:3000"
    - path: "tests/image-cls.spec.ts"
      issue: "Uses http://localhost:3000 on line 5 instead of https://localhost:3000"
  missing:
    - "Change http://localhost:3000 to https://localhost:3000 in both test files"

## Diagnosis Summary

**Root Cause 1 - Missing DEBRIEF_PAGE_1 wiring (MAJOR):**
The `DebriefContainer` component in `components/game/debrief/DebriefContainer.tsx` only handles `DEBRIEF_PAGE_2` and `DEBRIEF_PAGE_3`. The `DEBRIEF_PAGE_1` case falls through to `default: return null`. The `DebriefPage1Collapse` component exists and is exported but is never imported or rendered.

**Fix:** Add import and case handler in DebriefContainer.tsx:
```tsx
import { DebriefPage1Collapse } from "./DebriefPage1Collapse";

case GameStage.DEBRIEF_PAGE_1:
  return <DebriefPage1Collapse state={state} onNext={onNextPage} />;
```

**Root Cause 2 - Test HTTP/HTTPS mismatch (MINOR):**
`tests/image-transitions.spec.ts` and `tests/image-cls.spec.ts` use `http://localhost:3000` but the dev server runs on `https://localhost:3000`.

**Fix:** Change both files to use `https://localhost:3000`.