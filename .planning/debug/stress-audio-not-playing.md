---
status: diagnosed
trigger: "High-pressure states trigger audible stress cues (heartbeat/alert) without flooding the user - nothing to hear"
created: "2025-03-06T00:00:00.000Z"
updated: "2025-03-06T00:00:00.000Z"
---

## Current Focus

hypothesis: ctx.resume() is called but not awaited; audio plays before context resumes
test: Compared pressureAudio.ts to voicePlayback.ts resume pattern
expecting: pressureAudio lacks await; voicePlayback uses await ctx.resume()
next_action: N/A — root cause confirmed

## Symptoms

expected: Heartbeat/alert audio plays when heat high; stops when pressure drops.
actual: "nothing to hear"
errors: None reported
reproduction: Test 5 in UAT — Phase 04
started: Discovered during UAT

## Eliminated

## Evidence

- timestamp: 2025-03-06
  checked: services/pressureAudio.ts playPulse(), startAlert()
  found: ctx.resume() called when ctx.state === "suspended" but NOT awaited; playback proceeds immediately
  implication: AudioContext.resume() returns Promise; scheduled nodes do not produce sound until resume completes
- timestamp: 2025-03-06
  checked: services/voicePlayback.ts loadVoice()
  found: await ctx.resume() before playing (lines 72-74)
  implication: Project pattern for autoplay compliance is to await resume; pressureAudio violates it
- timestamp: 2025-03-06
  checked: .planning/phases/04-immersive-pressure-effects/04-RESEARCH.md Pitfall 2
  found: "Browsers require user gesture before AudioContext can play"; "Reuse same getOrCreateContext() pattern; trigger heartbeat only after a user interaction"
  implication: Research warned about suspended context; implementation calls resume but doesn't wait

## Resolution

root_cause: pressureAudio.ts calls ctx.resume() when AudioContext is suspended but does not await the Promise. Oscillator nodes are created and started immediately while the context is still suspended; per Web Audio spec, scheduled audio does not play until the context is running.
fix: Await ctx.resume() before creating/starting oscillators. Make playPulse/startHeartbeat/startAlert async or add an explicit resume-before-play step.
verification: After fix, heartbeat should be audible when hasHighPressure && isActive.
files_changed: []
