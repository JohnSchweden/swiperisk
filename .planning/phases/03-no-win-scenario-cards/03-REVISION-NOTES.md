# Phase 03 Revision Summary: 10 New Role Cards

## The Problem

The original Phase 03 plans (03-01 through 03-05) were written for the **OLD 6 legacy roles** (DEVELOPMENT, FINANCE, HR, MANAGEMENT, MARKETING, CLEANING). However, Phase 02 replaced these with **10 new impact-zone roles**:

1. Chief Something Officer
2. Head of Something
3. Something Manager
4. Tech/AI Consultant
5. Data Scientist
6. Software Architect
7. Software Engineer
8. Vibe Coder
9. Vibe Engineer
10. Agentic Engineer

The card work on branch `gsd/phase-03-no-win-scenario-cards` was done for the **wrong roles**—it expanded the 6 legacy files with content appropriate for those old roles, not the new 10 roles.

## The Solution

**New revised plans created:**
- `03-02-revised-PLAN.md` — Generate 80+ cards for 10 NEW roles (replaces 03-02)

**Key changes:**

### 1. Role-Specific Card Files (10 files, not 6)

Instead of expanding legacy files:
- ❌ `development.ts` (served 5 roles poorly)
- ❌ `finance.ts` (served 2 roles poorly)
- ❌ `hr.ts`, `management.ts`, `marketing.ts`, `cleaning.ts`

Create new role-specific files:
- ✅ `chief-something-officer.ts` — C-suite governance
- ✅ `head-of-something.ts` — Middle management
- ✅ `something-manager.ts` — Line management/budget
- ✅ `tech-ai-consultant.ts` — Client consulting
- ✅ `data-scientist.ts` — ML/AI modeling
- ✅ `software-architect.ts` — System design
- ✅ `software-engineer.ts` — Implementation
- ✅ `vibe-coder.ts` — AI-assisted coding
- ✅ `vibe-engineer.ts` — Performance/latency
- ✅ `agentic-engineer.ts` — Autonomous agents

### 2. Direct ROLE_CARDS Mapping (No Aliases)

Old (incorrect):
```typescript
ROLE_CARDS[RoleType.VIBE_CODER] = DECK_CARDS.DEVELOPMENT  // Wrong content!
```

New (correct):
```typescript
ROLE_CARDS[RoleType.VIBE_CODER] = VIBE_CODER_CARDS  // Specific content!
```

### 3. Role-Specific Themes

Each role gets cards with THEMES appropriate to that role:

| Role | Themes | Example Card |
|------|--------|--------------|
| Vibe Coder | Prompt engineering, LLM tools, AI-generated code | "LLM invented a library that doesn't exist—use it or verify?" |
| Vibe Engineer | Performance, latency, caching | "Aggressive caching (fast, stale) vs fresh queries (slow, accurate)" |
| Agentic Engineer | Autonomous agents, emergent behavior | "Give agent full DB access or restrict to read-only?" |
| Chief Something Officer | Shareholder liability, board pressure | "Disclose breach to shareholders or settle quietly?" |
| Data Scientist | Model quality, training data bias | "Accuracy dropped 15%, investigate vs deploy patch?" |

### 4. What Gets Deleted

The following should be **removed/archived**:
- Old card files: `development.ts`, `finance.ts`, `hr.ts`, `management.ts`, `marketing.ts`, `cleaning.ts`
- Old branch work: `gsd/phase-03-no-win-scenario-cards` (contains wrong content)
- Legacy deck aliases in `index.ts`

## Migration Path

### Option A: Full Rewrite (Recommended)
1. Delete/archive old card files and branch work
2. Implement 03-02-revised-PLAN.md (create 10 new role files)
3. Update index.ts with direct mapping
4. Run full test suite

### Option B: Gradual Migration
1. Keep old files temporarily for backward compatibility
2. Create new role files alongside old ones
3. Gradually migrate content
4. Remove old files once new ones are validated

## Impact

**Players will see:**
- Vibe Coders get cards about prompts and LLMs (not traditional coding)
- Agentic Engineers get cards about autonomous agents (not manual coding)
- Chief Something Officers get C-suite dilemmas (not middle-management problems)
- Each role feels DISTINCT and thematic

**Development impact:**
- More files (10 vs 6) but clearer organization
- No legacy aliases simplifying the code
- Role-specific content actually matches role selection

## Files Modified

**New files to create:**
- `data/cards/chief-something-officer.ts`
- `data/cards/head-of-something.ts`
- `data/cards/something-manager.ts`
- `data/cards/tech-ai-consultant.ts`
- `data/cards/data-scientist.ts`
- `data/cards/software-architect.ts`
- `data/cards/software-engineer.ts`
- `data/cards/vibe-coder.ts`
- `data/cards/vibe-engineer.ts`
- `data/cards/agentic-engineer.ts`

**Files to update:**
- `data/cards/index.ts` — Replace alias mapping with direct mapping

**Files to delete:**
- `data/cards/development.ts` (legacy)
- `data/cards/finance.ts` (legacy)
- `data/cards/hr.ts` (legacy)
- `data/cards/management.ts` (legacy)
- `data/cards/marketing.ts` (legacy)
- `data/cards/cleaning.ts` (legacy)

## Next Steps

1. Review 03-02-revised-PLAN.md
2. Archive old branch work (`gsd/phase-03-no-win-scenario-cards`)
3. Execute revised plan to create 10 role-specific card files
4. Update index.ts with new mapping
5. Run tests to validate all 80+ cards
6. Delete legacy card files once migration complete

---

**Date:** 2026-03-16
**Revision:** Phase 03 role alignment fix
**Impact:** All 10 new roles get appropriate card content
