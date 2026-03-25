# Phase 13 — imageMap & outcome asset contract (normative)

**Status:** Target specification. Reconcile `data/imageMap.ts` and `scripts/generate-images.ts` with this document before Phase 14 UI work depends on the API.

**See also:** `.planning/phases/13-image-asset-pipeline/13-CONTEXT.md` (narrative + art direction), `.planning/phases/13-image-asset-pipeline/13-VALIDATION.md` § Automated test constraints (CI must not call Gemini or write images).

---

## Scope tiers

| Tier | Incidents / outcomes | Archetypes / deaths |
|------|----------------------|---------------------|
| **Phase 13 ship (HOS pilot)** | Rows only for `realWorldReference` cases that appear on **Head of Something** cards, plus **two outcome files per incident slug** (`-left` / `-right`). | All **7** archetypes and **7** deaths (global). |
| **Expansion (later)** | Extend maps toward **~118** unique incidents and matching outcome pairs as additional roles gain assets. | Unchanged (7 + 7). |

---

## Reference case & reuse

- **Reference case** = `realWorldReference.incident` (same story may appear on multiple roles’ cards).
- **Incident image:** one file per distinct incident slug: `/images/incidents/{incidentSlug}.webp`.
- **Outcome images:** one **pair** per distinct incident slug used for swipe outcomes in the pilot:  
  `/images/outcomes/{incidentSlug}-left.webp` and `/images/outcomes/{incidentSlug}-right.webp`.  
  Reused wherever that incident appears; prompts reflect the **canonical** left/right lessons for that reference case.

`incidentSlug` = `slugifyIncident(incident)` (lowercase kebab-case, shared helper in `imageMap.ts` and pipeline).

---

## TypeScript surface (target)

- `INCIDENT_IMAGES: Record<string, string>` — pilot: subset keyed by incident slug; expansion: grow toward full deck.
- `OUTCOME_IMAGES: Record<string, string>` — keys `${incidentSlug}-left` and `${incidentSlug}-right` (not legacy `BUDGET_CRATER`, …).
- `getOutcomeImagePath(incidentSlug: string, direction: "LEFT" | "RIGHT"): string | undefined` — `undefined` if no asset (non-pilot role, missing row, or placeholder era).
- `getIncidentImagePath`, `getArchetypeImagePath`, `getDeathImagePath` unchanged in role.
- Prefer a **type alias** e.g. `OutcomeImageKey = string` over resurrecting `OutcomeConsequenceType` for filenames.

---

## Data invariant (required for tests)

For each distinct `realWorldReference.incident` string, every card that references it **must** use the same `(onLeft.lesson, onRight.lesson)` text (pairwise string equality). If two cards disagree, one image pair cannot represent both — **fix copy or split the incident string**.

---

## Automated tests (no API / no generation)

Vitest may assert map keys, path shapes, invariant above, and on-disk files for **committed** assets only. **Do not** invoke `GoogleGenAI` or write under `public/images/` from tests. Real generation remains **manual / opt-in** (PIPELINE-02).
