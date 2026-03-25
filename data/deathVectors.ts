import type {
	ArchetypeId,
	Card,
	DeathVectorMap,
	GameState,
	RoleType,
} from "../types";
import { DeathType } from "../types";
import { getRoleDeck } from "./roles";

/**
 * Maps archetype IDs to their preferred death types.
 * Used for breaking ties when multiple death vectors have equal frequency.
 */
export const ARCHETYPE_DEATH_AFFINITY: Record<ArchetypeId, DeathType> = {
	SHADOW_ARCHITECT: DeathType.PRISON,
	DISRUPTOR: DeathType.CONGRESS,
	CONSERVATIVE: DeathType.REPLACED_BY_SCRIPT,
	CHAOS_AGENT: DeathType.FLED_COUNTRY,
	PRAGMATIST: DeathType.BANKRUPT,
	BALANCED: DeathType.AUDIT_FAILURE,
	KIRK: DeathType.KIRK,
};

/**
 * Accumulates death vectors from the player's history of choices.
 *
 * For each choice in the history, finds the corresponding card and outcome,
 * and if the outcome has a deathVector field, increments that death type's count.
 *
 * @param history - Game history of card choices
 * @param deck - The effective card deck
 * @returns DeathVectorMap with death type frequencies
 */
export function accumulateDeathVectors(
	history: GameState["history"],
	deck: Card[],
): DeathVectorMap {
	const vectorMap: DeathVectorMap = {};

	for (const entry of history) {
		const card = deck.find((c) => c.id === entry.cardId);
		if (!card) continue;

		const outcome = entry.choice === "LEFT" ? card.onLeft : card.onRight;
		if (!outcome.deathVector) continue;

		const deathType = outcome.deathVector;
		vectorMap[deathType] = (vectorMap[deathType] ?? 0) + 1;
	}

	return vectorMap;
}

/**
 * Legacy death type determination based on role and stats.
 * Used as fallback when death vectors don't provide a clear signal.
 *
 * @internal
 */
function determineLegacyDeathType(
	budget: number,
	heat: number,
	hype: number,
	role: RoleType | null,
): DeathType {
	if (budget <= 0) return DeathType.BANKRUPT;
	if (heat >= 100) {
		if (hype <= 10) return DeathType.REPLACED_BY_SCRIPT;
		if (role) {
			const deck = getRoleDeck(role);
			if (deck === "DEVELOPMENT" || deck === "FINANCE") return DeathType.PRISON;
			if (deck === "MARKETING") return DeathType.CONGRESS;
			if (deck === "MANAGEMENT") return DeathType.AUDIT_FAILURE;
			if (deck === "HR") return DeathType.FLED_COUNTRY;
		}
		return DeathType.FLED_COUNTRY;
	}
	return DeathType.AUDIT_FAILURE;
}

/**
 * Determines death type using death vectors from player choices, with fallback to legacy logic.
 *
 * Priority:
 * 1. BANKRUPT if budget <= 0 (always wins)
 * 2. REPLACED_BY_SCRIPT if heat >= 100 AND hype <= 10 (always wins)
 * 3. Highest-frequency death vector with count >= 2 (vector-driven)
 * 4. If tied vectors, use dominantArchetypeId to break tie via ARCHETYPE_DEATH_AFFINITY
 * 5. Fallback to legacy role-based death type determination
 *
 * @param vectorMap - Accumulated death vector frequencies
 * @param budget - Current budget (0 = BANKRUPT)
 * @param heat - Current heat level
 * @param hype - Current hype level
 * @param role - Player's role for legacy fallback
 * @param dominantArchetypeId - Optional dominant archetype for tiebreaking
 * @returns Resolved DeathType
 */
export function determineDeathTypeFromVectors(
	vectorMap: DeathVectorMap,
	budget: number,
	heat: number,
	hype: number,
	role: RoleType | null,
	dominantArchetypeId?: ArchetypeId,
): DeathType {
	// Always wins: budget exhausted
	if (budget <= 0) return DeathType.BANKRUPT;

	// Always wins: replaced by automation
	if (heat >= 100 && hype <= 10) return DeathType.REPLACED_BY_SCRIPT;

	// Find vectors with count >= 2 (significant pattern)
	const significantVectors = Object.entries(vectorMap)
		.filter(([_, count]) => count !== undefined && count >= 2)
		.map(([deathType, count]) => ({
			deathType: deathType as DeathType,
			count,
		}));

	// If we have significant vectors, find the highest frequency (excluding KIRK)
	if (significantVectors.length > 0) {
		// Filter out KIRK (can only be triggered by kirkCorruptionActive)
		const validVectors = significantVectors.filter(
			(v) => v.deathType !== DeathType.KIRK,
		);

		if (validVectors.length > 0) {
			// Find max count
			const maxCount = Math.max(...validVectors.map((v) => v.count));
			const topVectors = validVectors.filter((v) => v.count === maxCount);

			// Single clear winner
			if (topVectors.length === 1) {
				return topVectors[0].deathType;
			}

			// Tied vectors: use archetype affinity to break tie
			if (
				dominantArchetypeId &&
				ARCHETYPE_DEATH_AFFINITY[dominantArchetypeId]
			) {
				const archetypePreference =
					ARCHETYPE_DEATH_AFFINITY[dominantArchetypeId];
				if (topVectors.some((v) => v.deathType === archetypePreference)) {
					return archetypePreference;
				}
			}

			// No archetype preference or it wasn't in the tie, return first
			return topVectors[0].deathType;
		}
	}

	// Fallback: use legacy role-based logic
	return determineLegacyDeathType(budget, heat, hype, role);
}
