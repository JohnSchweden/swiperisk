import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonalitySelect } from "../components/game/PersonalitySelect";

describe("PersonalitySelect", () => {
	const defaultProps = {
		isReady: true,
		hoverEnabled: true,
		onSelect: vi.fn(),
	};

	it("should place voice hint inside V.E.R.A. card when speech UI is enabled", () => {
		render(<PersonalitySelect {...defaultProps} />);

		const roasterCard = screen.getByTestId("personality-roaster");
		const hint = screen.getByTestId("personality-select-voice-hint");
		expect(roasterCard).toContainElement(hint);
	});
});
