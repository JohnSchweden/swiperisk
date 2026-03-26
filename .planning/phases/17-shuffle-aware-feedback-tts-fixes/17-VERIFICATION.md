---
phase: 17-shuffle-aware-feedback-tts-fixes
verified: 2026-03-26T23:45:00Z
status: passed
score: 4/4 must-haves verified
---

# Phase 17: Shuffle-aware feedback TTS & content integrity — Verification

**Phase goal:** Fix Roaster feedback desync when shuffle swaps sides; align pressure with shuffled deck; dedupe HoS shadow content; relax roast prompt cadence.

## Must-haves

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| FA-01 | `choiceSidesSwapped` + `authoringFeedbackStem` | VERIFIED | `lib/deck.ts`, `lib/feedbackAudioChoice.ts`; [17-01-SUMMARY.md](17-01-SUMMARY.md) |
| FA-02 | `effectiveDeck` currentCard; overlay stem → voice | VERIFIED | `App.tsx`, `useVoicePlayback`; [17-02-SUMMARY.md](17-02-SUMMARY.md) |
| FA-03 | Single HoS shadow scenario id; lists + audio synced | VERIFIED | `head-of-something.ts` → `shadow_ai_hos_1`; `hos_shadow_ai_team_discovery` gone from runtime + scripts; orphan `feedback_hos_shadow_ai_team_discovery_*` deleted; `incident-sources.test.ts` pass |
| FA-04 | `geminiLive` + `api/roast` varied cadence | VERIFIED | No `1-3 sentences` / `Keep it under 50 words`; [unit/roastPromptCopy.test.ts](../../../unit/roastPromptCopy.test.ts) |

## Automated checks (17-03 execution)

- `bun run test:smoke` — pass
- `bun run test:area:audio` — pass
- `bun run vitest:run -- unit/roastPromptCopy.test.ts` — pass

## Known non-blocker

- `bun run test:data` — fails `real-world-reference.test.ts` outcome length assertions (existing debt, not introduced by phase 17).

## Human verification (optional)

- Head of Something + Roaster: hit the Samsung / shadow-compliance card and confirm feedback audio plays (`feedback_shadow_ai_hos_1_*`).
