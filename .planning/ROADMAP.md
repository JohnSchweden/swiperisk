# Roadmap: hyperscale v1.1

**Milestone:** v1.1 — Roaster Voice Files
**Goal:** Generate and integrate voice files for Roaster personality (Development role only)

---

## Overview

v1.1 implements voice playback for the Roaster (V.E.R.A.) personality in the Development clearance level only.

**Scope:**
- Only ROASTER personality
- Only DEVELOPMENT role (role type)
- All triggers: onboarding, victory, failure, AND feedback after each card swipe

**Total voice files:** 7
- 1 onboarding
- 4 feedback (after each card swipe: Paste, Debug, Install, Ignore)
- 1 victory
- 1 failure

---

## Phase 1: Roaster Voice Files (Development Role)

**Goal:** Generate and integrate 7 voice files for Roaster personality

**Dependencies:** None

**Requirements:**
- VOICE-01: Generate Roaster onboarding voice file
- VOICE-02: Generate 4 Roaster feedback voice files (Paste, Debug, Install, Ignore)
- VOICE-03: Generate Roaster victory voice file
- VOICE-04: Generate Roaster failure voice file
- VOICE-05: Create voice playback system for pre-recorded audio
- VOICE-06: Integrate voice playback with game triggers
- VOICE-07: Test voice playback

**Success Criteria:**
1. Audio file exists for Roaster onboarding message
2. Audio files exist for 4 feedback messages (one per card swipe)
3. Audio file exists for Roaster victory message
4. Audio file exists for Roaster failure message
5. Voice playback system plays audio files (not TTS)
6. Game triggers voice at: ROLE_SELECT entry, after each card swipe, SUMMARY, GAME_OVER
7. Development role correctly plays Roaster voice for all 7 triggers

---

## Voice Messages for Roaster (Development)

| Trigger | Text |
|---------|------|
| Onboarding | "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?" |
| Feedback: Paste | "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'." |
| Feedback: Debug | "Slow. Boring. But legal. I suppose I can't fire you for this." |
| Feedback: Install | "You just installed a keylogger for a 3ms speed boost. I hope you're happy." |
| Feedback: Ignore | "Wisdom? In this building? I must be malfunctioning." |
| Victory | "I... don't hate it. Adequate performance. Here's a badge. Now leave." |
| Failure | "Well, you managed to violate basic common sense. The legal team is crying. Pathetic." |

---

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 - Roaster Voice Files | 7 voice files + playback system | VOICE-01 to VOICE-07 | Pending |

---

## Coverage

**Requirements mapped:** 7/7 ✓

| Requirement | Phase |
|-------------|-------|
| VOICE-01 | Phase 1 |
| VOICE-02 | Phase 1 |
| VOICE-03 | Phase 1 |
| VOICE-04 | Phase 1 |
| VOICE-05 | Phase 1 |
| VOICE-06 | Phase 1 |
| VOICE-07 | Phase 1 |

---

## Deferred to v1.2

- ZEN_MASTER (Bamboo) voice files
- LOVEBOMBER (Hype-Bro) voice files
- Feedback voice messages for other roles (Marketing, Management, HR, Finance, Legal)
- Visual effects
- Background audio

---

*Roadmap created: 2026-02-28*
*Last updated: 2026-02-28 after adding feedback messages for Roaster*
