# Architecture Patterns: Mobile Layout Systems

**Domain:** Mobile Web UI Architecture
**Researched:** 2026-02-07

## Recommended Architecture

### Unified App Shell Pattern

Your app needs a single, consistent structural foundation that all screens share.

```
┌─────────────────────────────────────────────────────────────┐
│  App Shell (Consistent Across All Screens)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Header Area (Optional - Role Select, Game)            │  │
│  │ - Fixed height or hidden                              │  │
│  │ - Consistent styling                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                                                       │  │
│  │     Main Content Area (flex: 1)                       │  │
│  │     - Centers content vertically                      │  │
│  │     - Consistent padding                              │  │
│  │     - All screen content goes here                    │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Taskbar Area (Optional - Game only)                   │  │
│  │ - Fixed height                                        │  │
│  │ - Safe area bottom                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Current vs Recommended Structure

**Current (Problematic):**
```
Intro Screen:           Game Screen:
┌──────────────────┐    ┌──────────────────┐
│                  │    │ [HUD - absolute] │ ← Different!
│   [Centered]     │    ├──────────────────┤
│   [Content]      │    │ [Content with    │
│                  │    │  pt-16 padding]  │ ← Offset!
│                  │    ├──────────────────┤
│                  │    │ [Roaster]        │
│                  │    ├──────────────────┤
│                  │    │ [Taskbar - fix]  │
└──────────────────┘    └──────────────────┘
   ↑ Centered              ↑ Offset
```

**Recommended (Consistent):**
```
All Screens:
┌──────────────────┐
│ [Optional Header]│ ← Same position
├──────────────────┤
│                  │
│  [Centered       │
│   Content]       │ ← Always centered
│                  │
├──────────────────┤
│ [Optional Footer]│ ← Same position
└──────────────────┘
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `LayoutShell` | Provides consistent viewport, safe areas, centering | All screen components |
| `ScreenIntro` | Renders intro-specific content | LayoutShell |
| `ScreenPersonalitySelect` | Renders personality cards | LayoutShell |
| `ScreenRoleSelect` | Renders role grid | LayoutShell |
| `ScreenGame` | Renders game card + roaster | LayoutShell |
| `Taskbar` | Fixed bottom navigation | LayoutShell (Game only) |
| `HUD` | Game stats display | ScreenGame |

## Data Flow

```
User Action → Stage Change → LayoutShell Re-renders → Content Updates
                ↓
         Animation Triggered (consistent for all screens)
                ↓
         New Content Appears in Same Position
```

## Implementation Pattern

### LayoutShell Component

```typescript
// components/LayoutShell.tsx
import React from 'react';

interface LayoutShellProps {
  children: React.ReactNode;
  /** Optional fixed header content */
  header?: React.ReactNode;
  /** Optional fixed footer content */
  footer?: React.ReactNode;
  /** Animation key for transitions */
  animationKey: string;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({
  children,
  header,
  footer,
  animationKey
}) => {
  return (
    <div 
      className="min-h-dvh flex flex-col bg-[#0a0a0c] safe-area-top safe-area-bottom"
      key={animationKey}
    >
      {/* Header - fixed height when present */}
      {header && (
        <header className="flex-shrink-0 h-14 flex items-center px-4">
          {header}
        </header>
      )}
      
      {/* Main content - always centered */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>
      
      {/* Footer - fixed height when present */}
      {footer && (
        <footer className="flex-shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
};
```

### Screen Implementation

```typescript
// screens/IntroScreen.tsx
import { LayoutShell } from '../components/LayoutShell';

export const IntroScreen: React.FC = () => {
  return (
    <LayoutShell animationKey="intro">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">hyperscale</h1>
        <p className="mb-8">Tinder for AI Risk...</p>
        <button>Boot system</button>
      </div>
    </LayoutShell>
  );
};

// screens/GameScreen.tsx
import { LayoutShell } from '../components/LayoutShell';
import { Taskbar } from '../components/Taskbar';
import { HUD } from '../components/HUD';

export const GameScreen: React.FC = () => {
  return (
    <LayoutShell 
      animationKey="game"
      header={<HUD />}  /* HUD becomes part of flow */
      footer={<Taskbar />}
    >
      <div className="flex flex-col gap-4">
        <GameCard />
        <RoasterTerminal />
      </div>
    </LayoutShell>
  );
};
```

## Patterns to Follow

### Pattern 1: Single Layout Responsibility
**What:** One component owns the viewport, safe areas, and centering
**Why:** Eliminates inconsistency
**Example:** `LayoutShell` above

### Pattern 2: Content-Agnostic Shell
**What:** Layout shell doesn't know about screen content
**Why:** Reusable, testable, consistent
**Example:** LayoutShell accepts `children`, doesn't import screens

### Pattern 3: Consistent Animation Origin
**What:** All screens animate from same position/direction
**Why:** Prevents visual jumps
**Example:** Always fade + scale from center

## Anti-Patterns to Avoid

### Anti-Pattern 1: Screen-Defined Layouts
**What:** Each screen defines its own `min-h-screen`, padding, centering
**Why bad:** Inevitable inconsistency, visual jumps
**Instead:** Centralized `LayoutShell`

### Anti-Pattern 2: Absolute Positioning for Primary UI
**What:** Using `absolute` for headers/content that should be in flow
**Why bad:** Breaks document flow, harder to maintain
**Instead:** Flexbox with `flex-shrink-0` for fixed sections

### Anti-Pattern 3: Viewport Units in Components
**What:** Components using `100vh` directly
**Why bad:** Hard to override, causes issues
**Instead:** Parent container sets height, children use `100%`

## Scalability Considerations

| Concern | Current Approach | At Scale |
|---------|-----------------|----------|
| New screens | Copy-paste layout | Just wrap in `LayoutShell` |
| Layout changes | Edit N screens | Edit 1 component |
| Testing | Test each screen | Test `LayoutShell` once |
| Theming | Inline classes | `LayoutShell` accepts theme prop |

## Migration Path

### Step 1: Create LayoutShell
Create the component without changing existing screens

### Step 2: Migrate One Screen
Start with `Intro` - simplest case

### Step 3: Migrate All Screens
Update each render function to use `LayoutShell`

### Step 4: Remove Duplication
Delete old layout code from screen components

### Step 5: Polish
Add View Transitions, reduced motion, etc.

## Code Organization

```
src/
├── components/
│   ├── LayoutShell.tsx      # Core layout component
│   ├── Taskbar.tsx          # Fixed bottom bar
│   └── HUD.tsx              # Game stats (now in flow)
├── screens/
│   ├── IntroScreen.tsx      # Uses LayoutShell
│   ├── PersonalityScreen.tsx
│   ├── RoleScreen.tsx
│   ├── GameScreen.tsx
│   ├── BossFightScreen.tsx
│   ├── GameOverScreen.tsx
│   └── SummaryScreen.tsx
└── App.tsx                  # Switch between screens
```

## Sources

- [React Patterns: Layout Components](https://reactpatterns.com/#layout-component)
- [CSS Tricks: Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Web.dev: CSS Containment](https://web.dev/articles/css-containment)
