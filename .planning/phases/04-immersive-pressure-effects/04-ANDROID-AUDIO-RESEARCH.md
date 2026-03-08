# Android Chrome Web Audio Research

**Date:** 2026-03-08  
**Context:** Phase 04 UAT — no heartbeat audio at all on Android Chrome. Resume-on-first-touch fix did NOT help.

## Problem

- Desktop: heartbeat plays when heat high ✓
- Android Chrome: no heartbeat at all ✗
- User: "Resume is not the issue"

## Research Findings

### Chrome Autoplay Policy (M71+)

- AudioContext starts suspended; must resume or create within user gesture
- Chrome auto-resumes when: (1) `sourceNode.start()` called, (2) user has interacted
- First sound may need to be triggered synchronously in gesture handler

### Repos / Solutions That Work on Android

| Source | Approach | Notes |
|--------|----------|-------|
| **howler.js PR #756** | Call `ctx.resume()` from user gesture stack | Fix for cross-origin iframes; resume in touch/click |
| **howler.js PR #1008** | HTML5 Audio pool for mobile | Fallback when Web Audio unlock fails |
| **Chrome Blog (autoplay)** | Proxy AudioContext, resume all on first user input | 10 event types: click, touchend, keydown, etc. |
| **StackOverflow** | Create oscillator + start() in same click handler | `button.addEventListener('click', () => { osc.start(0); });` |

### Hypotheses for Our Failure

1. **First sound not in gesture:** Our `playPulse` runs from `setInterval` (triggered by useEffect). That's async—outside the touch handler. Chrome may require the first `oscillator.start()` to occur synchronously in the gesture.

2. **Gain automation:** Some Android builds have issues with `gain.linearRampToValueAtTime` before oscillator starts. Use direct `gain.value = x` instead.

3. **Context created too early:** We create AudioContext on first render (no gesture). Could try creating context only after first touch.

4. **Event listener not firing on Android:** `touchend`/`click` with `once: true` on document—maybe Android handles this differently (iframe, overlay, etc.)?

### Recommended Approaches to Test

**A. First sound in gesture (sync)**  
- In resume handler: after `ctx.resume()`, immediately call `playPulse()` (or a short unlock beep) in the same synchronous handler. First actual sound created and started in gesture.

**B. Create context in gesture**  
- Don't create session on mount. Create on first touch; then start heartbeat when hasHighPressure.

**C. HTML5 Audio fallback**  
- Pre-render heartbeat to short WAV/MP3 or use base64. Play via `<audio>` or `new Audio()`. Howler uses this for mobile when Web Audio fails.

**D. Howler.js / Tone.js**  
- Use library that handles Android edge cases. Adds dependency; may be overkill for single heartbeat sound.

## References

- [Chrome: Web Audio, Autoplay Policy and Games](https://developer.chrome.com/blog/web-audio-autoplay)
- [howler.js PR #756](https://github.com/goldfire/howler.js/pull/756) — resume from user gesture
- [howler.js PR #1008](https://github.com/goldfire/howler.js/pull/1008) — HTML5 Audio pool for mobile
- [StackOverflow: createOscillator not working Android](https://stackoverflow.com/questions/57162255/)
- [Chrome Autoplay Policy](https://www.chromium.org/audio-video/autoplay/)
