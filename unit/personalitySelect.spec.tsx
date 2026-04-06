import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonalitySelect } from "../src/components/game/PersonalitySelect";
import {
	PERSONALITY_CARD_GRID_ORDER,
	SELECT_CARD_HOVER,
	SELECT_CARD_RECOMMENDED,
} from "../src/components/game/selectionStageStyles";
import { VOICE_COVERAGE_HINT } from "../src/data";
import { PersonalityType } from "../src/types";

function expectOrderClasses(el: HTMLElement, orderSpec: string) {
	for (const token of orderSpec.split(/\s+/).filter(Boolean)) {
		expect(el.className).toContain(token);
	}
}

describe("PersonalitySelect", () => {
	const defaultProps = {
		isReady: true,
		hoverEnabled: true,
		onSelect: vi.fn(),
	};

	it("should place voice and meme hint inside V.E.R.A. card when speech UI is enabled", () => {
		render(<PersonalitySelect {...defaultProps} />);

		const roasterCard = screen.getByTestId("personality-roaster");
		const hint = screen.getByTestId("personality-select-voice-hint");
		expect(roasterCard).toContainElement(hint);
		expect(hint).toHaveTextContent(VOICE_COVERAGE_HINT);
		expect(hint.textContent).toContain("+");
		expect(hint.querySelector(".fa-volume-high")).toBeInTheDocument();
		expect(hint.querySelector(".fa-photo-film")).toBeInTheDocument();
	});

	it("should apply selection-card-hover when hoverEnabled is true", () => {
		render(<PersonalitySelect {...defaultProps} hoverEnabled={true} />);
		expect(screen.getByTestId("personality-roaster").className).toContain(
			"selection-card-hover",
		);
	});

	it("should not apply selection-card-hover when hoverEnabled is false", () => {
		render(<PersonalitySelect {...defaultProps} hoverEnabled={false} />);
		expect(screen.getByTestId("personality-roaster").className).not.toContain(
			"selection-card-hover",
		);
	});

	it("should soft-highlight V.E.R.A. (full voice + meme path)", () => {
		render(<PersonalitySelect {...defaultProps} />);
		expect(screen.getByTestId("personality-roaster").className).toContain(
			"selection-card-recommended",
		);
		expect(
			screen.getByTestId("personality-zen_master").className,
		).not.toContain("selection-card-recommended");
	});

	it("applies responsive grid order so Roaster stacks first on narrow viewports", () => {
		render(<PersonalitySelect {...defaultProps} />);
		expectOrderClasses(
			screen.getByTestId("personality-roaster"),
			PERSONALITY_CARD_GRID_ORDER[PersonalityType.ROASTER],
		);
		expectOrderClasses(
			screen.getByTestId("personality-zen_master"),
			PERSONALITY_CARD_GRID_ORDER[PersonalityType.ZEN_MASTER],
		);
	});
});
