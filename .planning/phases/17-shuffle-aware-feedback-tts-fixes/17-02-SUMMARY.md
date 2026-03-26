---
phase: 17-shuffle-aware-feedback-tts-fixes
plan: "02"
subsystem: app
tags: [tts, feedback, effectiveDeck, voice, webmcp]

requires:
  - phase: "17-01"
    provides: choiceSidesSwapped, authoringFeedbackStem
provides:
  - Playing currentCard from effectiveDeck ?? ROLE_CARDS
  - feedbackAuthoringStem on overlay → useVoicePlayback for Roaster clips
affects:
  - Incident pressure uses same Card instance as CardStack

key-files:
  created: []
  modified:
    - App.tsx
    - hooks/useVoicePlayback.ts
    - hooks/useWebMCPTools.ts

requirements-completed: [FA-02]

duration: prior-session
completed: "2026-03-26"
---

# Phase 17 Plan 02: Choice-aware feedback wiring

**Wires `effectiveDeck` for playing `currentCard`, computes `authoringFeedbackStem` in `applyChoice`, and passes it through `useVoicePlayback` so pre-baked clips match the authoring arm of the visible choice (including shuffle swaps). WebMCP exposes the stem for dev tooling.**

## Task commits (on branch)

1. **effectiveDeck currentCard** — `70c230f`
2. **Overlay + voice** — `e0142db`
3. **WebMCP overlay typing** — `d666c91`

## Self-Check: PASSED

- `App.tsx` derives `currentCard` from `effectiveDeck ?? ROLE_CARDS` when `PLAYING`
- `setFeedbackOverlay` includes `feedbackAuthoringStem: authoringFeedbackStem(card, direction)`
- `useVoicePlayback` consumes `feedbackAuthoringStem` for `feedbackVoiceTrigger`
