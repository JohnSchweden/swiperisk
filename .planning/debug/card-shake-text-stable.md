# Debug: Card shake — text should stay readable (not shake)

- slug: card-shake-text-stable
- status: resolved
- trigger: User wants text (description, context) inside the card to stay fixed when the card shakes. Only the box should shake; text should remain readable.

## Symptoms

- **expected:** When card shakes under pressure, the text (storyContext, currentCard.text) stays visually fixed. User can read it. Only the card frame/box shakes.
- **actual:** Entire card content (including text) shakes with the container, making reading harder.
- **errors:** None
- **reproduction:** Trigger stress visuals (urgent countdown or critical heat); observe shaking card; text shakes with it.
- **timeline:** Feature request / UX improvement

## Root cause

- `pressure-shake` is on the outer container (`incident-card-container`). All descendants (card, text) move with it.
- Fix: apply counter-shake animation to the content wrapper so it cancels the parent's translation.

## Implementation

- Added `pressure-shake-counter-keyframes` (inverse of pressure-shake: 25% → +1px, 75% → -1px) and `.pressure-shake-counter` class in `index.html`.
- Applied `pressure-shake-counter` to the scrollable content div (`space-y-3 md:space-y-6`) in CardStack when `hasStressVisuals` is true.
- The content div (storyContext + main text + sender block) now counter-animates the parent shake, keeping text readable while the card frame shakes.
