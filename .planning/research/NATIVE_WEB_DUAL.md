# Native vs Web: Dual-Context Layout Strategy

**Project:** hyperscale
**Date:** 2026-02-07
**Scope:** Handling both Mobile Web (browser) and Native App (Capacitor/PWA) contexts

## The Dual-Context Challenge

Your app needs to work in **two different environments** with different viewport behaviors:

### Context A: Mobile Web (Browser)
- **Browser chrome visible:** Address bar, toolbars, navigation
- **Viewport changes:** Toolbars collapse/expand as user scrolls
- **Safe areas:** `env(safe-area-inset-*)` for notches
- **Height units:** `dvh` (dynamic viewport height) needed
- **URL bar:** Takes up 50-100px at top

### Context B: Native App (Capacitor/PWA Standalone)
- **No browser chrome:** Full screen available
- **Static viewport:** No collapsing toolbars
- **Safe areas:** `env(safe-area-inset-*)` still applies
- **Height units:** `vh` or `svh` (no dynamic changes)
- **Status bar:** System status bar at top (20-50px)

## Key Differences Summary

| Aspect | Mobile Web | Native App |
|--------|------------|------------|
| **Available height** | Changes dynamically | Fixed |
| **Top chrome** | Address bar (50-100px) | Status bar (20-50px) |
| **Bottom chrome** | Navigation bar | Home indicator (iOS) |
| **Viewport units** | `dvh` (essential) | `vh` or `svh` |
| **Safe areas** | Required | Required |
| **Pull-to-refresh** | Browser default | Disabled |
| **Overscroll** | Browser handles | App-controlled |

## The Problem with "One Size Fits All"

### If you optimize only for Web:
```css
.app {
  min-height: 100dvh;  /* Works great in browser */
}
```
**In Native:** Works fine, but `dvh` is unnecessary (viewport doesn't change)

### If you optimize only for Native:
```css
.app {
  min-height: 100vh;  /* Works in native */
}
```
**In Web:** Content shifts as toolbars collapse/expand ❌

## Recommended: Adaptive Layout Strategy

### Step 1: Detect Display Mode

**CSS Detection (recommended):**
```css
/* Browser mode - has address bar */
@media (display-mode: browser) {
  :root {
    --viewport-height: 100dvh;
    --top-offset: 0px;  /* Address bar handled by dvh */
  }
}

/* Standalone/PWA mode - no address bar */
@media (display-mode: standalone) {
  :root {
    --viewport-height: 100vh;  /* or 100svh */
    --top-offset: env(safe-area-inset-top);
  }
}

/* Fullscreen mode - games, immersive */
@media (display-mode: fullscreen) {
  :root {
    --viewport-height: 100vh;
    --top-offset: 0px;
  }
}
```

**JavaScript Detection (for logic):**
```typescript
// Detect if running as installed PWA or native
const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
  || window.navigator.standalone === true;  // iOS

const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

const isBrowser = !isStandalone && !isFullscreen;
```

**Capacitor Detection:**
```typescript
// If using Capacitor
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();  // true for iOS/Android app
const platform = Capacitor.getPlatform();  // 'ios', 'android', 'web'
```

### Step 2: Adaptive CSS Architecture

```css
:root {
  /* Default: browser mode */
  --viewport-height: 100dvh;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --app-padding-top: 0px;
  --app-padding-bottom: 0px;
}

/* Standalone/native adjustments */
@media (display-mode: standalone) {
  :root {
    --viewport-height: 100vh;
    /* Native apps might need different spacing */
    --app-padding-top: max(var(--safe-top), 20px);
  }
}

/* Fullscreen (games, immersive) */
@media (display-mode: fullscreen) {
  :root {
    --viewport-height: 100vh;
    --app-padding-top: var(--safe-top);
    --app-padding-bottom: var(--safe-bottom);
  }
}

/* Base app shell */
.app-shell {
  min-height: var(--viewport-height);
  padding-top: var(--app-padding-top);
  padding-bottom: var(--app-padding-bottom);
}
```

### Step 3: Platform-Safe LayoutShell

```typescript
// components/AdaptiveLayoutShell.tsx
import { useEffect, useState } from 'react';

interface AdaptiveLayoutShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const AdaptiveLayoutShell: React.FC<AdaptiveLayoutShellProps> = ({
  children,
  header,
  footer
}) => {
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'fullscreen'>('browser');
  
  useEffect(() => {
    // Detect initial mode
    const detectMode = () => {
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        return 'fullscreen';
      }
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        return 'standalone';
      }
      return 'browser';
    };
    
    setDisplayMode(detectMode());
    
    // Listen for changes (rare but possible)
    const standaloneMQ = window.matchMedia('(display-mode: standalone)');
    const fullscreenMQ = window.matchMedia('(display-mode: fullscreen)');
    
    const handleChange = () => setDisplayMode(detectMode());
    
    standaloneMQ.addEventListener('change', handleChange);
    fullscreenMQ.addEventListener('change', handleChange);
    
    return () => {
      standaloneMQ.removeEventListener('change', handleChange);
      fullscreenMQ.removeEventListener('change', handleChange);
    };
  }, []);
  
  return (
    <div 
      className="app-shell"
      data-display-mode={displayMode}
    >
      {header && <header className="app-header">{header}</header>}
      
      <main className="app-main">
        {children}
      </main>
      
      {footer && <footer className="app-footer">{footer}</footer>}
    </div>
  );
};
```

### Step 4: Platform-Aware CSS

```css
/* Base styles */
.app-shell {
  min-height: var(--viewport-height);
  display: flex;
  flex-direction: column;
  background: #0a0a0c;
}

.app-header {
  flex-shrink: 0;
  padding-top: var(--safe-top);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.app-footer {
  flex-shrink: 0;
  padding-bottom: var(--safe-bottom);
}

/* Browser-specific: account for dynamic toolbars */
@media (display-mode: browser) {
  .app-main {
    /* Slightly more padding for browser comfort */
    padding-top: max(1rem, var(--safe-top));
  }
}

/* Standalone: tighter layout, no toolbar concerns */
@media (display-mode: standalone) {
  .app-shell {
    /* Native feel - full height without dvh */
    min-height: 100vh;
  }
}
```

## Handling Safe Areas in Both Contexts

### The Safe Area Challenge

**iPhone with notch (iPhone X+):**
- Web: `env(safe-area-inset-top)` ≈ 44px
- Native: `env(safe-area-inset-top)` ≈ 44px
- Same value, different context

**Android with display cutout:**
- Web: May or may not report safe areas
- Native: Usually reports correctly

### Universal Safe Area Solution

```css
/* Always apply safe areas, works in both contexts */
.safe-area-top {
  padding-top: max(env(safe-area-inset-top, 0px), 20px);
}

.safe-area-bottom {
  padding-bottom: max(env(safe-area-inset-bottom, 0px), 20px);
}

/* Content area that avoids notches */
.safe-content {
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
```

## Capacitor-Specific Considerations

If wrapping in Capacitor for native apps:

### Configuration (capacitor.config.json)
```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000
    }
  },
  "ios": {
    "contentInset": "always",  // Respects safe areas
    "allowsLinkPreview": false
  },
  "android": {
    "allowMixedContent": true
  }
}
```

### Status Bar Handling
```typescript
// In native app, control status bar
import { StatusBar, Style } from '@capacitor/status-bar';

// Set status bar to dark (for your dark theme)
await StatusBar.setStyle({ style: Style.Dark });

// Make status bar overlay webview (your CSS handles safe area)
await StatusBar.setOverlaysWebView({ overlay: true });
```

## Testing Both Contexts

### Test Matrix

| Test | Browser | Standalone PWA | Capacitor iOS | Capacitor Android |
|------|---------|----------------|---------------|-------------------|
| Viewport height stable | ✓ | ✓ | ✓ | ✓ |
| Safe areas respected | ✓ | ✓ | ✓ | ✓ |
| No layout jumps | ✓ | ✓ | ✓ | ✓ |
| Content centered | ✓ | ✓ | ✓ | ✓ |
| Toolbar/keyboard handling | ✓ | N/A | ✓ | ✓ |

### Testing Tools

1. **Chrome DevTools:** Device simulation with "Show device frame"
2. **iOS Simulator:** Test both Safari and standalone (Add to Home Screen)
3. **Android Emulator:** Chrome and installed PWA
4. **Capacitor Live Reload:** `npx cap run ios --livereload`

## Implementation Roadmap

### Phase 1: Fix Web Issues (Immediate)
- Replace `100vh` with `100dvh` for browser compatibility
- Fix layout inconsistencies between screens
- Test in mobile Safari and Chrome

### Phase 2: Add Display Mode Detection
- Implement CSS `@media (display-mode: ...)` queries
- Add JavaScript detection for advanced logic
- Test PWA in standalone mode

### Phase 3: Capacitor Wrapper (Optional)
- Wrap in Capacitor for app store distribution
- Configure status bar and safe areas
- Test on physical devices

### Phase 4: Polish
- Keyboard handling differences
- Platform-specific animations
- Performance optimization

## Code Example: Complete Adaptive Layout

```typescript
// App.tsx with adaptive layout
import { useEffect, useState } from 'react';

function App() {
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone'>('browser');
  
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    setDisplayMode(isStandalone ? 'standalone' : 'browser');
  }, []);

  return (
    <div 
      className="min-h-[100dvh] flex flex-col bg-[#0a0a0c]"
      style={{
        // Use dvh in browser, vh in standalone
        minHeight: displayMode === 'browser' ? '100dvh' : '100vh'
      }}
    >
      {/* Content */}
    </div>
  );
}
```

```css
/* styles.css */
@supports (height: 100dvh) {
  :root {
    --viewport-height: 100dvh;
  }
}

@supports not (height: 100dvh) {
  :root {
    --viewport-height: 100vh;
  }
}

/* Override for standalone mode */
@media (display-mode: standalone) {
  :root {
    --viewport-height: 100vh;
  }
}
```

## Sources

- [MDN: display-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)
- [web.dev: PWA Detection](https://web.dev/learn/pwa/detection)
- [Capacitor Safe Area Plugin](https://github.com/ionic-team/capacitor-plugins/tree/main/safe-area)
- [Smashing Mag: PWA Display Modes](https://www.smashingmagazine.com/2025/08/optimizing-pwas-different-display-modes/)
