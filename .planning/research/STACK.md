# UI/UX Stack Recommendations

**Project:** hyperscale
**Researched:** 2026-02-07
**Domain:** Mobile Web UI, SPA Layout Patterns

## Current Stack Assessment

### What's Working
| Technology | Implementation | Rating |
|------------|---------------|--------|
| Tailwind CSS | Utility-first styling | ✓ Good |
| Viewport Meta | `viewport-fit=cover` correct | ✓ Good |
| Safe Area | Classes defined, inconsistent use | ⚠️ Needs Fix |
| CSS Animations | Custom keyframes work well | ✓ Good |
| Fixed Taskbar | Bottom positioning with safe-area | ✓ Good |

### What's Causing Issues
| Technology | Issue | Severity |
|------------|-------|----------|
| `100vh` / `min-h-screen` | Mobile toolbar collapse bugs | HIGH |
| Inconsistent centering | Visual jumps between screens | HIGH |
| Double padding | safe-area + manual padding overlap | MEDIUM |

## Recommended Stack

### Immediate CSS Changes

```css
/* index.html - Add to existing styles */

/* Modern viewport units */
.min-h-dscreen {
  min-height: 100dvh;  /* Dynamic viewport height */
}

/* Consistent app shell */
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a0c;
}

.app-header {
  /* Fixed or static header area */
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Centering applied here consistently */
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.app-footer {
  /* Fixed or static footer area */
  flex-shrink: 0;
}
```

### Component Structure

```typescript
// LayoutShell.tsx - Unified layout for all screens
interface LayoutShellProps {
  children: React.ReactNode;
  variant?: 'centered' | 'offset';  // For Game screen if keeping offset
  showTaskbar?: boolean;
  header?: React.ReactNode;
}

const LayoutShell: React.FC<LayoutShellProps> = ({ 
  children, 
  variant = 'centered',
  showTaskbar = true,
  header
}) => {
  return (
    <div className="min-h-dvh flex flex-col bg-black safe-area-top safe-area-bottom">
      {header && (
        <header className="flex-shrink-0">
          {header}
        </header>
      )}
      
      <main className={`
        flex-1 flex flex-col px-4
        ${variant === 'centered' ? 'items-center justify-center' : 'items-center pt-4'}
      `}>
        {children}
      </main>
      
      {showTaskbar && <Taskbar />}
    </div>
  );
};
```

## Alternatives Considered

### Option A: All Centered (Recommended)
**Approach:** Every screen centers content vertically
- **Pros:** Consistent, simple, works on all screen sizes
- **Cons:** Game screen HUD feels less "app-like"
- **Fix:** Redesign Game HUD to work in centered layout

### Option B: All Top-Anchored (Native App Feel)
**Approach:** All content starts from top with consistent spacing
- **Pros:** Feels more like native mobile app
- **Cons:** Empty space at bottom on large screens
- **Fix:** Add decorative elements or expand content

### Option C: Contextual Layout (Current - Problematic)
**Approach:** Different layouts for different screens
- **Pros:** Optimized per-screen experience
- **Cons:** Visual jumps between screens (current issue)
- **Verdict:** NOT recommended

## Implementation Decision

**Recommendation: Option A (All Centered) with Game Screen Redesign**

Rationale:
1. Easiest to implement immediately
2. Eliminates visual jumps completely
3. Your current centered screens feel cohesive
4. Game screen can work centered with minor HUD adjustments

### Game Screen HUD Redesign

Current (offset):
```
┌─────────────────────────────┐
│ [HUD - absolute top]        │ ← absolute positioned
├─────────────────────────────┤
│                             │
│    [Card centered here]     │
│                             │
│                             │
├─────────────────────────────┤
│ [Roaster Terminal]          │
├─────────────────────────────┤
│ [Taskbar]                   │ ← fixed bottom
└─────────────────────────────┘
```

Proposed (centered):
```
┌─────────────────────────────┐
│                             │
│  [HUD - part of flow]       │ ← in normal flow
│                             │
│    [Card centered]          │
│                             │
│  [Roaster Terminal]         │
│                             │
├─────────────────────────────┤
│ [Taskbar]                   │
└─────────────────────────────┘
```

## CSS Custom Properties for Consistency

```css
:root {
  /* Viewport */
  --viewport-height: 100dvh;
  
  /* Spacing Scale */
  --space-safe-top: env(safe-area-inset-top, 0px);
  --space-safe-bottom: env(safe-area-inset-bottom, 0px);
  --space-screen-padding: 1rem;
  --space-section-gap: 1.5rem;
  
  /* Header Heights */
  --header-height: 3.5rem;  /* 56px - touch friendly */
  --taskbar-height: 3rem;   /* 48px */
  
  /* Content Max Widths */
  --content-max-width: 48rem;  /* 768px */
  --content-max-width-lg: 64rem;  /* 1024px */
}

/* Reset problematic viewport units */
@supports (height: 100dvh) {
  .min-h-screen-fix {
    min-height: 100dvh;
  }
}

@supports not (height: 100dvh) {
  .min-h-screen-fix {
    min-height: 100vh;
    min-height: -webkit-fill-available;  /* iOS fallback */
  }
}
```

## Verification Checklist

After implementation, verify:
- [ ] All screens use same `min-h-dvh` base
- [ ] Content starts at same vertical position
- [ ] No jump when transitioning between Intro → Personality → Role
- [ ] No jump when transitioning to/from Game screen
- [ ] Mobile browsers (iOS Safari, Chrome) handle toolbar collapse smoothly
- [ ] Safe areas respected on notched devices
- [ ] Desktop still centers content properly

## Browser Support

| Feature | Chrome | Safari | Firefox | Notes |
|---------|--------|--------|---------|-------|
| `dvh` units | 108+ | 15.4+ | 101+ | All current browsers |
| `env(safe-area-inset-*)` | 69+ | 11.2+ | 65+ | iOS essential |
| View Transition API | 126+ | TP | No | Optional enhancement |

**Conclusion:** Safe to use `dvh` units - supported by 95%+ of mobile browsers.

## Sources

- [Can I Use: Viewport Units](https://caniuse.com/viewport-units)
- [MDN: CSS Length Units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)
- [Chrome Dev: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions)
