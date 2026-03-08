---
status: fixed
trigger: "Red glow around incident cards only visible after touch/drag when pressure is active"
created: 2025-03-07T00:00:00.000Z
updated: 2025-03-07T00:00:00.000Z
---

## Current Focus

hypothesis: Compositor layer optimized for transform skips box-shadow repaints until transform changes
test: Confirmed via code inspection; fix applied
expecting: Glow visible immediately when pressure activates
next_action: verify_in_browser

## Symptoms

expected: Glow (red border/ring from pressure-pulse box-shadow) visible immediately when pressure is active
actual: Glow not visible until user touches or drags the card; after interaction, it appears
errors: None reported
reproduction: Enter pressure state (countdown active or heat critical) → observe card has no visible glow → touch or start dragging the card → glow appears
started: User report

## Eliminated

- hypothesis: CSS missing or wrong — pressure-pulse keyframes and classes correct in index.html
- hypothesis: hasStressVisuals false — logic correct; classes applied when isUrgent || isCritical

## Evidence

- checked: CardStack.tsx line 135 — card gets `pressure-flicker pressure-pulse` when hasStressVisuals
- checked: index.html lines 323–334 — pressure-pulse-keyframes animate box-shadow (0 0 8px 1px rgba(239,68,68,0.35))
- checked: index.html lines 159–164 — .swipe-card has will-change: transform, opacity; transform: translateZ(0)
- found: GPU layer from will-change: transform optimizes for transform-only updates; box-shadow is a paint property
- found: Browser may not repaint box-shadow on the compositor layer until something triggers a repaint (e.g. inline transform change on touch/drag)
- implication: Glow animation runs but layer not re-composited until user interaction changes offset → transform → repaint

## Resolution

root_cause: .swipe-card promotes a compositor layer with will-change: transform, opacity. The pressure-pulse animation changes box-shadow (a paint property). Compositors optimize by not repainting when only non-transform properties change on such layers. Touch/drag changes the inline transform (offset), forcing a repaint, at which point the glow appears.
fix (attempt 1): Add will-change: box-shadow — did not fix.
fix (attempt 2): ::before with opacity animation — did not fix.
fix (attempt 3): Don't apply .swipe-card (will-change: transform) when hasStressVisuals && !isDragging. Card uses normal layer during pressure; when user touches, swipe-card is added for smooth drag.
verification: Manual test — enter pressure state, confirm glow visible without touching card
files_changed: index.html
