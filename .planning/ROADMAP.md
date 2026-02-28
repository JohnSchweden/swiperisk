# Roadmap: hyperscale v1.1

**Milestone:** v1.1 — Roaster Voice Files
**Goal:** Generate and integrate voice files for Roaster personality (Development role only)

---

## Overview

v1.1 implements voice playback for the Roaster (V.E.R.A.) personality in the Development clearance level only.

**Scope:**
- Only ROASTER personality
- Only DEVELOPMENT role (role type)
- Only onboarding, victory, failure triggers
- Feedback messages after card swipes deferred

**Total voice files:** 3 (onboarding, victory, failure)

---

## Phase 1: Roaster Voice Files (Development Role)

**Goal:** Generate and integrate 3 voice files for Roaster personality

**Dependencies:** None

**Requirements:**
- VOICE-01: Generate Roaster onboarding voice file
- VOICE-02: Generate Roaster victory voice file
- VOICE-03: Generate Roaster failure voice file
- VOICE-04: Create voice playback system for pre-recorded audio
- VOICE-05: Integrate voice playback with game triggers
- VOICE-06: Test voice playback

**Success Criteria:**
1. Audio file exists for Roaster onboarding message
2. Audio file exists for Roaster victory message
3. Audio file exists for Roaster failure message
4. Voice playback system plays audio files (not TTS)
5. Game triggers voice at: ROLE_SELECT entry, SUMMARY, GAME_OVER
6. Development role correctly plays Roaster voice

---

## Voice Messages for Roaster (Development)

| Trigger | Text |
|---------|------|
| Onboarding | "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?" |
| Victory | "I... don't hate it. Adequate performance. Here's a badge. Now leave." |
| Failure | "Well, you managed to violate basic common sense. The legal team is crying. Pathetic." |

---

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 - Roaster Voice Files | 3 voice files + playback system | VOICE-01 to VOICE-06 | Pending |

---

## Coverage

**Requirements mapped:** 6/6 ✓

| Requirement | Phase |
|-------------|-------|
| VOICE-01 | Phase 1 |
| VOICE-02 | Phase 1 |
| VOICE-03 | Phase 1 |
| VOICE-04 | Phase 1 |
| VOICE-05 | Phase 1 |
| VOICE-06 | Phase 1 |

---

## Deferred to v1.2

- ZEN_MASTER (Bamboo) voice files
- LOVEBOMBER (Hype-Bro) voice files
- Feedback voice messages after card swipes
- Other clearance levels (Marketing, Management, HR, Finance, Legal)
- Visual effects
- Background audio

---

*Roadmap created: 2026-02-28*
*Last updated: 2026-02-28 after scope reduced to Roaster only*
