import { describe, expect, it } from "vitest";
import { formatBudget } from "../lib/formatting";

describe("formatBudget", () => {
	it("uses M with one decimal from 1M", () => {
		expect(formatBudget(1_000_000)).toBe("$1.0M");
		expect(formatBudget(10_000_000)).toBe("$10.0M");
		expect(formatBudget(1_500_000)).toBe("$1.5M");
	});

	it("uses whole K when exact thousands", () => {
		expect(formatBudget(200_000)).toBe("$200K");
		expect(formatBudget(1_000)).toBe("$1K");
	});

	it("uses one decimal K when needed", () => {
		expect(formatBudget(2_500)).toBe("$2.5K");
	});

	it("uses locale below 1K", () => {
		expect(formatBudget(0)).toBe("$0");
		expect(formatBudget(999)).toBe("$999");
	});

	it("prefixes minus for negatives", () => {
		expect(formatBudget(-200_000)).toBe("-$200K");
		expect(formatBudget(-1_000_000)).toBe("-$1.0M");
	});
});
