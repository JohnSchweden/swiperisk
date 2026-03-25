import { describe, expect, it } from "vitest";
import { calculateArchetype } from "../data/archetypes";
import { ROLE_CARDS } from "../data/cards";
import {
	accumulateDeathVectors,
	determineDeathTypeFromVectors,
} from "../data/deathVectors";
import {
	determineDeathType,
	gameReducer,
	initialGameState,
} from "../hooks/useGameState";
import { DeathType, GameStage, RoleType } from "../types";

describe("gameReducer", () => {
	it("STAGE_CHANGE: updates stage and optional personality/role", () => {
		const s = gameReducer(initialGameState, {
			type: "STAGE_CHANGE",
			stage: GameStage.PERSONALITY_SELECT,
		});
		expect(s.stage).toBe(GameStage.PERSONALITY_SELECT);

		const s2 = gameReducer(s, {
			type: "STAGE_CHANGE",
			stage: GameStage.ROLE_SELECT,
			personality: "ROASTER" as import("../types").PersonalityType,
		});
		expect(s2.stage).toBe(GameStage.ROLE_SELECT);
		expect(s2.personality).toBe("ROASTER");
	});

	it("STAGE_CHANGE: rejects invalid transition", () => {
		const s = { ...initialGameState, stage: GameStage.INTRO };
		const next = gameReducer(s, {
			type: "STAGE_CHANGE",
			stage: GameStage.PLAYING,
		});
		expect(next.stage).toBe(GameStage.INTRO);
	});

	it("CHOICE_MADE: applies hype/heat/budget and appends history", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			hype: 50,
			heat: 10,
			budget: 10_000_000,
		};
		const next = gameReducer(s, {
			type: "CHOICE_MADE",
			direction: "RIGHT",
			outcome: { hype: 15, heat: 45, fine: 2_500_000, cardId: "dev_1" },
		});
		expect(next.hype).toBe(65);
		expect(next.heat).toBe(55);
		expect(next.budget).toBe(7_500_000);
		expect(next.history).toHaveLength(1);
		expect(next.history[0]).toEqual({ cardId: "dev_1", choice: "RIGHT" });
	});

	it("CHOICE_MADE: clamps hype to >= 0 and heat to <= 100", () => {
		const s = { ...initialGameState, hype: 5, heat: 95, budget: 10_000_000 };
		const next = gameReducer(s, {
			type: "CHOICE_MADE",
			direction: "LEFT",
			outcome: { hype: -20, heat: 10, fine: 0, cardId: "x" },
		});
		expect(next.hype).toBe(0);
		expect(next.heat).toBe(100);
	});

	it("NEXT_INCIDENT: triggers GAME_OVER with BANKRUPT when budget <= 0", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 0,
			heat: 50,
			role: RoleType.SOFTWARE_ENGINEER,
		};
		const next = gameReducer(s, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		expect(next.deathType).toBe(DeathType.BANKRUPT);
		expect(next.deathReason).toBeTruthy();
		expect(next.unlockedEndings).toContain(DeathType.BANKRUPT);
	});

	it("NEXT_INCIDENT: triggers GAME_OVER with heat >= 100, role determines death type", () => {
		const base = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
		};

		const prison = gameReducer(
			{ ...base, role: RoleType.SOMETHING_MANAGER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(prison.deathType).toBe(DeathType.PRISON);

		const congress = gameReducer(
			{ ...base, role: RoleType.TECH_AI_CONSULTANT },
			{ type: "NEXT_INCIDENT" },
		);
		expect(congress.deathType).toBe(DeathType.CONGRESS);

		const audit = gameReducer(
			{ ...base, role: RoleType.CHIEF_SOMETHING_OFFICER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(audit.deathType).toBe(DeathType.AUDIT_FAILURE);

		const fled = gameReducer(
			{ ...base, role: RoleType.SOFTWARE_ENGINEER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(fled.deathType).toBe(DeathType.FLED_COUNTRY);

		const replaced = gameReducer(
			{ ...base, role: RoleType.SOFTWARE_ENGINEER, hype: 5 },
			{ type: "NEXT_INCIDENT" },
		);
		expect(replaced.deathType).toBe(DeathType.REPLACED_BY_SCRIPT);
	});

	it("NEXT_INCIDENT: advances card index and transitions to BOSS_FIGHT at deck end", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.SOFTWARE_ENGINEER,
			currentCardIndex: 0,
			budget: 10_000_000,
			heat: 0,
		};
		const next = gameReducer(s, { type: "NEXT_INCIDENT" });
		expect(next.currentCardIndex).toBe(1);
		expect(next.stage).toBe(GameStage.PLAYING);

		const deckLength = ROLE_CARDS[RoleType.SOFTWARE_ENGINEER].length;
		const atEnd = { ...s, currentCardIndex: deckLength - 1 };
		const toBoss = gameReducer(atEnd, { type: "NEXT_INCIDENT" });
		expect(toBoss.stage).toBe(GameStage.BOSS_FIGHT);
	});

	it("BOSS_ANSWER: appends answer and deducts budget on wrong", () => {
		const s = {
			...initialGameState,
			budget: 5_000_000,
			bossFightAnswers: [true, false],
		};
		const next = gameReducer(s, { type: "BOSS_ANSWER", isCorrect: false });
		expect(next.bossFightAnswers).toEqual([true, false, false]);
		expect(next.budget).toBe(4_000_000);
	});

	it("BOSS_ANSWER: does not deduct budget on correct", () => {
		const s = {
			...initialGameState,
			budget: 5_000_000,
			bossFightAnswers: [],
		};
		const next = gameReducer(s, { type: "BOSS_ANSWER", isCorrect: true });
		expect(next.budget).toBe(5_000_000);
		expect(next.bossFightAnswers).toEqual([true]);
	});

	it("BOSS_COMPLETE: success goes to SUMMARY", () => {
		const s = { ...initialGameState, stage: GameStage.BOSS_FIGHT };
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: true });
		expect(next.stage).toBe(GameStage.SUMMARY);
	});

	it("BOSS_COMPLETE: fail goes to GAME_OVER with AUDIT_FAILURE", () => {
		const s = { ...initialGameState, stage: GameStage.BOSS_FIGHT };
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: false });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE);
		expect(next.unlockedEndings).toContain(DeathType.AUDIT_FAILURE);
	});

	it("RESET: restores initial state but keeps unlockedEndings", () => {
		const s = {
			...initialGameState,
			stage: GameStage.GAME_OVER,
			unlockedEndings: [DeathType.BANKRUPT],
		};
		const next = gameReducer(s, { type: "RESET" });
		expect(next.stage).toBe(GameStage.INTRO);
		expect(next.unlockedEndings).toEqual([DeathType.BANKRUPT]);
	});
});

describe("determineDeathType", () => {
	it("returns BANKRUPT when budget <= 0", () => {
		expect(determineDeathType(0, 50, 50, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.BANKRUPT,
		);
	});

	it("returns REPLACED_BY_SCRIPT when heat >= 100 and hype <= 10", () => {
		expect(determineDeathType(1e6, 100, 10, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.REPLACED_BY_SCRIPT,
		);
	});

	it("returns PRISON for FINANCE deck role when heat >= 100", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.SOMETHING_MANAGER)).toBe(
			DeathType.PRISON,
		);
	});

	it("returns CONGRESS for MARKETING deck role when heat >= 100", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.TECH_AI_CONSULTANT)).toBe(
			DeathType.CONGRESS,
		);
	});

	it("returns AUDIT_FAILURE for MANAGEMENT deck role when heat >= 100", () => {
		expect(
			determineDeathType(1e6, 100, 50, RoleType.CHIEF_SOMETHING_OFFICER),
		).toBe(DeathType.AUDIT_FAILURE);
	});

	it("returns FLED_COUNTRY for DEVELOPMENT role when heat >= 100 and hype > 10", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.FLED_COUNTRY,
		);
	});

	it("returns AUDIT_FAILURE when heat < 100", () => {
		expect(determineDeathType(1e6, 50, 50, null)).toBe(DeathType.AUDIT_FAILURE);
	});
});

describe("Vector-aware death type resolution in gameReducer", () => {
	it("NEXT_INCIDENT with death vectors uses vector-based death type", () => {
		// Create mock cards with deathVector on outcomes
		const mockCards = [
			{
				id: "vector-test-1",
				title: "Test Card 1",
				source: "TEST" as any,
				onLeft: {
					text: "Left outcome",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: {
					text: "Right outcome",
					hype: -5,
					heat: 5,
					fine: 50000,
				},
			},
			{
				id: "vector-test-2",
				title: "Test Card 2",
				source: "TEST" as any,
				onLeft: {
					text: "Left outcome",
					hype: 10,
					heat: 15,
					fine: 150000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: {
					text: "Right outcome",
					hype: 0,
					heat: 5,
					fine: 0,
				},
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
			history: [
				{ cardId: "vector-test-1", choice: "LEFT" as const },
				{ cardId: "vector-test-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		// Should resolve to CONGRESS (vector frequency = 2) not AUDIT_FAILURE (default for MANAGEMENT)
		expect(next.deathType).toBe(DeathType.CONGRESS);
	});

	it("NEXT_INCIDENT without deathVectors falls back to legacy role-based logic", () => {
		// Cards with no deathVector fields
		const mockCards = [
			{
				id: "no-vector-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: { text: "Left", hype: 5, heat: 10, fine: 100000 },
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
			history: [{ cardId: "no-vector-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE); // Fallback for MANAGEMENT
	});

	it("BOSS_COMPLETE failure uses vector-based death type", () => {
		const mockCards = [
			{
				id: "boss-vector-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.PRISON,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
			{
				id: "boss-vector-2",
				title: "Test Card 2",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.PRISON,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.BOSS_FIGHT,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 50,
			hype: 50,
			history: [
				{ cardId: "boss-vector-1", choice: "LEFT" as const },
				{ cardId: "boss-vector-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "BOSS_COMPLETE", success: false });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		// Should resolve to PRISON (vector frequency = 2) not hardcoded AUDIT_FAILURE
		expect(next.deathType).toBe(DeathType.PRISON);
	});

	it("BOSS_COMPLETE failure with no vectors uses role-based fallback", () => {
		const mockCards = [
			{
				id: "no-vec-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: { text: "Left", hype: 5, heat: 10, fine: 100000 },
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.BOSS_FIGHT,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 50,
			hype: 50,
			history: [{ cardId: "no-vec-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "BOSS_COMPLETE", success: false });
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE); // Fallback for MANAGEMENT
	});

	it("BANKRUPT override still works with vectors", () => {
		const mockCards = [
			{
				id: "vec-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
			{
				id: "vec-2",
				title: "Test Card 2",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 0, // BANKRUPT
			heat: 50,
			hype: 50,
			history: [
				{ cardId: "vec-1", choice: "LEFT" as const },
				{ cardId: "vec-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		// BANKRUPT override should win
		expect(next.deathType).toBe(DeathType.BANKRUPT);
	});

	it("KIRK corruption override still works with vectors", () => {
		const mockCards = [
			{
				id: "vec-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 0, // Would trigger BANKRUPT
			heat: 50,
			hype: 50,
			kirkCorruptionActive: true, // But KIRK should win
			history: [{ cardId: "vec-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.KIRK);
	});

	it("REPLACED_BY_SCRIPT override still works with vectors", () => {
		const mockCards = [
			{
				id: "vec-1",
				title: "Test Card",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
			{
				id: "vec-2",
				title: "Test Card 2",
				source: "TEST" as any,
				onLeft: {
					text: "Left",
					hype: 5,
					heat: 10,
					fine: 100000,
					deathVector: DeathType.CONGRESS,
				},
				onRight: { text: "Right", hype: -5, heat: 5, fine: 50000 },
			},
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100, // REPLACED_BY_SCRIPT threshold
			hype: 5, // REPLACED_BY_SCRIPT threshold
			history: [
				{ cardId: "vec-1", choice: "LEFT" as const },
				{ cardId: "vec-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards as any,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		// REPLACED_BY_SCRIPT override should win
		expect(next.deathType).toBe(DeathType.REPLACED_BY_SCRIPT);
	});
});
