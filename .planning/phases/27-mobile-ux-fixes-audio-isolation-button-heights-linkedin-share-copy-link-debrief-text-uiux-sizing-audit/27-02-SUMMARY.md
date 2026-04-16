---
phase: 27-mobile-ux-fixes-audio-isolation-button-heights-linkedin-share-copy-link-debrief-text-uiux-sizing-audit
plan: 02
type: execute
subsystem: Debrief page polish (button heights, LinkedIn, copy)
tags: [mobile-ux, wcag, button-heights, linkedin-share, copy-edits]
status: complete
duration: ~12 minutes
completed_date: 2026-04-17
key_decisions:
  - Button heights standardized to 44px mobile (iOS HIG), 48px desktop (WCAG 2.5.5)
  - LinkedIn share converted to button with onClick handler for native app on mobile
  - Em dashes replaced with colons for cleaner typography in debrief pages
tech_stack:
  added: []
  patterns: [Mobile-First Touch Targets, Web Share API with Fallback, Typography Cleanup]
dependencies:
  requires: [openLinkedInShare utility already exists in src/utils/linkedin-share.ts]
  provides: [Accessible debrief pages with proper button heights and in-app mobile sharing]
  affects: [DebriefPage3Verdict, DebriefPage2AuditTrail components]
---

# Phase 27 Plan 02: Debrief Page Polish Summary

Completed four targeted fixes to debrief pages 2 and 3: button heights, LinkedIn in-app sharing, copy refinement, and typography cleanup.

## Objective

Polish the debrief flow so sharing works correctly on mobile and the copy reads cleanly. Four specific fixes:

1. **Button heights (mobile WCAG compliance)**: LinkedIn anchor, Reboot button, and Copy button now all match at 44px mobile / 48px desktop
2. **LinkedIn in-app sharing**: Convert LinkedIn `<a target="_self">` anchor to `<button onClick={openLinkedInShare}>` for native app behavior on iOS
3. **Debrief page 2 copy**: Remove "governance" from subtitle; change "Every decision" to "Each one"
4. **Em dashes**: Replace `—` with cleaner punctuation (colons) in JSX text nodes

## Tasks Completed

### Task 1: DebriefPage3Verdict.tsx (button heights, LinkedIn in-app, em dash)

**Changes:**
- Added `openLinkedInShare` import from `../../../utils/linkedin-share`
- Converted LinkedIn button from `<a href target="_self">` to `<button type="button" onClick={(){ if (linkedInShareUrl) openLinkedInShare(linkedInShareUrl) }}`
- Updated button heights from `h-[40px] md:h-[48px]` to `h-[44px] md:h-[48px]` (44px = iOS HIG minimum, WCAG 2.5.5 Level AAA)
- Replaced em dash in "Copy the post text first — LinkedIn" with colon: "Copy the post text first: LinkedIn"
- Updated Reboot button to match height and flex layout

**Verification:**
- `rtk bun run typecheck` ✓ passes
- `rtk bun run test:smoke` ✓ 168 passed, 55 skipped
- All three buttons (Copy, LinkedIn, Reboot) now consistently sized 44px mobile

**Commit:** f215593 (feat(27-02): debrief page 3 button heights, LinkedIn in-app share, em dash cleanup)

### Task 2: DebriefPage2AuditTrail.tsx (copy edits, em dashes)

**Changes:**
- Subtitle: "A complete record of your governance decisions" → "A complete record of your decisions"
- Paper trail text: "Every decision left a paper trail. This is it — no edits, no redactions, no plausible deniability." → "Each one left a paper trail. This is it: no edits, no redactions, no plausible deniability."
- Replay hint: "Replay the forks mentally: same card, other swipe — different fine," → "Replay the forks mentally: same card, other swipe: different fine,"

**Verification:**
- `rtk bun run typecheck` ✓ passes
- `rtk bun run lint` ✓ no errors (pre-existing warning in geminiService.spec.ts, unrelated)
- `rtk bun run test:smoke` ✓ 168 passed, 55 skipped
- Copy reads more concisely without "governance" and "Every"

**Commit:** 0d20e50 (feat(27-02): debrief page 2 copy polish and em dash cleanup)

## Research Patterns Applied

### Pattern 1: Mobile-First Touch Targets (RESEARCH.md Pattern 2)
- iOS Human Interface Guidelines: 44px minimum
- Android Material Design: 48dp minimum
- WCAG 2.5.5 Level AAA: 44px minimum
- Changed buttons from 40px to 44px on mobile to comply with accessibility standards

### Pattern 2: Web Share API with Fallback (RESEARCH.md Pattern 3)
- LinkedIn `<a target="_self">` replaced with `<button onClick={openLinkedInShare}>`
- Ensures mobile opens LinkedIn app (native deep-link) instead of browser page
- `openLinkedInShare` utility handles: iOS app deep-link → 1.5s fallback to web URL

### Pattern 3: Typography Cleanup
- Replaced em dashes with colons/periods for cleaner UI typography
- Context-driven: em dashes are better for print; colons/commas better for UI
- Applied consistently across JSX text nodes (not in comments or string constants)

## Deviations from Plan

None. Plan executed exactly as written.

## Authentication Gates

None encountered.

## Files Modified

| File | Lines | Changes |
|------|-------|---------|
| src/components/game/debrief/DebriefPage3Verdict.tsx | 8-260 | Import openLinkedInShare; convert LinkedIn anchor to button; button heights 44px mobile; em dash → colon |
| src/components/game/debrief/DebriefPage2AuditTrail.tsx | 220, 224, 229 | Copy edits (remove "governance", "Every"→"Each one"); em dashes → colons |

## Testing & Verification

- **Typecheck**: ✓ clean
- **Linting**: ✓ clean (unrelated pre-existing warning in other file)
- **Smoke tests**: ✓ 168 passed, 55 skipped
- **Manual verification**: Three buttons on debrief page 3 now same height (44px on mobile); LinkedIn button works as `<button>` with onClick; copy reads cleanly on page 2

## Success Criteria Met

- [x] LinkedIn button is `<button>` calling `openLinkedInShare`, not `<a href>` (opens in-app on mobile)
- [x] All three buttons (Copy, LinkedIn, Reboot) are same height: 44px mobile (iOS HIG), 48px desktop
- [x] Debrief page 2 subtitle: "A complete record of your decisions" (no "governance")
- [x] Paper trail text: "Each one left a paper trail. This is it: no edits..." (no "Every decision", em dash replaced)
- [x] No em dashes in JSX text nodes of either debrief file
- [x] Typecheck, lint, smoke tests pass

## Self-Check

```
✓ DebriefPage3Verdict.tsx exists (modified)
✓ DebriefPage2AuditTrail.tsx exists (modified)
✓ Commit f215593 verified
✓ Commit 0d20e50 verified
✓ All tests pass
```

**Result: PASSED**
