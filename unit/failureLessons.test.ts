import { describe, expect, it } from "vitest";
import { accumulateDeathVectors } from "../data/deathVectors";
import {
	FAILURE_LESSONS,
	generateDeathExplanation,
	getRetryPrompt,
} from "../data/failureLessons";
import { DeathType, PersonalityType } from "../types";

describe("failureLessons", () => {
	describe("FAILURE_LESSONS data structure", () => {
		it("should have 3-4 lessons for each non-KIRK death type", () => {
			const nonKirkTypes = Object.values(DeathType).filter(
				(t) => t !== DeathType.KIRK,
			);
			expect(nonKirkTypes.length).toBeGreaterThan(0);

			for (const deathType of nonKirkTypes) {
				const lessons = FAILURE_LESSONS[deathType];
				expect(lessons).toBeDefined();
				expect(lessons.length).toBeGreaterThanOrEqual(3);
				expect(lessons.length).toBeLessThanOrEqual(4);
			}
		});

		it("should have title, explanation, and realWorldExample fields for each lesson", () => {
			for (const deathType of Object.keys(FAILURE_LESSONS)) {
				const lessons =
					FAILURE_LESSONS[deathType as keyof typeof FAILURE_LESSONS];
				for (const lesson of lessons) {
					expect(lesson).toHaveProperty("title");
					expect(lesson).toHaveProperty("explanation");
					expect(lesson).toHaveProperty("realWorldExample");
					expect(typeof lesson.title).toBe("string");
					expect(typeof lesson.explanation).toBe("string");
					expect(typeof lesson.realWorldExample).toBe("string");
					expect(lesson.title.length).toBeGreaterThan(0);
					expect(lesson.explanation.length).toBeGreaterThan(0);
					expect(lesson.realWorldExample.length).toBeGreaterThan(0);
				}
			}
		});

		it("should not include KIRK in FAILURE_LESSONS", () => {
			expect(FAILURE_LESSONS[DeathType.KIRK]).toBeUndefined();
		});
	});

	describe("generateDeathExplanation", () => {
		it("should return explanation mentioning congressional exposure for CONGRESS with vectors", () => {
			const vectorMap = {
				[DeathType.CONGRESS]: 2,
			};
			const explanation = generateDeathExplanation(
				DeathType.CONGRESS,
				vectorMap,
				5,
			);
			expect(explanation).toBeDefined();
			expect(explanation.length).toBeGreaterThan(0);
			// Should reference the death type or relevant concepts
			expect(explanation.toLowerCase()).toMatch(/congress|exposure|public/i);
		});

		it("should mention financial decisions for BANKRUPT with vectors", () => {
			const vectorMap = {
				[DeathType.BANKRUPT]: 3,
			};
			const explanation = generateDeathExplanation(
				DeathType.BANKRUPT,
				vectorMap,
				6,
			);
			expect(explanation).toBeDefined();
			expect(explanation.toLowerCase()).toMatch(
				/bankrupt|budget|financial|money/i,
			);
		});

		it("should return generic explanation when no vectors present", () => {
			const vectorMap = {};
			const explanation = generateDeathExplanation(
				DeathType.AUDIT_FAILURE,
				vectorMap,
				4,
			);
			expect(explanation).toBeDefined();
			expect(explanation.length).toBeGreaterThan(0);
			// Generic explanation should mention the death type
			expect(explanation.toLowerCase()).toMatch(/audit/i);
		});

		it("should handle prison with vector map", () => {
			const vectorMap = {
				[DeathType.PRISON]: 2,
			};
			const explanation = generateDeathExplanation(
				DeathType.PRISON,
				vectorMap,
				7,
			);
			expect(explanation).toBeDefined();
			expect(explanation.toLowerCase()).toMatch(/compliance|hiding|federal/i);
		});
	});

	describe("getRetryPrompt", () => {
		it("should return personality-specific retry prompt for ROASTER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			expect(prompt).toBeDefined();
			expect(typeof prompt).toBe("string");
			expect(prompt.length).toBeGreaterThan(0);
			// ROASTER should be sarcastic
			expect(prompt.toLowerCase()).not.toMatch(/heart|love|care/);
		});

		it("should return philosophical prompt for ZEN_MASTER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ZEN_MASTER,
			);
			expect(prompt).toBeDefined();
			// ZEN_MASTER should be thoughtful
			expect(prompt).toMatch(/[Tt]he|[Pp]ath|[Ww]isdom|[Ee]xplore/);
		});

		it("should return encouraging prompt for LOVEBOMBER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.LOVEBOMBER,
			);
			expect(prompt).toBeDefined();
			// LOVEBOMBER should be encouraging
			expect(prompt.toLowerCase()).toMatch(/good|great|you|best|amazing/i);
		});

		it("should be specific to death type, not generic", () => {
			const bankruptPrompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			const congressPrompt = getRetryPrompt(
				DeathType.CONGRESS,
				PersonalityType.ROASTER,
			);
			// Different death types should have different prompts
			expect(bankruptPrompt).not.toBe(congressPrompt);
		});

		it("should include strategy hint based on death type", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			// Should hint at financial/budget strategy
			expect(prompt.toLowerCase()).toMatch(
				/burning|budget|money|financial|spend|cost/i,
			);
		});

		it("should work for all death types except KIRK", () => {
			const nonKirkTypes = Object.values(DeathType).filter(
				(t) => t !== DeathType.KIRK,
			);
			for (const deathType of nonKirkTypes) {
				const prompt = getRetryPrompt(deathType, PersonalityType.ROASTER);
				expect(prompt).toBeDefined();
				expect(typeof prompt).toBe("string");
				expect(prompt.length).toBeGreaterThan(0);
			}
		});
	});
});
