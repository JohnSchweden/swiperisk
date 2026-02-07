# Domain Pitfalls: Mobile Layout & Positioning

**Domain:** Mobile Web UI Development
**Researched:** 2026-02-07

## Critical Pitfalls

Mistakes that cause major UX issues or require rewrites.

### Pitfall 1: Mixed Layout Strategies (YOUR CURRENT ISSUE)
**What goes wrong:** Different screens use different vertical positioning (centered vs offset), causing visual jumps during navigation

**Why it happens:** 
- Game screen needs HUD at top
- Other screens look better centered
- Developer optimized per-screen without considering transitions

**Consequences:**
- Users experience disorienting jumps between screens
- App feels unpolished and amateur
- Accessibility issues for motion-sensitive users

**Prevention:**
- Design ONE layout pattern for entire app
- Use consistent `LayoutShell` component
- If Game needs different layout, use different animation direction

**Detection:**
- Navigate between all screens
- Notice if content "jumps" to different vertical positions
- Check code for inconsistent `justify-center` vs `pt-16` patterns

### Pitfall 2: 100vh on Mobile
**What goes wrong:** Using `100vh` or `min-h-screen` causes content to shift as mobile browser toolbars show/hide

**Why it happens:**
- Mobile browsers calculate 100vh including space under toolbars
- When toolbars hide, 100vh stays the same (too tall)
- Content shifts as viewport actually changes

**Consequences:**
- Buttons move as user scrolls
- Full-screen layouts break
- 50-100px height variations on iOS Safari

**Prevention:**
```css
/* WRONG */
min-height: 100vh;

/* RIGHT */
min-height: 100dvh;  /* Dynamic viewport height */
```

**Detection:**
- Test on real iOS Safari
- Scroll up/down and watch for toolbar collapse
- Check if content shifts

### Pitfall 3: Double Safe Area Padding
**What goes wrong:** Applying both `safe-area-inset` and manual padding, creating too much space on notched devices

**Why it happens:**
- Developer adds `padding-top: 20px` for status bar
- Also adds `env(safe-area-inset-top)` 
- Both apply, doubling the space

**Consequences:**
- Excessive whitespace on iPhone X+
- Content sits too low
- Looks broken on newer devices

**Prevention:**
```css
/* WRONG */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
.element {
  padding-top: 20px;  /* Doubles the padding! */
}

/* RIGHT */
.safe-area-top {
  padding-top: max(env(safe-area-inset-top), 20px);
}
```

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

### Pitfall 4: Fixed Elements Without Safe Areas
**What goes wrong:** Fixed headers/footers go under notches or into home indicator area

**Prevention:**
```css
.fixed-header {
  position: fixed;
  top: 0;
  padding-top: env(safe-area-inset-top);
}
```

### Pitfall 5: Inconsistent Animation Directions
**What goes wrong:** All screens fade in, but content starts from different positions

**Prevention:**
- Match animation to layout:
  - Centered content → Fade + scale
  - Offset content → Slide from that direction
- OR standardize layout so all use same animation

### Pitfall 6: Hardware-Specific Sizing
**What goes wrong:** Using pixel values that work on test device but break on others

**Example:**
```css
/* WRONG - iPhone 14 Pro specific */
.padding-top { padding-top: 59px; }

/* RIGHT - Relative to viewport */
.padding-top { padding-top: env(safe-area-inset-top); }
```

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 7: Ignoring Reduced Motion
**What goes wrong:** Animations play even for users who prefer reduced motion

**Prevention:**
```css
@media (prefers-reduced-motion: reduce) {
  .stage-transition {
    animation: none;
  }
}
```

### Pitfall 8: Scrollbar Layout Shifts
**What goes wrong:** Content shifts when scrollbar appears/disappears

**Prevention:**
```css
html {
  overflow-y: scroll;  /* Always show scrollbar */
}
/* OR */
html {
  scrollbar-gutter: stable;  /* Reserve space */
}
```

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Layout Standardization | Breaking Game screen HUD | Redesign HUD to work in flow |
| Viewport Units Migration | Old browser fallback | Use `@supports` progressive enhancement |
| Safe Area Audit | Missing areas on some screens | Create checklist, test on notched device |
| Animation Polish | Inconsistent timing | Define animation tokens/variables |

## Your App's Risk Assessment

| Pitfall | Risk Level | Status |
|---------|-----------|--------|
| Mixed layout strategies | **CRITICAL** | ❌ Active issue |
| 100vh on mobile | **HIGH** | ❌ Active issue |
| Double safe area | **MEDIUM** | ⚠️ Check needed |
| Fixed without safe area | **MEDIUM** | ⚠️ Check needed |
| Inconsistent animations | **LOW** | ⚠️ Minor issue |
| Hardware-specific sizing | **LOW** | ✓ Not present |
| Reduced motion | **LOW** | ✗ Not implemented |
| Scrollbar shifts | **LOW** | ✓ Already handled |

## Prevention Checklist

Before shipping layout changes:

- [ ] Test on iOS Safari (real device or Simulator)
- [ ] Test on Chrome Mobile
- [ ] Test on notched device (iPhone X+)
- [ ] Test on non-notched device
- [ ] Test landscape orientation
- [ ] Test with increased font size (Accessibility)
- [ ] Test with reduced motion enabled
- [ ] Navigate through all 8 screens, check for jumps
- [ ] Verify no content under notches/home indicator
- [ ] Check that toolbars collapse without breaking layout

## Detection During Development

Watch for these warning signs:

1. **"Why does this screen look different?"** → Layout inconsistency
2. **"It works on my phone"** → Hardware-specific sizing
3. **"The animation feels off"** → Mismatched animation/position
4. **"There's too much space at the top"** → Double padding
5. **"Content moves when I scroll"** → 100vh issue

## Recovery Strategies

If you discover these issues post-launch:

**Mixed layouts:** Standardize gradually, prioritize high-traffic screens
**100vh:** CSS-only fix, no JS changes needed
**Safe areas:** Add CSS fallbacks, test thoroughly
**Animations:** Add reduced-motion support first (accessibility)

## Sources

- [WebKit: CSS Environment Variables](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [CSS-Tricks: Viewport Units](https://css-tricks.com/fun-viewport-units/)
