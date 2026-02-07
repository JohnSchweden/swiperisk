# Web vs Native: Quick Comparison

**Project:** hyperscale
**Date:** 2026-02-07

## At a Glance

| Feature | Mobile Web (Browser) | Native App (PWA/Capacitor) |
|---------|---------------------|---------------------------|
| **Address bar** | ✅ Visible (50-100px) | ❌ Hidden |
| **Toolbar collapse** | ✅ Yes - viewport changes | ❌ No - static viewport |
| **Viewport unit** | `dvh` (dynamic) | `vh` or `svh` (static) |
| **Safe areas** | ✅ Required | ✅ Required |
| **Pull-to-refresh** | Browser default | Disabled |
| **App store** | ❌ No | ✅ Yes (if Capacitor) |
| **Offline** | ⚠️ PWA only | ✅ Yes |
| **Push notifications** | ⚠️ PWA only | ✅ Yes |

## The Layout Problem in Both Contexts

**Your Current Issue:**
```
┌─────────────────────────────────────────────────────────────┐
│ Intro Screen:         [Content Centered]                    │
│                              ↕ JUMP!                        │
│ Game Screen:    [HUD]                                       │
│                 [Content Offset]  ← Different position!    │
└─────────────────────────────────────────────────────────────┘
```

**This jump happens in BOTH web and native.**

## Solution: Unified Layout Pattern

**Works in both contexts:**

```css
/* CSS - handles both automatically */
:root {
  /* Browser: accounts for address bar */
  --viewport-height: 100dvh;
}

/* Native: uses simpler viewport */
@media (display-mode: standalone) {
  :root {
    --viewport-height: 100vh;
  }
}

.app {
  min-height: var(--viewport-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

## Implementation Checklist

### For Web (Do This Now)
- [ ] Fix Game screen layout to match others (centered)
- [ ] Replace `min-h-screen` with `min-h-[100dvh]`
- [ ] Add `display-mode` media queries for future native support
- [ ] Test on iOS Safari and Chrome Mobile

### For Native (Ready When You Are)
- [ ] Same code works as PWA (just add manifest)
- [ ] Same code works in Capacitor (just wrap)
- [ ] Configure status bar plugin (Capacitor only)
- [ ] Test on physical iOS/Android devices

## Code Example: Dual-Context LayoutShell

```typescript
// LayoutShell.tsx - Works in BOTH contexts
import React from 'react';

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="
      min-h-[100dvh]           /* Web: dynamic viewport */
      [@media(display-mode:standalone)]:min-h-screen  /* Native: static */
      flex flex-col items-center justify-center
      bg-[#0a0a0c]
      safe-area-top safe-area-bottom
    ">
      {children}
    </div>
  );
};
```

## Visual Comparison

### Mobile Web (Browser)
```
┌───────────────────────────────┐
│ 📍 Address Bar (50px)         │
├───────────────────────────────┤
│                               │
│    [Your App Content]         │
│      (100dvh - address bar)   │
│                               │
├───────────────────────────────┤
│ 🧭 Navigation Bar             │
└───────────────────────────────┘
```

### Native App (PWA/Capacitor)
```
┌───────────────────────────────┐
│ 📱 Status Bar (20-50px)       │ ← Safe area handles this
├───────────────────────────────┤
│                               │
│    [Your App Content]         │
│      (100vh - status bar)     │
│                               │
├───────────────────────────────┤
│ ⬆️ Home Indicator (iOS)       │ ← Safe area handles this
└───────────────────────────────┘
```

**Key insight:** Safe areas (`env(safe-area-inset-*)`) work in BOTH contexts!

## Common Questions

### Q: Do I need different code for web vs native?
**A:** No! The same CSS works in both when using:
- `100dvh` for web (falls back to `100vh` if needed)
- `display-mode` media queries for optimization
- Safe area insets for both

### Q: Will my web fixes work in native?
**A:** Yes! Centering all screens and using proper viewport units works everywhere.

### Q: What's the easiest path to native?
**A:** 
1. Fix web layout now (centered, consistent)
2. Add PWA manifest (5 minutes)
3. Later: Wrap in Capacitor if you need app store

### Q: Do I need Capacitor now?
**A:** No. Fix the web version first. The same code will work when you add Capacitor later.

## Recommended Approach

**Phase 1 (Now):** Fix Web Layout
- Standardize all screens to centered layout
- Use `100dvh` with fallbacks
- Test on mobile browsers

**Phase 2 (Soon):** PWA Support
- Add web app manifest
- Add service worker
- Users can "install" from browser

**Phase 3 (Later):** Capacitor Wrapper
- Wrap existing web app
- Add native plugins if needed
- Publish to app stores

## Files for Reference

| File | Purpose |
|------|---------|
| `SUMMARY.md` | Problem diagnosis |
| `STACK.md` | Technology recommendations |
| `FEATURES.md` | Feature landscape |
| `ARCHITECTURE.md` | Layout patterns |
| `PITFALLS.md` | Common mistakes |
| `NATIVE_WEB_DUAL.md` | Detailed dual-context strategy |
| `ACTION_ITEMS.md` | Step-by-step implementation |

## Bottom Line

**Fix your layout inconsistency now.** The same fix works for:
- ✅ Mobile web browsers
- ✅ PWA (standalone mode)
- ✅ Capacitor native apps

You don't need to choose - do it once, works everywhere.
