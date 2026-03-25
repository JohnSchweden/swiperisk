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

## Automated test constraints (CI)

Phase 13 **unit / data tests** (`tests/data/*`, Vitest, `bun run test:data`) **must not**:

- Call **Gemini**, **Imagen**, or any **remote image API** (e.g. `@google/genai`, `GoogleGenAI`, HTTP to model endpoints).
- **Generate or overwrite** images under `public/images/` (no pipeline runs that invoke `generateContent` / image modalities; no test code that writes WebP/PNG via `sharp` into `public/`).

**Allowed:** Import **`data/imageMap.ts`** and **`data/cards`**; **read-only** `existsSync` / `statSync` (and similar) against committed files under `public/images/`; tests against **pure, exported** pipeline helpers that build task lists or prompts **without** constructing a live client (e.g. same logic path as `--dry-run` / `--export-prompts`, no API key required).

**PIPELINE-02** (real generated pixels) stays **manual or an opt-in local command** with `GEMINI_API_KEY` — **not** a gate for CI.

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
| 13-00-01 | 00 | 0 | PIPELINE-01 | unit | `bun vitest run tests/data/image-map.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-00-02 | 00 | 0 | PIPELINE-03 | unit | `bun vitest run tests/data/image-assets.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-00-03 | 00 | 0 | PIPELINE-04 | unit | `bun vitest run tests/data/image-map.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-01-01 | 01 | 1 | PIPELINE-01 | unit | `bun vitest run tests/data/image-map.test.ts -x` | ❌ W0 | ⬜ pending |
| 13-02-01 | 02 | 1 | PIPELINE-02 | manual-only | Manual: run script, verify images exist | N/A | ⬜ pending |

*There is no Plan 03 in Phase 13; PIPELINE-03/04 for maps are covered by **13-00** / **13-01** rows above.*

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/data/image-map.test.ts` — HOS pilot incident + outcome key contracts, shared-incident lesson invariant, DeathType / ArchetypeId coverage (see **13-CONTRACT.md**)
- [ ] `tests/data/image-assets.test.ts` — every mapped path has a committed file under `public/images/` (read-only; no generation in CI)
- [ ] *(Optional)* Pure **`buildImageTasks`** (or equivalent) unit tests — same module path as pipeline, **no** `GoogleGenAI`, **no** writes to `public/` (add when exported from `generate-images.ts`)
- [ ] *(Optional)* **Slug-collision:** test that distinct `realWorldReference.incident` strings on the pilot deck do not slugify to the same key

*Prompts are generated at runtime by the pipeline — there is no static “prompt library” file to validate.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pipeline script generates images | PIPELINE-02 | Requires Gemini API key + network; **never** run from Vitest / CI (see **Automated test constraints** above) | Run `bun scripts/generate-images.ts` locally, verify images appear in `public/images/` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
