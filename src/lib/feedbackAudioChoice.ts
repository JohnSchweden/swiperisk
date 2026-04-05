import type { Card } from "../types";
import { slugify } from "./slugify";

export { slugify };

/** Which visible choice slot the player selected (matches game history `choice`). */
export type PresentationChoiceSlot = "LEFT" | "RIGHT";

/**
 * Authoring slug for pre-baked feedback audio (`feedback_<cardId>_<slug>`).
 * Maps the chosen presentation slot to `slugify()` of the **visible** outcome label.
 * `shuffleDeck` already swaps `onLeft`/`onRight` when `choiceSidesSwapped` is true, so
 * card.onLeft / card.onRight always match what the player saw — no second inversion here.
 */
export function authoringFeedbackStem(
	card: Pick<Card, "onLeft" | "onRight">,
	selectedPresentationSlot: PresentationChoiceSlot,
): string {
	return selectedPresentationSlot === "LEFT"
		? slugify(card.onLeft.label)
		: slugify(card.onRight.label);
}
