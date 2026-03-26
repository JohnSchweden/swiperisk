import type { Card } from "../types";

/** Which visible choice slot the player selected (matches game history `choice`). */
export type PresentationChoiceSlot = "LEFT" | "RIGHT";

/**
 * Authoring suffix for pre-baked feedback audio (`feedback_<cardId>_left|right`).
 * Maps the presentation slot the player chose to the authoring branch (source onLeft vs onRight),
 * accounting for per-shuffle side swaps.
 */
export function authoringFeedbackStem(
	card: Pick<Card, "choiceSidesSwapped">,
	selectedPresentationSlot: PresentationChoiceSlot,
): "left" | "right" {
	if (card.choiceSidesSwapped === true) {
		return selectedPresentationSlot === "LEFT" ? "right" : "left";
	}
	return selectedPresentationSlot === "LEFT" ? "left" : "right";
}
