# Feature Landscape: Mobile Content Positioning

**Domain:** Mobile Web UI/UX
**Researched:** 2026-02-07

## Table Stakes (Expected Features)

Features users expect from modern mobile web apps. Missing these = broken experience.

| Feature | Why Expected | Current Status | Fix Needed |
|---------|--------------|----------------|------------|
| **Consistent Screen Positioning** | Users expect content to appear in same place across screens | ❌ BROKEN | HIGH - Causes visual jumps |
| **Toolbar-Aware Height** | Mobile browsers show/hide toolbars; content shouldn't jump | ❌ BROKEN | HIGH - Use `dvh` units |
| **Safe Area Support** | Notched devices need padding to avoid camera/notch | ⚠️ PARTIAL | MEDIUM - Apply consistently |
| **Touch-Friendly Targets** | 44px minimum touch target (Apple HIG) | ✓ WORKING | None - already implemented |
| **Smooth Transitions** | Screen changes should feel fluid | ⚠️ PARTIAL | MEDIUM - Match animations to layout |
| **Pull-to-Refresh Prevention** | Full-screen apps shouldn't bounce | ✓ WORKING | None - `overscroll-behavior` set |

## Differentiators (Competitive Advantage)

Features that set professional apps apart.

| Feature | Value Proposition | Complexity | Recommendation |
|---------|-------------------|------------|----------------|
| **View Transition API** | Native-app-like smooth screen transitions | Medium | Add after fixing positioning |
| **Dynamic Type Support** | Respect user's font size preferences | Low | Add `rem` font scaling |
| **Landscape Optimization** | Handle rotation gracefully | Medium | Test and adjust breakpoints |
| **Reduced Motion Support** | Accessibility for motion-sensitive users | Low | Add `prefers-reduced-motion` |
| **Bottom Sheet Pattern** | Native-feeling modals from bottom | Medium | Consider for feedback overlay |

## Anti-Features (Avoid These)

Common mistakes in mobile positioning.

| Anti-Feature | Why Avoid | What To Do Instead |
|--------------|-----------|-------------------|
| **100vh on mobile** | Causes toolbar collapse issues | Use `100dvh` or `100svh` |
| **Fixed positioning everything** | Breaks zoom, causes overlap | Use flexbox layouts |
| **Mixed centering strategies** | Causes visual jumps | Pick one: all centered OR all top-anchored |
| **Ignoring safe areas** | Content under notch/camera | Use `env(safe-area-inset-*)` |
| **Hardware-dependent sizing** | Breaks on different devices | Use relative units (`rem`, `%`, `dvh`) |

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    Consistent Positioning                    │
│                      (Foundation)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐    ┌────────────┐   ┌──────────────┐
│ dvh    │    │ Safe Areas │   │ Layout Shell │
│ Units  │    │ Consistent │   │ Component    │
└────────┘    └────────────┘   └──────────────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ Smooth Transitions│
            │ (Polish Layer)   │
            └──────────────────┘
```

## Your App's Current Feature Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Touch targets (44px) | ✓ | `min-h-[44px]` on buttons |
| Safe area classes | ✓ | Defined but inconsistently used |
| Pull-to-refresh prevention | ✓ | `overscroll-behavior-y: none` |
| Scrollbar styling | ✓ | Custom webkit scrollbar |
| Viewport meta tag | ✓ | `viewport-fit=cover` correct |
| **dvh units** | ✗ | Using problematic `100vh` |
| **Consistent positioning** | ✗ | Game screen different from others |
| **View Transitions** | ✗ | Not implemented |
| **Reduced motion support** | ✗ | Not implemented |

## MVP Recommendation

For immediate fix, prioritize:

1. **Replace `100vh` with `100dvh`** (30 min)
   - Changes: `min-h-screen` → `min-h-[100dvh]`
   - Impact: Fixes toolbar collapse issues

2. **Standardize Layout Pattern** (1 hour)
   - Create `LayoutShell` component
   - Use for all 8 screens
   - Impact: Eliminates visual jumps

3. **Fix Safe Area Application** (15 min)
   - Audit all screens for `safe-area-top/bottom`
   - Remove manual padding where safe-area exists
   - Impact: Proper notched device support

Defer to later:
- View Transition API (nice to have)
- Reduced motion support (accessibility)
- Landscape optimization (edge case)

## Feature Implementation Priority

```
PHASE 1 (Immediate - This Week):
├─ Replace 100vh → 100dvh
├─ Standardize layout component
└─ Fix safe area consistency

PHASE 2 (Soon - Next Sprint):
├─ Add View Transition API
├─ Reduced motion support
└─ Landscape mode polish

PHASE 3 (Later):
├─ Bottom sheet for overlays
├─ Dynamic type support
└─ Advanced gesture handling
```

## Sources

- [Apple HIG: Touch Targets](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)
- [MDN: Viewport Units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport)
- [Web.dev: View Transitions](https://web.dev/articles/view-transitions)
