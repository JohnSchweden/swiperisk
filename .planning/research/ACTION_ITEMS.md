# Action Items: Fix Mobile Content Positioning

**Project:** hyperscale
**Date:** 2026-02-07
**Scope:** Web + Native (Capacitor/PWA)

## The Problem

Your app has **7 screens that center content** and **1 screen (Game) that uses offset positioning**:

| Screen | Positioning | Pattern |
|--------|-------------|---------|
| Intro | `items-center justify-center` | ✅ Centered |
| Personality Select | `items-center justify-center` | ✅ Centered |
| Role Select | `items-center justify-center` | ✅ Centered |
| Initializing | `items-center justify-center` | ✅ Centered |
| **Game** | `pt-16` + absolute HUD | ❌ **OFFSET** |
| Boss Fight | `items-center justify-center` | ✅ Centered |
| Game Over | `items-center justify-center` | ✅ Centered |
| Summary | `items-center justify-center` | ✅ Centered |

This inconsistency causes **visual jumps** when transitioning to/from the Game screen.

## Web vs Native: Two Contexts to Support

Your app needs to work in:
1. **Mobile Web (Browser)** - Has address bar, dynamic viewport (use `100dvh`)
2. **Native App (PWA/Capacitor)** - Full screen, static viewport (use `100vh`)

See `NATIVE_WEB_DUAL.md` for comprehensive dual-context strategy.

## Immediate Fixes Required

### Fix 1: Replace 100vh with 100dvh (15 minutes)

**Why:** Mobile browser toolbars cause 100vh to be unstable

**In `index.html`, add:**
```css
@supports (height: 100dvh) {
  .min-h-screen-fix {
    min-height: 100dvh;
  }
}

@supports not (height: 100dvh) {
  .min-h-screen-fix {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
}
```

**In `App.tsx`, replace:**
```jsx
// OLD - problematic
<div className="... min-h-screen ...">

// NEW - stable
<div className="... min-h-[100dvh] ...">
```

### Fix 2: Standardize Layout Pattern (45 minutes)

**Recommended: Create LayoutShell Component**

**Create `LayoutShell.tsx`:**
```typescript
import React from 'react';

interface LayoutShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ 
  children, 
  header,
  footer,
  className = ''
}) => {
  return (
    <div className={`min-h-[100dvh] flex flex-col bg-[#0a0a0c] safe-area-top safe-area-bottom ${className}`}>
      {header && (
        <header className="flex-shrink-0">
          {header}
        </header>
      )}
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>
      
      {footer && (
        <footer className="flex-shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
};
```

**Update Game Screen to Use LayoutShell:**

The Game screen currently has:
```jsx
// CURRENT - Offset pattern
<div className="min-h-screen ... pt-16 md:pt-12 ...">
  {/* Fixed HUD */}
  <div className="absolute top-2 md:top-4 ...">
  
  {/* Content with offset padding */}
  <div className="... pt-8 ...">
    ...
  </div>
  
  {/* Fixed taskbar */}
  <div className="fixed bottom-0 ...">
</div>
```

**Change to:**
```jsx
// NEW - Unified pattern
<LayoutShell 
  header={
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      {/* HUD inline instead of absolute */}
      <HUD hype={state.hype} heat={state.heat} budget={state.budget} />
    </div>
  }
  footer={
    <div className="h-12 bg-slate-900/95 ...">
      <Taskbar ... />
    </div>
  }
>
  {/* Content - now centered like all other screens */}
  <div className="flex flex-col gap-4 w-full">
    <GameCard ... />
    <RoasterTerminal ... />
  </div>
</LayoutShell>
```

### Fix 3: Adjust HUD for Inline Layout (15 minutes)

**Current HUD (absolute):**
```jsx
<div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 ...">
```

**New HUD (inline):**
```jsx
<div className="w-full py-2">
  {/* Same content, removed absolute positioning */}
  <div className="flex flex-col md:flex-row gap-2 md:gap-6 ...">
    {/* Budget, Heat, Hype bars */}
  </div>
</div>
```

### Fix 4: Update Animation (5 minutes)

**Current:**
```css
.stage-transition {
  animation: fadeSlideIn 0.5s ...;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

**Simplify for consistency:**
```css
.stage-transition {
  animation: fadeScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes fadeScale {
  from { 
    opacity: 0; 
    transform: scale(0.96); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

## Alternative: If You Want to Keep Game Screen Offset

If the centered layout doesn't work for gameplay, keep the offset but **standardize it**:

1. **Create `OffsetLayoutShell`** with same structure as `LayoutShell` but top-anchored
2. **Use offset layout for ALL screens** (major redesign)
3. **Use different animation** for Game screen (slide from bottom instead of fade)

However, **centering all screens is recommended** - it's less work and creates consistency.

## Testing Checklist

After implementing:

- [ ] Navigate: Intro → Personality → Role → Game
- [ ] Check: No visual jump entering Game screen
- [ ] Navigate: Game → Boss Fight → Game Over → Summary
- [ ] Check: No visual jump exiting Game screen  
- [ ] Test on iOS Safari (real device)
- [ ] Test on Chrome Mobile
- [ ] Test: Scroll up/down, verify no toolbar-induced shifts
- [ ] Test: Rotate device to landscape
- [ ] Test: On notched device (iPhone X+), verify safe areas

## Expected Result

**Before:**
```
Intro:     [  Content Centered  ]     ↑
           ↑                        Jump!
Game:   [HUD]                       ↓
        [Content Offset]
        [Taskbar]
```

**After:**
```
Intro:     [  Content Centered  ]     ← Same position
           
Game:      [  Content Centered  ]     ← Same position
           [with HUD above]
```

## Time Estimate

| Task | Time |
|------|------|
| Add 100dvh support | 15 min |
| Create LayoutShell | 15 min |
| Update Game screen | 30 min |
| Test & verify | 15 min |
| **Total** | **~75 minutes** |

## Files to Modify

1. `index.html` - Add CSS for 100dvh fallback
2. `App.tsx` - Replace min-h-screen, integrate LayoutShell
3. Create `LayoutShell.tsx` - New component (optional: separate file)

## Questions to Decide

1. **Do you want all screens centered?** (Recommended - easiest fix)
2. **Or do you want all screens top-anchored?** (Native app feel - more work)
3. **Should HUD stay visible during gameplay?** (If yes, inline layout works)

## Dual-Context Implementation (Web + Native)

### Additional Fix: Detect Display Mode

Add CSS to handle both browser and native contexts:

```css
/* index.html - Add to existing styles */

/* Default: Browser mode with dynamic viewport */
:root {
  --viewport-height: 100dvh;
}

/* Standalone/PWA: Static viewport */
@media (display-mode: standalone) {
  :root {
    --viewport-height: 100vh;
  }
}

/* Fullscreen: Maximum space */
@media (display-mode: fullscreen) {
  :root {
    --viewport-height: 100vh;
  }
}

/* Use CSS custom property */
.app-shell {
  min-height: var(--viewport-height);
}
```

### JavaScript Detection (Optional)

If you need different behavior:

```typescript
// utils/displayMode.ts
export const getDisplayMode = (): 'browser' | 'standalone' | 'fullscreen' => {
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true) {
    return 'standalone';
  }
  return 'browser';
};

export const isNative = (): boolean => {
  // Check if running in Capacitor or similar
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};
```

### Testing Both Contexts

| Test | Mobile Web | PWA Standalone | Capacitor |
|------|------------|----------------|-----------|
| Install PWA | Use "Add to Home Screen" | Already installed | Build with Capacitor |
| Viewport stability | 100dvh essential | 100vh works | 100vh works |
| Safe areas | Required | Required | Required |
| Address bar | Visible | Hidden | Hidden |
| Status bar | System | System | Control via plugin |

### Capacitor Integration (Future)

If wrapping in Capacitor later:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
```

```typescript
// In your app initialization
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  // Native-specific setup
  const platform = Capacitor.getPlatform(); // 'ios' | 'android'
  console.log(`Running on native ${platform}`);
}
```

## Summary

**For Web (Immediate):**
- Fix layout inconsistency (centered vs offset)
- Use `100dvh` for browser compatibility
- Test in mobile Safari and Chrome

**For Native (Future-Proofing):**
- Same layout fixes work
- CSS `display-mode` handles viewport differences
- Safe areas work in both contexts
- Ready for Capacitor wrapper when needed

The layout fixes you make now will work in BOTH contexts.

