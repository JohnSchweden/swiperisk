---
phase: 17-shuffle-aware-feedback-tts-fixes
plan: "03"
subsystem: content
tags: [hos, audio, roast, prompts]

requires:
  - phase: "17-02"
    provides: Choice/outcome-aware feedback clip resolution before asset edits
provides:
  - HoS Samsung/shadow-compliance card id canonicalized as `shadow_ai_hos_1` (replaces duplicate `hos_shadow_ai_team_discovery` id on same scenario)
  - `CRITICAL_HOS_CARDS`, export audit set, `generate-hos-remaining`, death-vector map, `card-sources.json` aligned
  - Orphan `feedback_hos_shadow_ai_team_discovery_*.{opus,mp3}` removed
  - `geminiLive` + `api/roast` cadence copy varied; `unit/roastPromptCopy.test.ts` guards prompt literals

key-files:
  created:
    - unit/roastPromptCopy.test.ts
  modified:
    - data/cards/head-of-something.ts
    - hooks/useVoicePlayback.ts
    - scripts/export-card-content-audit.ts
    - scripts/generate-hos-remaining.ts
    - scripts/annotate-death-vectors.mjs
    - tests/data/card-sources.json
    - services/geminiLive.ts
    - api/roast.ts
    - exports/card-incident-audio-audit.csv
    - exports/card-incident-audio-audit.xlsx

requirements-completed: [FA-03, FA-04]

duration: session
completed: "2026-03-26"
---

# Phase 17 Plan 03: HoS dedupe, assets, roast cadence

**Single in-deck id `shadow_ai_hos_1` for the duplicate shadow-AI compliance scenario; tooling and critical sets no longer reference `hos_shadow_ai_team_discovery`. Orphan pre-baked clips for the old id removed. Live + HTTP roast prompts ask for varied rhythm instead of fixed “1–3 sentences” / rigid short cap.**

## Verification run

- `bun run typecheck`
- `bun run vitest:run -- unit/roastPromptCopy.test.ts`
- `bun run vitest:run -- tests/data/incident-sources.test.ts`
- `bun run test:area:audio`
- `bun run test:smoke`
- `bun scripts/export-card-content-audit.ts`

**Note:** `bun run test:data` still fails `tests/data/real-world-reference.test.ts` (outcome description length) — pre-existing; unrelated to 17-03.

## Self-Check: PASSED

- No runtime `hos_shadow_ai_team_discovery` in `.ts/.tsx/.mjs` / `card-sources.json`
- `feedback_shadow_ai_hos_1_{left,right}.{opus,mp3}` present under `public/audio/voices/roaster/feedback/`
