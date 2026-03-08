# Deferred Items (Phase 04)

## Swipe preview test flakiness

**Test:** `tests/swipe-interactions.spec.ts` — "swipe preview text appears on drag"
**Status:** Fails on chromium-desktop and chromium-mobile
**Observed:** `div.absolute.font-black.tracking-tighter` not found within 500ms after 60px drag
**Likely cause:** Selector/timing sensitivity; CardStack and swipe logic unchanged by 04-01
**Action:** Defer to future phase; 12/14 tests pass
