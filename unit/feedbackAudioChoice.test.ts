import { describe, expect, it } from "vitest";
import {
	authoringFeedbackStem,
	type PresentationChoiceSlot,
} from "../lib/feedbackAudioChoice";

/** Minimal card shape for stem mapping */
function card(swapped: boolean | undefined): { choiceSidesSwapped?: boolean } {
	return swapped === undefined ? {} : { choiceSidesSwapped: swapped };
}

describe("authoringFeedbackStem", () => {
	// (choiceSidesSwapped, selectedPresentationSlot) -> authoring suffix for feedback_${id}_${suffix}
	const cases: Array<{
		swapped: boolean | undefined;
		slot: PresentationChoiceSlot;
		expected: "left" | "right";
		note: string;
	}> = [
		{
			swapped: undefined,
			slot: "LEFT",
			expected: "left",
			note: "undefined: visible left = authoring left",
		},
		{
			swapped: undefined,
			slot: "RIGHT",
			expected: "right",
			note: "undefined: visible right = authoring right",
		},
		{
			swapped: false,
			slot: "LEFT",
			expected: "left",
			note: "not swapped: LEFT -> authoring left",
		},
		{
			swapped: false,
			slot: "RIGHT",
			expected: "right",
			note: "not swapped: RIGHT -> authoring right",
		},
		{
			swapped: true,
			slot: "LEFT",
			expected: "right",
			note: "swapped: left slot shows authoring-right outcome",
		},
		{
			swapped: true,
			slot: "RIGHT",
			expected: "left",
			note: "swapped: right slot shows authoring-left outcome",
		},
	];

	it.each(cases)("$note", ({ swapped, slot, expected }) => {
		expect(authoringFeedbackStem(card(swapped), slot)).toBe(expected);
	});
});
