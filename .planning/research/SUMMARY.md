# Research Summary: Mobile Content Positioning Analysis

**Project:** hyperscale - AI Risk/Governance Game
**Research Date:** 2026-02-07
**Domain:** Mobile Web UI/UX, SPA Screen Transitions, Native vs Web
**Overall Confidence:** HIGH

## Important Note: Web vs Native

This research covers **both mobile web browsers AND native apps** (Capacitor/PWA). See:
- `NATIVE_WEB_DUAL.md` for dual-context strategy
- `STACK.md` for technology comparison
- `ACTION_ITEMS.md` for implementation steps

## Executive Summary

Your hyperscale app experiences **visual jumps between screens** because different stages use inconsistent layout strategies. Most screens center content vertically (`items-center justify-center`), but the main game screen uses a different layout with fixed-position HUD elements and padding-based positioning. This creates a jarring experience when transitioning between:
- Centered screens (Intro, Personality Select, Role Select, etc.)
- Offset screens (Game screen with fixed HUD)

## Key Findings

### Root Cause of Visual Jumps

**Inconsistent Vertical Rhythm:**
- 7 of 8 screens use: `min-h-screen` + `items-center justify-center` (centered)
- 1 screen (Game) uses: `min-h-screen` + `pt-16` + absolute positioned HUD (offset)

**Viewport Height Issues:**
- Using `min-h-screen` (100vh) causes mobile browser toolbar collapse/expand issues
- 100vh on mobile includes space underneath browser toolbars that may hide
- This creates 50-100px height variations as users scroll

**Animation Timing:**
- The `stage-transition` animation (fadeSlideIn) masks some issues but doesn't fix them
- Content still starts from different baseline positions

## Critical Issues Found

### 1. Game Screen Layout Outlier
The main gameplay screen breaks the established pattern:
```jsx
// Game screen - DIFFERENT pattern
<div className="min-h-screen ... pt-16 md:pt-12 ...">
  {/* Fixed HUD at top */}
  <div className="absolute top-2 md:top-4 ...">
  
  {/* Content area - NOT centered */}
  <div className="flex-1 flex flex-col items-center justify-center ...">
</div>

// All other screens - CENTERED pattern
<div className="flex flex-col items-center justify-center min-h-screen ...">
```

### 2. Viewport Unit Instability
Using `100vh` / `min-h-screen` on mobile causes:
- iOS Safari: Address bar expands/collapses changes viewport height
- Chrome Mobile: Toolbar shows/hides affects calculations
- Results in content "jumping" as browser chrome changes

### 3. Safe Area Handling
You have `safe-area-top` and `safe-area-bottom` classes but:
- Not consistently applied across all screens
- Some screens double-pad (safe-area + manual padding)
- Others miss safe-area entirely

## Recommended Solutions

### Immediate Fix (High Priority)

**Standardize to "App Shell" Layout Pattern:**

All screens should share the same structural foundation:

```jsx
// UNIFIED LAYOUT PATTERN
<div className="min-h-dvh flex flex-col bg-black safe-area-top safe-area-bottom">
  {/* Fixed header area - consistent height OR hidden */}
  
  {/* Main content - always flex-1 with consistent internal centering */}
  <main className="flex-1 flex flex-col items-center justify-center">
    {/* Screen-specific content */}
  </main>
  
  {/* Fixed footer area - consistent height OR hidden */}
</div>
```

### Modern Viewport Units (2025 Best Practice)

Replace `100vh` with `dvh` (Dynamic Viewport Height):

| Unit | Meaning | Use When |
|------|---------|----------|
| `svh` | Small Viewport Height (toolbars visible) | You need guaranteed visible space |
| `lvh` | Large Viewport Height (toolbars hidden) | You want full coverage after scroll |
| `dvh` | Dynamic Viewport Height (changes as toolbars show/hide) | **Default for full-screen apps** |

**Your Fix:**
```css
/* Replace */
min-h-screen  /* 100vh - problematic on mobile */

/* With */
min-h-dvh     /* dynamic - adjusts to toolbar state */
```

### Screen-Specific Recommendations

**For Menu/Static Screens (Intro, Select, Game Over, Summary):**
- Keep centered vertically BUT use consistent container
- Consider slight top-offset (5-10vh) to feel more "mobile-native"
- Center content in upper-middle, not dead-center

**For Game Screen:**
- Either embrace the offset layout consistently
- OR redesign to fit the centered pattern
- If keeping offset: make transition animation slide from bottom, not fade

**Animation Strategy:**
```css
/* For centered screens - fade + slight scale */
@keyframes enter-centered {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

/* For offset screens (Game) - slide up */
@keyframes enter-offset {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Mobile vs Desktop Strategy

### Mobile (Primary - 60%+ of traffic)
**Recommendation: Consistent Top-Anchored Layout**
- Most mobile apps anchor content to top, not center
- Thumb zone is bottom 2/3 of screen
- Headers at top, actions at bottom

```jsx
// Mobile-first layout
<div className="min-h-dvh flex flex-col">
  <header className="h-14 flex items-center px-4">...</header>
  <main className="flex-1 px-4 pt-4">...</main>
  <footer className="h-14 safe-area-bottom">...</footer>
</div>
```

### Desktop (Secondary)
**Recommendation: Centered with Max-Width Constraints**
- Center content horizontally (max-w-4xl, mx-auto)
- Can center vertically since mouse precision is higher
- More space for side elements

```jsx
// Desktop enhancement
<div className="min-h-dvh flex flex-col items-center justify-center">
  <div className="w-full max-w-4xl">...</div>
</div>
```

## Implementation Priority

### Phase 1: Fix Viewport Units (Immediate)
- [ ] Replace all `min-h-screen` with `min-h-dvh`
- [ ] Test on iOS Safari and Chrome Mobile
- [ ] Verify no toolbar collapse issues

### Phase 2: Standardize Layout Structure
- [ ] Create `LayoutShell` component used by all screens
- [ ] Decide: All centered OR all top-anchored
- [ ] Document the pattern for future screens

### Phase 3: Polish Transitions
- [ ] Match animation direction to content position
- [ ] Add View Transition API for smoother screen changes
- [ ] Test on real devices

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Problem Diagnosis | HIGH | Clear inconsistency in code analysis |
| Viewport Units | HIGH | Well-documented 2025 best practices |
| Layout Strategy | MEDIUM | Depends on design preference (centered vs anchored) |
| Implementation | HIGH | Straightforward CSS/React changes |

## Sources

- [MDN: Viewport Concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts)
- [DebugBear: Mobile Viewport Optimization](https://www.debugbear.com/blog/optimize-viewport-for-mobile)
- [Medium: CSS Viewport Units Guide](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-a-complete-guide-to-svh-lvh-and-dvh-0c905d96e21a)
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

---

**Next Step:** Review recommendations and decide between "All Centered" vs "All Top-Anchored" layout strategy.
