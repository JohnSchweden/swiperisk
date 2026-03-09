---
phase: 6
slug: debrief-and-replay-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for the debrief & replay system (3-page ending flow, archetype reveal, LinkedIn share, V2 waitlist).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (unit) + playwright (E2E) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npm run test -- src/debrief` |
| **Full suite command** | `npm run test && npm run e2e -- debrief` |
| **Estimated runtime** | ~45 seconds (quick) / ~90 seconds (full) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- src/debrief`
- **After every plan wave:** Run `npm run test && npm run e2e -- debrief`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 06-01-01 | 01 | 0 | DEBRIEF-01 | unit | `npm run test -- debrief.state.test` | ⬜ pending |
| 06-01-02 | 01 | 0 | DEBRIEF-02 | unit | `npm run test -- debrief.consequences.test` | ⬜ pending |
| 06-02-01 | 02 | 1 | DEBRIEF-05 | E2E | `npm run e2e -- debrief-flow.spec` | ⬜ pending |
| 06-02-02 | 02 | 1 | DEBRIEF-06 | E2E | `npm run e2e -- page-1-collapse.spec` | ⬜ pending |
| 06-02-03 | 02 | 1 | DEBRIEF-07 | E2E | `npm run e2e -- page-2-audit.spec` | ⬜ pending |
| 06-03-01 | 03 | 2 | DEBRIEF-09 | unit | `npm run test -- archetype.test` | ⬜ pending |
| 06-03-02 | 03 | 2 | DEBRIEF-12 | unit | `npm run test -- personality.test` | ⬜ pending |
| 06-04-01 | 04 | 2 | DEBRIEF-10 | E2E | `npm run e2e -- linkedin-share.spec` | ⬜ pending |
| 06-04-02 | 04 | 2 | DEBRIEF-11 | unit | `npm run test -- v2-waitlist.test` | ⬜ pending |
| 06-05-01 | 05 | 3 | DEBRIEF-03 | E2E | `npm run e2e -- unlock-progress.spec` | ⬜ pending |
| 06-05-02 | 05 | 3 | DEBRIEF-04 | E2E | `npm run e2e -- reflection-prompt.spec` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/debrief/__tests__/debrief.state.test.ts` — GameStage enum extension, page navigation state
- [ ] `src/debrief/__tests__/debrief.consequences.test.ts` — violation-to-consequence mapping
- [ ] `src/debrief/__tests__/archetype.test.ts` — decision vector to archetype scoring
- [ ] `src/debrief/__tests__/personality.test.ts` — 3-voice personality comment generation
- [ ] `src/debrief/__tests__/v2-waitlist.test.ts` — email validation & capture form
- [ ] `playwright/debrief-flow.spec.ts` — 3-page E2E happy path
- [ ] `.playwright/fixtures/debriefSetup.ts` — game state + decision history mocks

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| LinkedIn share button actually works in browser | DEBRIEF-10 | URL encoding & cross-origin behavior varies by browser | 1. Click [Share to LinkedIn] 2. Verify LinkedIn share dialog opens 3. Confirm share URL contains role + score |
| Email reach to yevgen.schweden@hotmail.com | DEBRIEF-11 | Email delivery requires live backend; can't test in CI | 1. Enter email on Page 3 2. Click [Join V2 Waitlist] 3. Verify email received (backend: check `/api/v2-waitlist` logs) |
| Archetype text resonates with players | DEBRIEF-12 | Subjective quality; requires UAT feedback | Run `/gsd:verify-work` UAT: 5 playtesters rate archetype accuracy (Likert 1-5) |
| Video/GIF on collapse page plays correctly | DEBRIEF-05 (visual polish) | Video codec support varies by device | Test on mobile + desktop; check no play errors in console |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING test references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter once approved

**Approval:** pending
