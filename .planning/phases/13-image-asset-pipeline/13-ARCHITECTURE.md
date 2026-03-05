# Phase 13: Image Asset Pipeline — Architecture

## Strategic Value

Imagery exponentially increases immersion, emotional connection, and viral sharing potential. The Kobayashi Maru is a **psychological test** — images trigger physiological stress responses and make the crisis feel real in a 60-second flash sim.

---

## Visual Strategy: "Glitched Corporate Surrealism"

**Core aesthetic:** High-fidelity, photorealistic AI-generated images (Midjourney v6 / DALL-E 3) of standard corporate scenes, with visible, disturbing, or surreal AI-generated artifacts.

**Why it works:** Creates "scroll-stop" moments. Looks real at first glance; the glitch forces a closer look. Unsettling, funny, perfectly captures "unhinged AI" (Project Icarus narrative).

**NOT using:** Generic stock photos, "just another pixel art game," or cheap memes (Distracted Boyfriend). Creating our own "Structural Memes."

---

## Image Categories

### 1. Incident Images (Uncanny Valley)

**Purpose:** Move crisis from abstract text to visible disaster. Trigger physiological stress.

**Style:** Corporate scene + visible AI artifact (slightly off, uncanny).

**Example prompts:**
- **Agentic Engineer:** "Glossy photo of standard server room, but the cables are writhing like bioluminescent snakes. Corporate. Unsettling."
- **Vibe Coder:** "Slick minimalist office desk, but the coffee mug is melting into binary code. Professional. Disturbing."
- **Data Scientist:** "High-res photo of a burning data center where the flames look strangely like dollar signs ($). Corporate disaster."

### 2. Outcome Images (Sarcastic Stock Photos)

**Purpose:** Visual reward for impossible choice. Juxtapose corporate success with humanitarian/legal disaster.

**Style:** Polished, high-contrast "heroic" corporate stock photo — but subject matter is a disaster. "Task failed successfully."

**Example prompts:**
- **Compliance outcome:** "Glossy photo of team celebrating in boardroom, confetti, big smiles. Outside the massive window behind them, a meteor is hitting the city."
- **Hype-Bro outcome:** "Influencer holding martini, winking at camera. Blurry background: crowd fleeing a massive pixelated cloud of fire."
- **Vibe Coder outcome:** "Glossy corporate press photo of smiling executives holding large checks. Background: stressed Compliance Officer being handcuffed by Interpol."

### 3. Collapse Image (Page 1 — Game Over)

**Purpose:** Dramatic failure visual when simulation ends.

**Example prompt:** "Luxury yacht sinking while a small drone flies overhead holding the final audit report. Dramatic. Corporate satire."

### 4. Archetype Images (Page 3 — LinkedIn Share Engine)

**Purpose:** Viral engine. Professionals love badges/certificates. Provides social capital for "brag post" about failing the sim.

**Style:** NOT a photo. Stylized graphic — tactical patch or futuristic tarot card. High-contrast, iconic.

**Example prompts:**
- **Pragmatist (Shadow Architect):** "Graphic of a fist holding a power plug, superimposed over a blueprint of a burning circuit board. Tactical patch style."
- **Accelerationist (Hype-Bro):** "Graphic of winged rocket ship with eye on nosecone, flying into black hole. Futuristic tarot card style."
- **VERA (Roaster):** "High-fashion portrait of British executive, but her shadow on the wall behind her is screaming. Uncanny."

---

## Pipeline Requirements

1. **Prompt library** — Structured prompts per card, outcome, deathType, archetype
2. **Generation** — Midjourney / DALL-E 3 / Stable Diffusion (batch or manual)
3. **Storage** — Save to `public/images/` (or equivalent)
4. **Naming** — e.g. `incident-{cardId}.webp`, `outcome-{cardId}-{direction}.webp`, `collapse-{deathType}.webp`, `archetype-{archetypeId}.webp`
5. **Mapping** — Config or code mapping: cardId → image path, outcome → image, archetype → image

---

## Requirements (Phase 13)

- PIPELINE-01: Image prompt library (incidents, outcomes, collapse, archetypes)
- PIPELINE-02: Script or process to generate + save images locally
- PIPELINE-03: File naming convention + directory structure
- PIPELINE-04: Mapping config (card → image, outcome → image, archetype → image, deathType → collapse image)
