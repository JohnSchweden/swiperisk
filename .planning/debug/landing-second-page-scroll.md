---
status: resolved
trigger: "Landing page second page should always start at the top when user navigates to it / views it"
created: "2025-03-07T00:00:00.000Z"
updated: "2025-03-07T00:00:00.000Z"
symptoms_prefilled: true
---

## Current Focus

hypothesis: Document/window scroll position persists across stage transitions; no scroll-to-top on stage change
test: Add useEffect in App to scroll to top when state.stage changes
expecting: PersonalitySelect (and all stages) always render with user at top
next_action: implement fix

## Symptoms

expected: Landing page second page (PersonalitySelect) should always start at the top when user navigates to it / views it
actual: Page displays in a scrolled-down state (scroll position persists when it should not)
errors: None specified
reproduction: On mobile, go to landing page (Intro), scroll down, click Boot system → PersonalitySelect shows scrolled-down. Or: scroll on PersonalitySelect, navigate to RoleSelect and back (if back exists), scroll persists.
started: (unspecified)

## Root Cause

SPA stage transitions (Intro → PersonalitySelect → RoleSelect) re-render content but do not reset document scroll. On mobile, LayoutShell uses min-h-[100dvh] and overflow-y-auto; when content exceeds viewport the document scrolls. Transitioning stages leaves scroll position unchanged.

## Resolution

root_cause: Document scroll position persists across SPA stage transitions; no scroll-to-top on stage change.
fix: Scroll to top on every stage change via useEffect in App.tsx (window.scrollTo + documentElement.scrollTo).
verification: On mobile viewport, Intro → Boot → PersonalitySelect should show at top; PersonalitySelect → RoleSelect should show at top.
files_changed: ["App.tsx"]
