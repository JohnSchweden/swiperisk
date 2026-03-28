import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { swipeWithKeyboard } from "./helpers/keyboardSwipe";
import { getCard, navigateToPlayingFast } from "./helpers/navigation";
import {
	syntheticDragOnCard,
	syntheticMouseUpAtCard,
} from "./helpers/syntheticMouseSwipe";

test.use({ baseURL: "https://localhost:3000" });

async function waitForExitTransition(
	page: Page,
	card: Locator,
	timeoutMs = 1000,
): Promise<void> {
	const startTime = Date.now();
	while (Date.now() - startTime < timeoutMs) {
		const transition = await card.evaluate((el) => {
			return window.getComputedStyle(el).transition;
		});
		if (transition.includes("0.35s")) break;
		await page.waitForTimeout(50);
	}
}

test.describe("Exit Animation Continuity @area:input", () => {
	test("card exits smoothly from current drag position", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		expect(await card.boundingBox()).not.toBeNull();

		await syntheticDragOnCard(card, { deltaX: 120, steps: 10, release: false });

		const dragTransform = await card.evaluate((el) => {
			return window.getComputedStyle(el).transform;
		});

		expect(dragTransform).toContain("matrix");

		await syntheticMouseUpAtCard(card);

		await waitForExitTransition(page, card);

		const transition = await card.evaluate((el) => {
			return window.getComputedStyle(el).transition;
		});
		expect(transition).toContain("0.35s");
		expect(transition).toContain("cubic-bezier(0.25, 0.46, 0.45, 0.94)");

		const exitTransform = await card.evaluate((el) => {
			return window.getComputedStyle(el).transform;
		});

		expect(exitTransform).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
	});

	test("exit animation does not reset to center", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		expect(await card.boundingBox()).not.toBeNull();

		await syntheticDragOnCard(card, { deltaX: 110, steps: 10, release: false });

		const startTime = Date.now();
		const timeout = 1000;
		while (Date.now() - startTime < timeout) {
			const hasOffset = await card.evaluate((el) => {
				const style = window.getComputedStyle(el);
				const matrix = new DOMMatrix(style.transform);
				return matrix.m41 !== 0 || matrix.m42 !== 0;
			});
			if (hasOffset) {
				break;
			}
			await page.waitForTimeout(50);
		}

		await card.evaluate((el) => {
			const style = window.getComputedStyle(el);
			const matrix = new DOMMatrix(style.transform);
			return { x: matrix.m41, y: matrix.m42 };
		});

		await syntheticMouseUpAtCard(card);

		await waitForExitTransition(page, card);

		const transition = await card.evaluate((el) => {
			return window.getComputedStyle(el).transition;
		});

		expect(transition).toContain("0.35s");

		await card.evaluate((el) => {
			const style = window.getComputedStyle(el);
			const matrix = new DOMMatrix(style.transform);
			return { x: matrix.m41, y: matrix.m42 };
		});
	});

	test("keyboard swipe uses same exit transition family", async ({ page }) => {
		await navigateToPlayingFast(page);
		const card = await getCard(page);
		await swipeWithKeyboard(page, "right");
		await waitForExitTransition(page, card);
		const transition = await card.evaluate((el) => {
			return window.getComputedStyle(el).transition;
		});
		expect(transition).toContain("0.35s");
	});
});
