# Haptic / Vibration API Research

**Date:** 2026-03-08  
**Context:** Phase 04 UAT Test 7 — "no vibration on mobile"  
**Update:** User confirmed: no vibration on Android Chrome (touch-swipe and button-tap both fail). Marked as gap in 04-VERIFICATION.md.

## Platform Support

| Platform | navigator.vibrate | Notes |
|----------|-------------------|-------|
| Android Chrome | ✓ Supported | Requires user gesture; some devices need longer pulse |
| iOS Safari | ✗ Not supported | WebKit has no Vibration API; all iOS browsers use WebKit |
| iOS Chrome | ✗ Not supported | Uses WebKit under the hood |
| PWA vs browser | Same | Installation status makes no difference; platform support only |

**Bottom line:** If you're on iPhone, vibration will never work. No workaround exists.

## User Gesture Requirement

Chrome (and spec) blocks `navigator.vibrate` when not triggered by direct user activation:
- ✓ Works: Call inside `click`, `touchstart`, `touchend`, `touchend` handler synchronously
- ✗ Blocked: `useEffect`, `setTimeout`, `requestAnimationFrame`, `fetch` callback

**No bypass in production.** Chrome flag `chrome://flags` "Requiring user gesture for the Vibration API" can disable for dev only.

## What We Implement (Correct)

| Path | Trigger | User gesture? | Status |
|------|---------|---------------|--------|
| Touch-swipe | `handleTouchEnd` → `onBeforeSwipe` before `setTimeout` | ✓ Yes | **FAILED on Android Chrome** (user confirmed) |
| Button tap | `onSwipeLeft`/`onSwipeRight` in click handler | ✓ Yes | **FAILED on Android Chrome** (user confirmed) |
| Critical-state entry | `onCriticalChange` from useEffect | ✗ No | Platform blocked |
| Timer expiry | `onExpire` from countdown effect | ✗ No | Platform blocked |

## Android-Specific Quirks

1. **1000ms minimum on some devices (Oct 2024):** StackOverflow confirms: `navigator.vibrate(1000)` does nothing; `navigator.vibrate(1001)` works. Values &lt;1000ms are ignored. See: https://stackoverflow.com/questions/79077091
2. **Cancel unreliable:** `navigator.vibrate(0)` to stop early does not work reliably on affected devices.
3. **Silent / DND mode:** OS can disable vibration for web APIs.
4. **Return value:** `navigator.vibrate()` returns boolean; we don't check it.

## Implemented Pattern (2026-03-08)

- Use `vibrate(1001)` to satisfy Android threshold; attempt cancel after 80ms via `vibrate(0)`.
- If cancel works: short pulse. If not: full 1s (device quirk; document in verification).

## Verification Checklist

1. **Device:** Android (iOS = no go)
2. **Browser:** Chrome or Chromium-based
3. **Sound:** Device not in Silent; check DND settings
4. **Test:** Tap swipe button on urgent card (dev_1), or touch-swipe the card — both run in user gesture
