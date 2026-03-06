# Phase 04: Immersive Pressure Effects - Research

**Researched:** 2026-03-06
**Domain:** React game stress cues — countdown, visual effects, procedural audio, haptics, outcome metadata
**Confidence:** MEDIUM

## Summary

Phase 04 adds psychological pressure through five channels: optional countdown timers, visual stress indicators (shake, flicker, red pulse), audio stress cues (heartbeat, alerts), team-impact text on outcomes, and haptic feedback on mobile. The codebase already has `useCountdown`, heat/budget/hype in `GameState`, `GameHUD` with `animate-pulse` for thresholds, and a Web Audio pipeline (voicePlayback, radioEffect) that uses AudioContext. A partial plan (`04-01-PLAN.md`) defines `pressureScenarios.ts`, `useIncidentPressure`, and `PressureCueController`.

**Key technical decisions:** Use existing `useCountdown` for urgent incidents; implement shake/flicker/pulse with pure CSS keyframes (no animation lib); extend Web Audio API for procedural heartbeat/alert; use `navigator.vibrate()` with feature detection (Safari/iOS = no-op); extend outcome payload with optional `teamImpact`; gate stress effects behind `prefers-reduced-motion` for accessibility.

**Primary recommendation:** Implement in waves: (1) pressure metadata + useIncidentPressure + timer/undo orchestration (04-01-PLAN); (2) visual stress (CSS shake, flicker, pulse); (3) audio stress (procedural heartbeat, alert); (4) FeedbackOverlay team-impact; (5) haptics with graceful degradation.

## Standard Stack

The project has no animation libraries. Use native APIs and CSS.

### Core (Existing / Native)
| Library/API | Version | Purpose | Why Standard |
|-------------|---------|---------|--------------|
| useCountdown | (hooks/) | Countdown timer for urgent incidents | Already exists; 04-01-PLAN references it |
| Web Audio API | Native | Heartbeat, alert sounds | Project already uses AudioContext for voice; extend with OscillatorNode + GainNode |
| Vibration API | Native | Haptic feedback on critical moments | `navigator.vibrate()`; feature-detect, no-op on unsupported |
| CSS animations | Native | Shake, flicker, pulse | No dependency; GPU-accelerated with `transform` |

### Supporting
| Library/API | Purpose | When to Use |
|-------------|---------|-------------|
| `prefers-reduced-motion` | Accessibility | Gate all stress animations; use `matchMedia` or custom hook |
| Tailwind `animate-pulse` | Budget/heat/hype pulse | Already used in GameHUD; extend for escalation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS keyframes | framer-motion | CSS = zero deps; framer-motion = heavier, more flexible |
| Procedural heartbeat | Pre-recorded WAV | Procedural = no asset; WAV = simpler, higher quality |
| navigator.vibrate | — | No Safari/iOS alternative; graceful no-op required |

**Installation:** No new dependencies required.

## Architecture Patterns

### Recommended Project Structure (from 04-01-PLAN)

```
data/
  pressureScenarios.ts   # Urgency, countdown, team-impact per card/outcome
hooks/
  useCountdown.ts        # Existing
  useIncidentPressure.ts # Derived pressure state from card + heat/budget
  usePrefersReducedMotion.ts  # Optional: gate stress effects
components/game/
  PressureCueController.tsx   # Mounted in App; drives visuals/audio/haptics
  FeedbackOverlay.tsx         # Extend with teamImpact prop
```

### Pattern 1: Pressure State Derivation

**What:** Single hook derives `isUrgent`, `countdownSeconds`, `isCritical`, `teamImpact` from current card + heat/budget/hype.

**When to use:** Before rendering timer, overlay, or stress cues.

**Example:**

```typescript
// hooks/useIncidentPressure.ts
export function useIncidentPressure(state: GameState): PressureState {
  const card = state.role ? ROLE_CARDS[state.role]?.[state.currentCardIndex] : null;
  const meta = card ? PRESSURE_SCENARIOS[card.id] : null;
  const isUrgent = !!meta?.urgent;
  const isCritical = state.heat >= 80 || state.budget < 2000000;
  return {
    isUrgent,
    countdownSeconds: meta?.countdownSeconds ?? 0,
    isCritical,
    teamImpact: meta?.teamImpact?.[state.personality ?? "ROASTER"],
  };
}
```

### Pattern 2: CSS Shake (No Library)

**What:** `@keyframes` + `transform: translate3d()` for screen shake.

**Source:** [CSS-Tricks](https://css-tricks.com/snippets/css/shake-css-keyframe-animation/)

```css
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
.element { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
```

### Pattern 3: Procedural Heartbeat (Web Audio API)

**What:** Low-frequency oscillator with envelope for "lub-dub" thump.

```typescript
// Source: Web Audio patterns (MDN, procedural audio guides)
function playHeartbeat(ctx: AudioContext): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 60; // low thump
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}
```

### Pattern 4: Haptic with Fallback

**What:** Feature-detect `navigator.vibrate`; call only after user gesture.

```typescript
// Source: MDN Vibration API
export function triggerHaptic(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
// Usage: triggerHaptic([100, 50, 100]) for double-tap feel
```

### Anti-Patterns to Avoid

- **Animating layout properties (top, left):** Use `transform` only for shake/flicker for GPU acceleration.
- **Ignoring prefers-reduced-motion:** Vestibular-sensitive users need an out; gate or reduce stress effects.
- **Assuming vibrate works everywhere:** Safari/iOS = no support; do not show "haptics enabled" UI; silent no-op.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Countdown timer | Custom setInterval loop | `useCountdown` | Exists; handles reset, onComplete, isActive |
| Shake animation | Custom JS animation loop | CSS @keyframes | GPU-accelerated, no layout thrash |
| Heartbeat audio | Complex synthesis | Web Audio OscillatorNode + GainNode envelope | Project already uses AudioContext; simple envelope suffices |
| Vibration polyfill | — | None exists for Safari | Use native API, no-op where unsupported |

**Key insight:** The project already has the building blocks (AudioContext, useCountdown, GameState). Extend, don't rebuild.

## Common Pitfalls

### Pitfall 1: Double Choice on Timer Expiry

**What goes wrong:** Countdown hits 0, `onComplete` fires, and a swipe also registers; choice processed twice.

**Why it happens:** Race between timer callback and gesture handler.

**How to avoid:** 04-01-PLAN: "prevent duplicate choice handling while a choice is resolving." Use a `isResolving` flag: set true when choice or timeout fires; clear after `nextIncident`; block all choice paths while true.

**Warning signs:** Duplicate entries in `state.history`, feedback overlay showing twice.

### Pitfall 2: AudioContext Suspended on Mobile

**What goes wrong:** Heartbeat/alert does not play; user tapped but nothing happens.

**Why it happens:** Browsers require user gesture before AudioContext can play.

**How to avoid:** Project already resumes context in `voicePlayback.ts` (`ctx.resume()` when suspended). Reuse same `getOrCreateContext()` pattern; trigger heartbeat only after a user interaction (card reveal, swipe, button).

**Warning signs:** Silent stress cues on first load before any tap.

### Pitfall 3: Stress Effects for Vestibular Users

**What goes wrong:** Screen shake triggers nausea or discomfort.

**Why it happens:** `prefers-reduced-motion: reduce` exists for this.

**How to avoid:** `matchMedia('(prefers-reduced-motion: reduce)').matches` — if true, skip shake/flicker; optionally reduce pulse intensity. Keep haptics (they are not motion).

**Warning signs:** Accessibility complaints; users disabling effects if settings added later.

### Pitfall 4: Vibration Without User Activation

**What goes wrong:** `navigator.vibrate()` does nothing or throws.

**Why it happens:** Some browsers require recent user interaction (same as AudioContext).

**How to avoid:** Call `vibrate` only in response to tap, swipe, or button click (gameplay already satisfies this).

### Pitfall 5: Heat/Budget Threshold Mismatch

**What goes wrong:** Stress cues fire at wrong times; HUD and PressureCueController disagree.

**Why it happens:** Different magic numbers in different files.

**How to avoid:** Centralize thresholds (e.g. `HEAT_CRITICAL = 80`, `BUDGET_CRITICAL = 2_000_000`) in one constants module; both GameHUD and useIncidentPressure import from it.

## Code Examples

### Countdown Integration (useCountdown)

```typescript
// Existing: hooks/useCountdown.ts
const { count, reset } = useCountdown({
  startFrom: pressure.countdownSeconds,
  onComplete: () => handleTimeoutResolve(),
  isActive: pressure.isUrgent && state.stage === GameStage.PLAYING && !feedbackOverlay,
});
```

### Red Pulse / Flicker (Tailwind + CSS)

```css
@keyframes stress-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 20px 4px rgba(239, 68, 68, 0.6); }
}
@keyframes stress-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

```tsx
<div className={isCritical && !reducedMotion ? "animate-[stress-pulse_1.5s_ease-in-out_infinite]" : ""}>
```

### Team Impact in FeedbackOverlay

```tsx
{teamImpact && (
  <div className="text-amber-400/90 text-sm mt-3 border-t border-white/10 pt-3">
    Team impact: {teamImpact}
  </div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS setInterval for timers | useCountdown hook | Existing | Cleaner lifecycle |
| Inline magic numbers | Central thresholds | Phase 04 | Consistency |
| No reduced-motion | matchMedia gate | Phase 04 | Accessibility |

**Deprecated/outdated:**
- reshake/CSShake: Adds styled-components or CDN; pure CSS is sufficient.
- Heavy procedural audio libs (Tone.js): Overkill for heartbeat/alert; Web Audio native is enough.

## Open Questions

1. **Pre-recorded vs procedural heartbeat**
   - What we know: Procedural is zero-asset; project uses pre-recorded voice WAVs.
   - What's unclear: Whether a 200ms thump needs to be "real" heartbeat quality.
   - Recommendation: Start procedural; swap to WAV if quality feedback demands it.

2. **Siren/alert sound**
   - What we know: Oscillator + quick envelope works for beeps.
   - What's unclear: Whether to match "radio" Quindar style or generic alert.
   - Recommendation: Reuse radioEffect oscillator pattern for consistency.

3. **Optional countdown UX**
   - What we know: "Optional" per ROADMAP; 04-01-PLAN says "only incidents explicitly marked urgent."
   - What's unclear: User toggle to disable countdown globally?
   - Recommendation: No global toggle for v1.2; card-level urgency only. Add settings in Phase 11 if needed.

## Sources

### Primary (HIGH confidence)
- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) — vibrate usage, cancellation
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — media query
- [CSS-Tricks shake keyframes](https://css-tricks.com/snippets/css/shake-css-keyframe-animation/) — vanilla CSS shake
- Project: hooks/useCountdown.ts, hooks/useGameState.ts, services/radioEffect.ts, services/voicePlayback.ts, components/game/GameHUD.tsx
- Project: .planning/phases/04-immersive-pressure-effects/04-01-PLAN.md

### Secondary (MEDIUM confidence)
- Web Audio procedural patterns — oscillator + gain envelope for heartbeat
- WebSearch: iOS Safari no vibrate — confirmed, use fallback
- WebSearch: usePrefersReducedMotion — standard hook pattern

### Tertiary (LOW confidence)
- reshake/CSShake — alternative; not needed given CSS approach

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM — useCountdown and Web Audio verified in codebase; CSS patterns from CSS-Tricks
- Architecture: MEDIUM — 04-01-PLAN provides structure; pressure hook design inferred
- Pitfalls: HIGH — double-choice, AudioContext, vibrate limitations documented in MDN

**Research date:** 2026-03-06
**Valid until:** ~30 days (stable domain)
