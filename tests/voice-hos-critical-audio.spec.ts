import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Head of Something Critical Card Audio Tests
 *
 * These tests verify that all critical HoS card feedback audio files exist.
 * Critical cards are high-impact (game-enders, sacrifice moments) with
 * dedicated Roaster voice lines for each choice.
 * Files are in Opus format (.opus) with MP3 fallback (.mp3).
 *
 * @smoke @area:audio
 */

const VOICES_DIR = path.join(process.cwd(), "public/audio/voices");

// Critical Head of Something cards with dedicated feedback audio
const CRITICAL_HOS_CARDS = [
	"hos_managing_up_down",
	"explainability_hos_2",
	"hos_copyright_team_blame",
	"hos_team_burnout_deadline",
	"shadow_ai_hos_2",
	"hos_model_drift_team_blame",
	"hos_explainability_politics",
	"hos_prompt_injection_review_escape",
];

test.describe("Head of Something Critical Card Audio @smoke @area:audio", () => {
	test.describe("Critical HoS cards have feedback audio for both choices", () => {
		for (const cardId of CRITICAL_HOS_CARDS) {
			test(`${cardId} has feedback audio for LEFT and RIGHT choices`, () => {
				const leftPath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${cardId}_left.opus`,
				);
				const rightPath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${cardId}_right.opus`,
				);

				expect(
					fs.existsSync(leftPath),
					`Missing LEFT feedback audio: roaster/feedback_${cardId}_left.opus`,
				).toBe(true);
				expect(
					fs.existsSync(rightPath),
					`Missing RIGHT feedback audio: roaster/feedback_${cardId}_right.opus`,
				).toBe(true);
			});
		}
	});

	test("All 16 critical HoS audio files exist (8 cards x 2 choices)", () => {
		let missingCount = 0;
		const missingFiles: string[] = [];

		for (const cardId of CRITICAL_HOS_CARDS) {
			for (const choice of ["left", "right"] as const) {
				const filePath = path.join(
					VOICES_DIR,
					"roaster",
					"feedback",
					`feedback_${cardId}_${choice}.opus`,
				);
				if (!fs.existsSync(filePath)) {
					missingCount++;
					missingFiles.push(
						`roaster/feedback/feedback_${cardId}_${choice}.opus`,
					);
				}
			}
		}

		expect(
			missingCount,
			`Missing ${missingCount} files: ${missingFiles.join(", ")}`,
		).toBe(0);
	});

	test.describe("Critical HoS audio files are Opus format", () => {
		for (const cardId of CRITICAL_HOS_CARDS) {
			for (const choice of ["left", "right"] as const) {
				test(`feedback/feedback_${cardId}_${choice}.opus is valid Opus`, () => {
					const filePath = path.join(
						VOICES_DIR,
						"roaster",
						"feedback",
						`feedback_${cardId}_${choice}.opus`,
					);

					expect(
						fs.existsSync(filePath),
						`File does not exist: ${filePath}`,
					).toBe(true);

					// Read first 4 bytes - should be "OggS" for Opus-in-OGG container
					const buffer = fs.readFileSync(filePath);
					const header = buffer.slice(0, 4).toString("ascii");
					expect(header).toBe("OggS");
				});
			}
		}
	});

	test.describe("Only Roaster has critical HoS feedback files", () => {
		const otherPersonalities = ["zenmaster", "lovebomber"] as const;

		for (const personality of otherPersonalities) {
			test(`${personality} does NOT have critical HoS feedback files`, () => {
				for (const cardId of CRITICAL_HOS_CARDS) {
					for (const choice of ["left", "right"] as const) {
						const filePath = path.join(
							VOICES_DIR,
							personality,
							"feedback",
							`feedback_${cardId}_${choice}.opus`,
						);
						expect(
							fs.existsSync(filePath),
							`${personality} should NOT have feedback/feedback_${cardId}_${choice}.opus (per design)`,
						).toBe(false);
					}
				}
			});
		}
	});
});
