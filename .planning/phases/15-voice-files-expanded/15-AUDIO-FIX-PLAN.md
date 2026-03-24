---
phase: 15-voice-files-expanded
status: diagnosed
severity: blocker
discovered: 2026-03-25
---

# Phase 15: Voice Audio Corruption Analysis & Fix Plan

## Executive Summary

**CRITICAL BUG:** Multiple audio files have been corrupted through duplication of placeholder/fallback content instead of unique card-specific audio.

**Impact:** Players hear generic "Wisdom? In this building?" audio instead of card-specific Roaster feedback that matches the text shown in FeedbackOverlay.

**Files Affected:** 44+ audio files across feedback and death categories

---

## Root Cause

During audio generation pipeline (Phase 15-05), placeholder/generic audio files were created and subsequently duplicated to card-specific filenames instead of generating unique TTS audio for each card. This resulted in:

1. **14 HoS feedback files** are copies of `feedback_ignore.mp3` (generic fallback)
2. **21 Death ending files** (7 per personality × 3 personalities) are all identical copies
3. **Missing ZenMaster and Lovebomber feedback** - only Roaster has feedback folder

---

## Detailed Analysis

### 1. Feedback Audio Corruption (Roaster)

**Expected:** Each card should have unique audio matching its feedback text in `data/cards/*.ts`

**Actual:** Following files are **byte-for-byte identical** to `feedback_ignore.mp3`:

```
feedback_explainability_hos_2_left.mp3
feedback_explainability_hos_2_right.mp3
feedback_hos_copyright_team_blame_left.mp3
feedback_hos_copyright_team_blame_right.mp3
feedback_hos_explainability_politics_left.mp3
feedback_hos_explainability_politics_right.mp3
feedback_hos_model_drift_team_blame_left.mp3
feedback_hos_model_drift_team_blame_right.mp3
feedback_hos_prompt_injection_review_escape_left.mp3
feedback_hos_prompt_injection_review_escape_right.mp3
feedback_hos_team_burnout_deadline_left.mp3
feedback_hos_team_burnout_deadline_right.mp3
feedback_shadow_ai_hos_2_left.mp3
feedback_shadow_ai_hos_2_right.mp3
feedback_ignore.mp3 (the source)
```

**All 15 files have identical hash:** `3c0349487d72b539692d5705b7047e37be030f14345b16d3a8db1bb8040964bb`

**User Reports Confirmed:**
- ✅ "team loves you" → Plays "Wisdom? In this building..."
- ✅ "deadline missed" → Plays different audio than expected
- ✅ "legal is happy" → Plays "Wisdom? In this building..."
- ✅ "product will hate you" → Plays "Wisdom? In this building..."
- ✅ "compliance is happy" → Plays different audio than expected

### 2. Death Ending Audio Corruption (All Personalities)

**Expected:** Each death type should have unique narration (bankrupt, congress, prison, etc.)

**Actual:** All 7 death files per personality are **identical copies**:

**Roaster Death Files (all identical):**
- Hash: `e5c248c6f2b4e54f5f2c9b7923483ee66ed5d370064f51b5701e2bea8b0dc46f`
- Files: death_audit_failure, death_bankrupt, death_congress, death_fled_country, death_kirk, death_prison, death_replaced_by_script

**ZenMaster Death Files (all identical):**
- Hash: `fad331f2559b95ed6f9ad56c378107981687c1211debd12dbac9164f19a314ad`
- All 7 files identical

**Lovebomber Death Files (all identical):**
- Hash: `5c6ba55b014125ec9a0235b4b0cf34d0636eaea0b6728cc79bceda03a5b50019`
- All 7 files identical

### 3. Missing Feedback Audio (ZenMaster & Lovebomber)

**Current State:**
- `/public/audio/voices/roaster/feedback/` - 44 files (some valid, many corrupted)
- `/public/audio/voices/zenmaster/feedback/` - Empty folder
- `/public/audio/voices/lovebomber/feedback/` - Empty folder

**Expected:** Feedback audio should exist for all three personalities, but currently only Roaster has files (and many are corrupted).

### 4. Valid Audio Files (Confirmed Unique)

**Roaster Archetype Reveals:** ✅ All 7 files unique
**ZenMaster Archetype Reveals:** ✅ All 7 files unique
**Lovebomber Archetype Reveals:** ✅ All 7 files unique

**Roaster Core (onboarding/failure/victory):** ✅ Unique
**ZenMaster Core:** ✅ Unique
**Lovebomber Core:** ✅ Unique

**Valid HoS Feedback Files (unique hashes):**
- feedback_hos_managing_up_down_left/right
- feedback_hos_copyright_team_blame_left/right (Note: Script vs Card text mismatch)
- feedback_hos_team_burnout_deadline_left/right (Note: Script vs Card text mismatch)
- And 17 others with unique content

---

## Required Fixes

### Priority 1: Regenerate Corrupted HoS Feedback (15 files)

**Files to Regenerate:**
1. `feedback_explainability_hos_2_left/right`
2. `feedback_hos_copyright_team_blame_left/right` (fix text mismatch too)
3. `feedback_hos_explainability_politics_left/right`
4. `feedback_hos_model_drift_team_blame_left/right`
5. `feedback_hos_prompt_injection_review_escape_left/right`
6. `feedback_hos_team_burnout_deadline_left/right` (fix text mismatch too)
7. `feedback_shadow_ai_hos_2_left/right`

**Source Text:** Extract from `data/cards/head-of-something.ts` feedback[ROASTER]

### Priority 2: Regenerate All Death Endings (21 files)

**Roaster (7 files):**
- death_audit_failure
- death_bankrupt
- death_congress
- death_fled_country
- death_kirk
- death_prison
- death_replaced_by_script

**ZenMaster (7 files):**
- Same 7 death types

**Lovebomber (7 files):**
- Same 7 death types

**Source Text:** Death scripts defined in plan files (15-02-PLAN.md)

### Priority 3: Create ZenMaster & Lovebomber Feedback

**Scope:** All HoS cards (19 cards × 2 choices = 38 files per personality)

**Total New Files:** 76 (38 ZenMaster + 38 Lovebomber)

**Source Text:** Extract from `data/cards/head-of-something.ts` feedback[ZEN_MASTER] and feedback[LOVEBOMBER]

---

## Fix Strategy

### Approach A: Regenerate from Card Data (Recommended)

Create a unified script that:
1. Reads card data from `data/cards/head-of-something.ts`
2. Extracts feedback text for each personality
3. Generates TTS audio using Gemini API
4. Applies radio effects
5. Compresses to Opus + MP3

**Advantages:**
- Single source of truth (card data)
- Ensures audio matches displayed text
- Can generate for all personalities at once

### Approach B: Manual File-by-File

Regenerate individual files using existing scripts.

**Disadvantages:**
- Error-prone
- Time-consuming
- Risk of text/audio mismatch

---

## Verification Plan

After regeneration:

1. **Hash Verification:** All files should have unique SHA256 hashes
2. **Duration Check:** Files should be 3-8 seconds (not 4.77s like generic)
3. **Content Spot Check:** Listen to sample files to verify correct text
4. **Integration Test:** Play game and verify audio matches FeedbackOverlay text

---

## File Inventory

### Corrupted Files (Need Regeneration)

| Category | Count | Status |
|----------|-------|--------|
| HoS Feedback (Roaster) | 15 | Corrupted (generic fallback) |
| Death Endings (Roaster) | 7 | Identical copies |
| Death Endings (ZenMaster) | 7 | Identical copies |
| Death Endings (Lovebomber) | 7 | Identical copies |
| **Total Corrupted** | **36** | |

### Missing Files (Need Creation)

| Category | Count | Status |
|----------|-------|--------|
| HoS Feedback (ZenMaster) | 38 | Folder empty |
| HoS Feedback (Lovebomber) | 38 | Folder empty |
| **Total Missing** | **76** | |

### Valid Files (Keep)

| Category | Count | Status |
|----------|-------|--------|
| Roaster Archetype | 7 | ✓ Unique |
| ZenMaster Archetype | 7 | ✓ Unique |
| Lovebomber Archetype | 7 | ✓ Unique |
| Core Files (all personalities) | 9 | ✓ Unique |
| HoS Feedback (Roaster valid subset) | ~29 | ✓ Unique |
| **Total Valid** | **59** | |

---

## Implementation Tasks

### Task 1: Create Unified Generation Script
- [ ] Create `scripts/generate-all-feedback.ts`
- [ ] Read card data dynamically from TypeScript files
- [ ] Generate for all 3 personalities
- [ ] Include radio effects processing
- [ ] Auto-compress to Opus + MP3

### Task 2: Regenerate Corrupted Roaster Feedback
- [ ] Delete 15 corrupted MP3/Opus files
- [ ] Regenerate with correct text from card data
- [ ] Verify unique hashes

### Task 3: Regenerate All Death Endings
- [ ] Delete 21 corrupted MP3/Opus files
- [ ] Generate unique audio for each death type
- [ ] Create per-personality death scripts
- [ ] Verify unique hashes per file

### Task 4: Generate ZenMaster & Lovebomber Feedback
- [ ] Generate 38 files for ZenMaster
- [ ] Generate 38 files for Lovebomber
- [ ] Verify all files created

### Task 5: Update Voice Mapping (if needed)
- [ ] Check `useVoicePlayback.ts` handles new files
- [ ] Verify personality-specific triggers work
- [ ] Test in-game integration

### Task 6: Validation
- [ ] Hash verification: No duplicates
- [ ] Duration check: All files 3-8 seconds
- [ ] Integration test: Audio matches FeedbackOverlay text
- [ ] Manual playthrough: Spot-check 10+ cards

---

## Estimated Work

| Task | Files | Time Estimate |
|------|-------|---------------|
| Script Development | - | 30 min |
| Roaster Feedback Fix | 15 | 15 min (API calls) |
| Death Endings (all personalities) | 21 | 25 min |
| ZenMaster Feedback | 38 | 45 min |
| Lovebomber Feedback | 76 | 90 min |
| Validation & Testing | - | 30 min |
| **Total** | **~150** | **~4 hours** |

**Note:** Time estimates assume Gemini API quota available. If rate limited, work will need to be spread across multiple days.

---

## Risk Mitigation

1. **API Quota:** May need to process in batches across multiple days
2. **File Corruption:** Backup existing valid files before regeneration
3. **Text Mismatch:** Ensure script reads directly from card data, not hardcoded
4. **Integration Issues:** Test voice playback mapping after changes

---

## Success Criteria

- [ ] All 15 corrupted Roaster feedback files regenerated with correct text
- [ ] All 21 death ending files are unique (not identical copies)
- [ ] ZenMaster feedback folder has 38 files
- [ ] Lovebomber feedback folder has 38 files
- [ ] No duplicate SHA256 hashes in feedback/ or death/ folders
- [ ] Manual testing confirms audio matches FeedbackOverlay text
- [ ] User-reported issues (team loves you, deadline missed, etc.) resolved

---

*Analysis completed: 2026-03-25*
*Audio files verified via SHA256 hash comparison*
*Duration analysis via ffprobe*
