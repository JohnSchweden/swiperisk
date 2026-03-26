import type { Card } from "../types";

/** Which visible choice slot the player selected (matches game history `choice`). */
export type PresentationChoiceSlot = "LEFT" | "RIGHT";

/**
 * Convert any text to a URL-safe slug (kebab-case).
 * e.g., "Shield the team" → "shield-the-team"
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Authoring slug for pre-baked feedback audio (`feedback_<cardId>_<slug>`).
 * Maps the presentation slot the player chose to the authoring branch label slug
 * (source onLeft vs onRight), accounting for per-shuffle side swaps.
 */
export function authoringFeedbackStem(
	card: Pick<Card, "choiceSidesSwapped" | "onLeft" | "onRight">,
	selectedPresentationSlot: PresentationChoiceSlot,
): string {
	if (card.choiceSidesSwapped === true) {
		return selectedPresentationSlot === "LEFT"
			? slugify(card.onRight.label)
			: slugify(card.onLeft.label);
	}
	return selectedPresentationSlot === "LEFT"
		? slugify(card.onLeft.label)
		: slugify(card.onRight.label);
}
