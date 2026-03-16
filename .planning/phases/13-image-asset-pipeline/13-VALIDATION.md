---
phase: 13
slug: image-asset-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `bun run test:unit` |
| **Full suite command** | `bun run test:data` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bun run test:unit`
- **After every plan wave:** Run `bun run test:data`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-00-01 | 00 | 0 | PIPELINE-01 | unit | `bun vitest run tests/data/image-prompts.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-00-02 | 00 | 0 | PIPELINE-03 | unit | `bun vitest run tests/data/image-assets.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-00-03 | 00 | 0 | PIPELINE-04 | unit | `bun vitest run tests/data/image-map.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-01-01 | 01 | 1 | PIPELINE-01 | unit | `bun vitest run tests/data/image-prompts.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-02-01 | 02 | 1 | PIPELINE-02 | manual-only | Manual: run script, verify images exist | N/A | ⬜ pending |
| 13-03-01 | 03 | 1 | PIPELINE-03 | unit | `bun vitest run tests/data/image-assets.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-03-02 | 03 | 1 | PIPELINE-04 | unit | `bun vitest run tests/data/image-map.test.ts -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/data/image-prompts.test.ts` — validates prompt library completeness (all categories, all entity keys)
- [ ] `tests/data/image-map.test.ts` — validates imageMap exports have entries for all DeathType, ArchetypeId values
- [ ] `tests/data/image-assets.test.ts` — validates referenced image files exist in public/images/

*Existing Vitest infrastructure covers framework needs. Only test files need creation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pipeline script generates images | PIPELINE-02 | Requires Gemini API key + network | Run `bun scripts/generate-images.ts`, verify images appear in `public/images/` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
