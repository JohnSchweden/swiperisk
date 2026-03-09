# Phase 12: Plan Adjustment Summary

**Date:** 2026-03-09
**Reason:** Roadmap alignment — remove out-of-scope card addition plans
**Commits:** `1b65a97` (ROADMAP.md update)

---

## Decision

**Phase 12 scope:** Infrastructure only (shuffle, branching, AppSource enum expansion)

**Plans removed:** 12-02-PLAN.md, 12-03-PLAN.md (card content additions)

**Plans kept:** 12-00-PLAN.md, 12-01-PLAN.md (both wave 1, no dependencies)

---

## Analysis

### Roadmap vs. Reality

**Roadmap specification (Phase 12):**
```
Goal: Shuffle deck, branching logic, and expanded AppSource for scenario variety
Plans: 2 plans
- 12-00-PLAN.md — Shuffle deck + branching
- 12-01-PLAN.md — AppSource enum + SOURCE_ICONS + rendering
```

**Actual plans created (4 total):**
- 12-00: Shuffle + Branching (TDD, Wave 1) ✓ Roadmap-aligned
- 12-01: AppSource + SOURCE_ICONS (TDD, Wave 1) ✓ Roadmap-aligned
- 12-02: New dev/management/finance cards (Wave 2) ✗ NOT in roadmap
- 12-03: New marketing/hr/cleaning cards (Wave 2) ✗ NOT in roadmap

### Why Remove 12-02 and 12-03

1. **Scope clarity**: The roadmap explicitly states Phase 12 is about mechanics (shuffle, branching, app source infrastructure) and cosmetics (icons). It says "Phase 03/05 cards use these when added" — meaning card content belongs elsewhere.

2. **Dependency correctness**: Card additions (12-02, 12-03) depend on 12-01's AppSource infrastructure, but they're not part of the stated Phase 12 goal. They inflate Phase 12's scope unnecessarily.

3. **Wave structure**: Removing the Wave 2 card plans makes Phase 12 fully parallel (both plans wave 1, no internal dependencies). Card work can be grouped into Phase 03 or Phase 05 later.

4. **Precedent**: Phase 03 (No-Win Scenario Cards) already exists as the home for thematic card additions. Phase 05 (Expanded AI Risk Scenarios) covers new incident types. Phase 12 should stay focused on foundational mechanics.

---

## Changes Made

### Files Deleted

- `.planning/phases/12-gameplay-tweaks-and-card-variety/12-02-PLAN.md`
  - Was: Add new dev/management/finance cards using Phase 12 sources (Wave 2)
  - Reason: Out of scope; belongs in Phase 03 or 05

- `.planning/phases/12-gameplay-tweaks-and-card-variety/12-03-PLAN.md`
  - Was: Add new marketing/hr/cleaning cards using Phase 12 sources (Wave 2)
  - Reason: Out of scope; belongs in Phase 03 or 05

### Files Updated

- `.planning/ROADMAP.md` (Phase 12 section)
  - Clarified "App source infrastructure" language
  - Added explicit note: "Card additions using new sources belong in Phase 03 or Phase 05"
  - Updated Progress table: Phase 12 now "Planned (2 plans)"

### Files Unchanged

- `12-00-PLAN.md` — Still valid (Shuffle + Branching)
- `12-01-PLAN.md` — Still valid (AppSource infrastructure)
- `12-RESEARCH.md` — Still valid (informs both plans)

---

## Wave Structure (Final)

**Phase 12:**

```
Wave 1 (parallel):
  - 12-00: Shuffle + Branching (TDD, no dependencies)
  - 12-01: AppSource enum + icons (TDD, no dependencies)

No Wave 2 (card work deferred).
```

**Dependency graph:**

```
12-00 ──────┐
            └──> [Phase 12 complete]
12-01 ──────┘
```

Both plans are independent and can execute in parallel.

---

## Future: Where Card Additions Belong

### Phase 03 (No-Win Scenario Cards)

**Current status:** Not started, depends on Phase 02

**Good fit for:**
- New "both options bad" cards that use the AppSource infrastructure from Phase 12
- Role-specific no-win scenarios
- Could use JIRA, NOTION, MEETING sources to feel more varied

**Expected scope:** Design 6+ no-win cards across roles (from ROADMAP).

### Phase 05 (Expanded AI Risk Scenarios)

**Current status:** Not started, depends on Phase 03

**Good fit for:**
- Prompt injection, model drift, explainability, shadow AI cards
- New app surfaces that make sense for these risk types
- Role-integrated expansions

**Expected scope:** 2+ incidents per risk type across role decks (from ROADMAP).

---

## Verification Checklist

- [x] All 4 existing plans reviewed in context of roadmap ✓
- [x] Decision made: consolidate plans → no, remove 12-02/12-03 ✓
- [x] Out-of-scope plans deleted from disk ✓
- [x] Roadmap.md updated with clarification and notes ✓
- [x] Wave structure verified (Wave 1 only, both parallel) ✓
- [x] Plans remain executable without further adjustment ✓
- [x] Git commit created with change log ✓

---

## Ready to Execute

Phase 12 plans are ready for execution:

```bash
# Execute Phase 12 (2 plans, both wave 1)
/gsd:execute-phase 12
```

**Next phases for card work:**
- Phase 03: `/gsd:plan-phase 03` (no-win cards)
- Phase 05: `/gsd:plan-phase 05` (expanded risk scenarios)
