# Phase 27: Mobile UX Fixes — Research

**Researched:** 2026-04-16
**Domain:** Mobile web UX, Web Audio API, Clipboard API, Web Share API
**Confidence:** HIGH

## Summary

This phase addresses 8 specific mobile UX issues across audio behavior, button layout, social sharing, clipboard functionality, copy text, and UI sizing. Research reveals established patterns for each domain that avoid common pitfalls.

**Key insight:** Most mobile web issues stem from not using platform-native APIs when available. The Web Share API (mobile) and proper AudioContext isolation are SOTA patterns that should be preferred over custom implementations.

**Primary recommendation:** Use Web Share API for mobile LinkedIn sharing, ensure separate AudioContext lifecycles for BGM vs voice, and apply platform-specific touch target sizes (44px iOS / 48px Android).

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Audio: Default Music Volume**: Mobile: 15%, Desktop: 20%
- **Audio: BGM Pause Must Not Mute Voices (MOBILE ONLY)**: When BGM is paused on mobile, voice/TTS audio must still play; fix audio isolation
- **Debrief Buttons: Height Alignment (MOBILE ONLY)**: Share on LinkedIn, Reboot System, Copy to Clipboard must be same height
- **LinkedIn Share: Open In-App Instead of New Page (BOTH)**: Match DM button behavior (same-tab / correct intent)
- **Copy Game Link: Fix on Mobile (MOBILE ONLY)**: "Copy game link" button on intro page is not working on mobile
- **Debrief Page 2 Copy Change (BOTH)**: 
  - "A complete record of your governance decisions" → "A complete record of your decisions"
  - "Every decision left a paper trail" → "Each one left a paper trail"
- **Debrief Pages: Replace Em Dashes (BOTH)**: Replace all "—" with commas, colons, or restructured sentences
- **UIUX Sizing Audit: Mobile View (MOBILE)**: Check touch target sizes (min 44px), font readability, spacing, button proportions, overflow/clipping

### Claude's Discretion
- Specific implementation approach for audio isolation
- Button height sizing strategy (px vs relative units)
- LinkedIn share method selection (Web Share API vs intent URLs)
- Copy link fallback strategy for older browsers
- Specific em dash replacement strategy (which punctuation to use)

### Deferred Ideas (OUT OF SCOPE)
- None — all items are in scope for this phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MOB-AUDIO-01 | Default BGM volume: 15% mobile, 20% desktop | Platform detection via userAgent + matchMedia; separate default constants |
| MOB-AUDIO-02 | BGM pause must not mute voice audio on mobile | Separate AudioContext lifecycles; BGM pause only affects BGM gainNode |
| MOB-UI-01 | Debrief buttons same height on mobile | Consistent min-h-[44px] / min-h-[48px] classes; flexbox alignment |
| MOB-SHARE-01 | LinkedIn opens in-app on mobile | Web Share API (preferred) with linkedin:// fallback |
| MOB-COPY-01 | Copy game link works on mobile | Clipboard API with execCommand fallback for older browsers |
| COPY-01 | Debrief page 2 copy changes | Direct text replacement in DebriefPage2AuditTrail.tsx |
| COPY-02 | Replace em dashes in debrief pages | Find/replace — with commas, colons, or periods |
| MOB-AUDIT-01 | Mobile sizing audit | WCAG 2.5.5 (44px min), Android HIG (48dp), responsive typography |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Web Share API | Native (2024+) | Mobile native sharing | Platform-native share sheet; works with LinkedIn app |
| Clipboard API | Native (2018+) | Programmatic copy | Standard replacement for execCommand; async/Promise-based |
| Web Audio API | Native | Audio pipeline isolation | Separate AudioContexts for BGM vs voice; GainNode volume control |
| matchMedia API | Native | Viewport detection | Standard for mobile breakpoint detection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| navigator.userAgent | Native | Platform detection | iOS-specific audio workarounds |
| execCommand('copy') | Native (legacy) | Clipboard fallback | Safari <13.1, older browsers |
| URLSearchParams | Native | URL parsing | Parsing linkedin:// deep links |

**No additional installation required** — all APIs are native browser features.

---

## Architecture Patterns

### Pattern 1: Audio Pipeline Isolation
**What:** Separate AudioContext instances for BGM and voice playback
**When to use:** When pausing one audio source must not affect others

**Current codebase structure:**
```typescript
// BGM: useBackgroundMusic.ts - has its own AudioContext
const ctx = new AudioContext();
const mediaSource = ctx.createMediaElementSource(el);
const gain = ctx.createGain();

// Voice: voicePlayback.ts - separate AudioContext  
let audioContext: AudioContext | null = null;
```

**The fix:** Ensure `enabled` toggle in useBackgroundMusic only affects BGM gainNode:
```typescript
// CORRECT: Pause only affects BGM
if (!enabled) {
  el.pause(); // Only pauses BGM element
  // Voice continues playing via separate AudioContext
}
```

**Anti-pattern to avoid:**
```typescript
// WRONG: Suspending shared AudioContext would mute everything
audioContext.suspend(); // Don't do this — affects all audio
```

### Pattern 2: Mobile-First Touch Targets
**What:** Platform-specific minimum touch target sizes
**When to use:** All interactive elements on mobile

**Standard sizes:**
- iOS Human Interface Guidelines: **44px minimum**
- Android Material Design: **48dp minimum**
- WCAG 2.5.5: **44px minimum** (Level AAA)

**Implementation:**
```typescript
// Tailwind classes for mobile/desktop
const BTN_MOBILE = "min-h-[44px] md:min-h-[48px]"; // iOS / Android
// Or use consistent 44px for cross-platform:
const BTN_TOUCH = "min-h-[44px]"; // WCAG compliant
```

### Pattern 3: Web Share API with Fallback
**What:** Use native share sheet on mobile, fallback to URL on desktop
**When to use:** Any share functionality on mobile browsers

**Implementation pattern:**
```typescript
async function shareOnMobile(text: string, url: string) {
  // Check for Web Share API (mobile browsers)
  if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    try {
      await navigator.share({
        title: 'K-Maru',
        text: text,
        url: url
      });
      return; // Success — native share sheet opened
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
      // Fall through to URL method
    }
  }
  
  // Desktop fallback: open LinkedIn share-offsite URL
  window.open(linkedInShareUrl, '_self');
}
```

### Pattern 4: Clipboard API with execCommand Fallback
**What:** Modern async clipboard with legacy fallback
**When to use:** Any copy-to-clipboard functionality

**Implementation pattern:**
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
    }
  }
  
  // Fallback: execCommand (works in older Safari, HTTP contexts)
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    document.body.removeChild(textarea);
    return false;
  }
}
```

**Key requirements:**
- Clipboard API requires **secure context** (HTTPS or localhost)
- **Transient user activation** required (must be called from click handler)
- execCommand fallback works without HTTPS but is deprecated

### Pattern 5: Platform-Specific Volume Defaults
**What:** Different default BGM volumes for mobile vs desktop
**When to use:** Audio that plays on both platforms

**Implementation:**
```typescript
function getDefaultVolume(): number {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isMobile ? 0.15 : 0.20; // 15% mobile, 20% desktop
}

// In useBackgroundMusic.ts
const VOLUME = {
  DEFAULT: getDefaultVolume(),
  // ...
} as const;
```

### Anti-Patterns to Avoid
- **Suspending shared AudioContext:** Never suspend a shared AudioContext — always use separate contexts or control volume at the GainNode level
- **44px on desktop:** Desktop doesn't need oversized touch targets — use responsive breakpoints
- **New tab for mobile share:** `target="_blank"` breaks in-app experience on mobile; use `target="_self"` or Web Share API
- **Clipboard without fallback:** Older Safari and non-HTTPS contexts need execCommand fallback

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile share sheet | Custom modal | Web Share API | Native integration, handles LinkedIn app automatically |
| Clipboard copy | `document.execCommand` only | Clipboard API + fallback | Modern API is async, better error handling |
| Platform detection | Complex UA parsing | Simple regex + feature detection | `/Mobi\|Android\|iPhone/i.test(navigator.userAgent)` is sufficient |
| Touch target sizing | JavaScript calculations | CSS min-height | Performant, handles dynamic content |
| Audio ducking | Custom volume logic | GainNode gain.value | Web Audio API provides precise control |

**Key insight:** Mobile browsers provide native APIs specifically designed for these use cases. Custom implementations inevitably miss platform nuances (e.g., iOS in-app browser restrictions, Android share sheet behavior).

---

## Common Pitfalls

### Pitfall 1: AudioContext Suspension Affects All Audio
**What goes wrong:** Suspending the BGM AudioContext also stops voice playback
**Why it happens:** Both BGM and voice use Web Audio API; if they share a context, suspension is global
**How to avoid:** Use separate AudioContexts (current codebase already does this), OR only control volume via GainNode without suspension
**Warning signs:** Voice stops when BGM is paused; audio resumes unexpectedly

### Pitfall 2: Clipboard API Fails Silently on HTTP
**What goes wrong:** `navigator.clipboard.writeText()` throws on non-HTTPS contexts
**Why it happens:** Clipboard API requires secure context
**How to avoid:** Always check `window.isSecureContext` and provide execCommand fallback
**Warning signs:** Copy works locally (HTTPS) but fails in production (HTTP) or specific browsers

### Pitfall 3: Web Share API Not Available on Desktop
**What goes wrong:** Calling `navigator.share()` on desktop throws TypeError
**Why it happens:** Web Share API is mobile-only in most browsers
**How to avoid:** Check `if (navigator.share)` before calling; provide URL fallback
**Warning signs:** Share button crashes on desktop browsers

### Pitfall 4: Inconsistent Button Heights in Flexbox
**What goes wrong:** Buttons with icons/text have different heights despite same classes
**Why it happens:** `h-[]` sets fixed height; content + padding can overflow; `min-h-[]` is safer
**How to avoid:** Use `min-h-[44px]` not `h-[44px]`; use `items-center` to vertically center content
**Warning signs:** Buttons look different heights visually despite same height class

### Pitfall 5: LinkedIn Deep Links Unreliable
**What goes wrong:** `linkedin://` URLs don't always open the app; user gets stuck
**Why it happens:** Deep links require app installation; timing issues with fallback
**How to avoid:** Use Web Share API as primary; linkedin:// as secondary; always have web URL fallback
**Warning signs:** Share button does nothing on devices without LinkedIn app installed

### Pitfall 6: Touch Targets Too Small (WCAG Violation)
**What goes wrong:** Buttons work on desktop but are hard to tap on mobile
**Why it happens:** Desktop-sized buttons (32-36px) don't meet mobile guidelines
**How to avoid:** Minimum 44px on mobile; use `min-h-[44px]` on mobile breakpoints
**Warning signs:** Users miss taps, accidental taps on adjacent elements

---

## Code Examples

### Audio Isolation (BGM Pause Doesn't Stop Voice)

```typescript
// Source: voicePlayback.ts (existing pattern)
let audioContext: AudioContext | null = null; // Separate from BGM

export function stopVoice(): void {
  // Only stops voice AudioContext
  if (currentSource) {
    currentSource.stop();
    currentSource = null;
  }
  emitVoiceActivity(false);
}

// In useBackgroundMusic.ts - ensure pause only affects BGM element
useEffect(() => {
  const el = audioRef.current;
  if (!el) return;
  if (!enabled) {
    el.pause(); // ONLY pauses BGM element
    return;
  }
  // ... resume/play logic
}, [enabled]);
```

### Mobile-Aware LinkedIn Share

```typescript
// Source: linkedin-share.ts (enhanced)
export async function shareLinkedIn(shareText: string, url: string): Promise<void> {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  
  // Try Web Share API on mobile first
  if (isMobile && navigator.share) {
    try {
      await navigator.share({
        title: 'K-Maru',
        text: shareText,
        url: url
      });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return; // User cancelled
      console.warn('Web Share failed:', err);
    }
  }
  
  // Fallback to LinkedIn share-offsite URL
  const shareUrl = encodeLinkedInShareUrl(url, shareText);
  window.open(shareUrl, isMobile ? '_self' : '_blank');
}
```

### Robust Clipboard Copy

```typescript
// Source: utils/clipboard.ts (new utility)
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern API (requires HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
    }
  }
  
  // Legacy fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch (err) {
    document.body.removeChild(textarea);
    return false;
  }
}
```

### Consistent Button Heights

```typescript
// Source: lib/buttonStyles.ts (enhanced)
// Current: min-h-[40px] md:min-h-[48px]
// Fixed: consistent mobile height
export const BTN_DEBRIEF_NAV = 
  "px-4 py-2 md:px-8 md:py-3 text-base font-bold tracking-wide " +
  "bg-white text-black hover:bg-cyan-400 hover:text-black " +
  "transition-all duration-300 " +
  "min-h-[44px] md:min-h-[48px] " + // 44px mobile, 48px desktop
  "flex items-center justify-center"; // Ensure vertical centering
```

### Platform-Specific Volume Defaults

```typescript
// Source: useBackgroundMusic.ts
function getDefaultVolume(): number {
  // Detect mobile for lower default volume
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isMobile ? 0.15 : 0.20;
}

const VOLUME = {
  DEFAULT: getDefaultVolume(), // 15% mobile, 20% desktop
  MIN: 0,
  MAX: 1,
  STEP: 0.05,
} as const;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | Clipboard API with fallback | 2020-2024 | Async, better error handling, requires HTTPS |
| `window.open('_blank')` for mobile share | Web Share API | 2019+ | Native share sheet, works with installed apps |
| Single AudioContext | Multiple AudioContexts | 2020+ | Independent control per audio pipeline |
| 32-36px touch targets | 44-48px minimum | 2020+ (WCAG 2.1) | Accessibility compliance |
| UA sniffing for features | Feature detection + UA | 2020+ | More robust, handles new browsers |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Use Clipboard API as primary
- `linkedin://` deep links as primary: Use Web Share API first
- Fixed height buttons (`h-[]`): Use `min-h-[]` for content flexibility
- Em dashes in UI copy: Use commas, colons for cleaner typography

---

## Open Questions

1. **iOS-specific audio behavior**
   - What we know: iOS Safari suspends AudioContext on page hide
   - What's unclear: Whether BGM pause interacts with voice context
   - Recommendation: Test on physical iOS device; current separation should work

2. **LinkedIn Web Share on Android**
   - What we know: Web Share opens native share sheet
   - What's unclear: Whether LinkedIn appears in share targets on all Android versions
   - Recommendation: Accept system behavior; fallback to URL if LinkedIn not in targets

3. **Em dash replacement strategy**
   - What we know: Need to replace "—" in debrief pages
   - What's unclear: Specific replacement for each instance
   - Recommendation: Use commas for pauses, colons for explanations, periods for breaks

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 |
| Config file | playwright.config.ts |
| Quick run command | `bun run test:smoke` |
| Full suite command | `bun run test` |
| Area test command | `bun run test:area:layout` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MOB-AUDIO-01 | Default volume 15% on mobile | unit | Vitest test for getDefaultVolume | ❌ Wave 0 |
| MOB-AUDIO-02 | Voice plays when BGM paused | e2e | `bun run test:file -- "audio-isolation"` | ❌ Wave 0 |
| MOB-UI-01 | Button heights equal on mobile | visual | `bun run test:visual --grep "debrief-buttons"` | ❌ Wave 0 |
| MOB-SHARE-01 | LinkedIn opens in-app | e2e | `bun run test:file -- "linkedin-in-app"` | ❌ Wave 0 |
| MOB-COPY-01 | Copy link works on mobile | e2e | `bun run test:file -- "clipboard-mobile"` | ❌ Wave 0 |
| COPY-01 | Copy text changed | unit | String match test | ❌ Wave 0 |
| COPY-02 | No em dashes in debrief | unit | Regex test for em dash character | ❌ Wave 0 |
| MOB-AUDIT-01 | Touch targets 44px+ | visual | Screenshot comparison test | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `bun run test:smoke` (~15s)
- **Per wave merge:** `bun run test:area:layout` + `bun run test:area:audio`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/mobile-audio-isolation.spec.ts` — covers MOB-AUDIO-02
- [ ] `tests/mobile-clipboard.spec.ts` — covers MOB-COPY-01
- [ ] `tests/mobile-linkedin-share.spec.ts` — covers MOB-SHARE-01
- [ ] `tests/mobile-button-heights.spec.ts` — covers MOB-UI-01
- [ ] `tests/em-dash-cleanup.spec.ts` — covers COPY-02
- [ ] Framework config: Use existing Playwright setup

---

## Sources

### Primary (HIGH confidence)
- `src/hooks/useBackgroundMusic.ts` — BGM implementation using Web Audio API
- `src/services/voicePlayback.ts` — Voice audio using separate AudioContext
- `src/utils/linkedin-share.ts` — LinkedIn sharing with mobile detection
- `src/components/game/IntroScreen.tsx` — Clipboard usage on intro page
- `src/components/game/debrief/DebriefPage3Verdict.tsx` — Button layout implementation
- `src/lib/buttonStyles.ts` — Button style constants

### Secondary (MEDIUM confidence)
- MDN Clipboard API documentation — https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- MDN Web Share API documentation — https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- WCAG 2.5.5 Target Size (Level AAA) — 44px minimum
- iOS Human Interface Guidelines — 44pt touch targets
- Android Material Design — 48dp touch targets

### Tertiary (LOW confidence)
- Historical issues with iOS AudioContext suspension (may be outdated as of iOS 17+)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All native APIs, well-documented
- Architecture: HIGH — Current codebase already uses correct patterns
- Pitfalls: MEDIUM-HIGH — Based on MDN docs and common mobile web issues

**Research date:** 2026-04-16
**Valid until:** 2026-07-16 (90 days for stable APIs)
