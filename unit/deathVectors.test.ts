import { beforeEach, describe, expect, it } from "vitest";
import {
	accumulateDeathVectors,
	determineDeathTypeFromVectors,
} from "../data/deathVectors";
import type { Card, GameState, RoleType } from "../types";
import { DeathType } from "../types";

describe("Death Vector System", () => {
	let mockDeck: Card[];

	beforeEach(() => {
		mockDeck = [
			{
				id: "card-1",
				source: "SLACK" as const,
				sender: "Boss",
				context: "Test context",
				text: "Test card",
				onLeft: {
					label: "Left",
					hype: 5,
					heat: 10,
					fine: 1000,
					violation: "V1",
					feedback: {
						ROASTER: "Left feedback",
						ZEN_MASTER: "Left feedback",
						LOVEBOMBER: "Left feedback",
					},
					lesson: "Left lesson",
					deathVector: DeathType.CONGRESS,
				},
				onRight: {
					label: "Right",
					hype: 5,
					heat: 10,
					fine: 1000,
					violation: "V1",
					feedback: {
						ROASTER: "Right feedback",
						ZEN_MASTER: "Right feedback",
						LOVEBOMBER: "Right feedback",
					},
					lesson: "Right lesson",
					deathVector: DeathType.PRISON,
				},
			},
			{
				id: "card-2",
				source: "EMAIL" as const,
				sender: "CEO",
				context: "Test context",
				text: "Test card 2",
				onLeft: {
					label: "Left",
					hype: 5,
					heat: 10,
					fine: 1000,
					violation: "V1",
					feedback: {
						ROASTER: "Left feedback",
						ZEN_MASTER: "Left feedback",
						LOVEBOMBER: "Left feedback",
					},
					lesson: "Left lesson",
				},
				onRight: {
					label: "Right",
					hype: 5,
					heat: 10,
					fine: 1000,
					violation: "V1",
					feedback: {
						ROASTER: "Right feedback",
						ZEN_MASTER: "Right feedback",
						LOVEBOMBER: "Right feedback",
					},
					lesson: "Right lesson",
					deathVector: DeathType.CONGRESS,
				},
			},
		];
	});

	describe("accumulateDeathVectors", () => {
		it("returns empty map for empty history", () => {
			const vectors = accumulateDeathVectors([], mockDeck);
			expect(vectors).toEqual({});
		});

		it("counts CONGRESS vectors from history", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(3);
		});

		it("accumulates mixed vectors correctly", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" }, // CONGRESS
				{ cardId: "card-1", choice: "RIGHT" }, // PRISON
				{ cardId: "card-2", choice: "RIGHT" }, // CONGRESS
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(2);
			expect(vectors.PRISON).toBe(1);
		});

		it("ignores cards without deathVector fields (backward compatible)", () => {
			const history: GameState["history"] = [
				{ cardId: "card-2", choice: "LEFT" }, // No vector
				{ cardId: "card-2", choice: "LEFT" }, // No vector
				{ cardId: "card-1", choice: "LEFT" }, // CONGRESS vector
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(1);
			expect(Object.keys(vectors)).toHaveLength(1);
		});

		it("ignores unmatched card IDs", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" }, // CONGRESS
				{ cardId: "nonexistent-card", choice: "LEFT" }, // Ignored
				{ cardId: "card-1", choice: "LEFT" }, // CONGRESS
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(2);
		});
	});

	describe("determineDeathTypeFromVectors", () => {
		it("returns highest-frequency vector when count >= 2", () => {
			const vectorMap = {
				CONGRESS: 3,
				PRISON: 1,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000, // budget
				50, // heat
				50, // hype
				"TECH_AI_CONSULTANT" as RoleType,
			);
			expect(result).toBe(DeathType.CONGRESS);
		});

		it("breaks ties using archetype affinity", () => {
			const vectorMap = {
				CONGRESS: 2,
				PRISON: 2,
			};
			// SHADOW_ARCHITECT should prefer PRISON
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				50,
				50,
				"TECH_AI_CONSULTANT" as RoleType,
				"SHADOW_ARCHITECT",
			);
			expect(result).toBe(DeathType.PRISON);
		});

		it("breaks ties with DISRUPTOR favoring CONGRESS", () => {
			const vectorMap = {
				CONGRESS: 2,
				PRISON: 2,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				50,
				50,
				"TECH_AI_CONSULTANT" as RoleType,
				"DISRUPTOR",
			);
			expect(result).toBe(DeathType.CONGRESS);
		});

		it("falls back to legacy logic when no vector has count >= 2", () => {
			const vectorMap = {
				CONGRESS: 1,
				PRISON: 1,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				50,
				50,
				"SOFTWARE_ENGINEER" as RoleType,
			);
			// Should return some valid death type from legacy logic
			expect([
				DeathType.BANKRUPT,
				DeathType.REPLACED_BY_SCRIPT,
				DeathType.CONGRESS,
				DeathType.FLED_COUNTRY,
				DeathType.PRISON,
				DeathType.AUDIT_FAILURE,
			]).toContain(result);
		});

		it("BANKRUPT always wins when budget <= 0", () => {
			const vectorMap = {
				CONGRESS: 10,
				PRISON: 10,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				0, // budget
				50,
				50,
				"TECH_AI_CONSULTANT" as RoleType,
			);
			expect(result).toBe(DeathType.BANKRUPT);
		});

		it("REPLACED_BY_SCRIPT wins when heat >= 100 and hype <= 10", () => {
			const vectorMap = {
				CONGRESS: 10,
				PRISON: 10,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				100, // heat
				10, // hype
				"TECH_AI_CONSULTANT" as RoleType,
			);
			expect(result).toBe(DeathType.REPLACED_BY_SCRIPT);
		});

		it("KIRK is never returned from vector logic", () => {
			const vectorMap = {
				KIRK: 10,
			};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				50,
				50,
				"TECH_AI_CONSULTANT" as RoleType,
			);
			// Should fall back to legacy logic, never return KIRK
			expect(result).not.toBe(DeathType.KIRK);
		});

		it("handles empty vector map gracefully", () => {
			const vectorMap = {};
			const result = determineDeathTypeFromVectors(
				vectorMap,
				50000000,
				50,
				50,
				"SOFTWARE_ENGINEER" as RoleType,
			);
			expect([
				DeathType.BANKRUPT,
				DeathType.REPLACED_BY_SCRIPT,
				DeathType.CONGRESS,
				DeathType.FLED_COUNTRY,
				DeathType.PRISON,
				DeathType.AUDIT_FAILURE,
			]).toContain(result);
		});
	});
});
