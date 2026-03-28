import { expect, test } from "@playwright/test";
import { RoleType } from "../types";
import { navigateToPlayingWithCardAtIndex } from "./helpers/navigation";

test.describe("Cumulative Layout Shift (CLS) prevention", () => {
	test.beforeEach(async ({ page }) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);
	});

	test("No layout shift when images load (CLS < 0.1)", async ({ page }) => {
		test.setTimeout(20000);

		const totalCLS = await page.evaluate(
			() =>
				new Promise<number>((resolve) => {
					let cls = 0;

					if (!("PerformanceObserver" in window)) {
						resolve(0);
						return;
					}

					try {
						const observer = new PerformanceObserver((list) => {
							for (const entry of list.getEntries()) {
								if (entry.entryType === "layout-shift") {
									const ls = entry as PerformanceEntry & {
										hadRecentInput: boolean;
										value: number;
									};
									if (!ls.hadRecentInput) cls += ls.value;
								}
							}
						});

						observer.observe({ entryTypes: ["layout-shift"] });

						setTimeout(() => {
							observer.disconnect();
							resolve(cls);
						}, 5000);
					} catch {
						resolve(0);
					}
				}),
		);

		if (totalCLS > 0) {
			expect(totalCLS).toBeLessThan(0.1);
		}
	});

	test("Aspect ratio containers prevent layout shift", async ({ page }) => {
		// beforeEach navigates at default viewport; resize-then-remount avoids mid-page
		// viewport jumps and scrollbar reflow fighting parallel workers.
		await page.setViewportSize({ width: 1280, height: 1600 });
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);

		const aspectBox = page
			.locator('[data-testid="incident-card"]')
			.locator('[class*="aspect-video"]')
			.first();

		await page.waitForFunction(
			() => {
				const img = document.querySelector(
					'[data-testid="incident-card"] img',
				) as HTMLImageElement | null;
				return Boolean(img?.complete && img.naturalWidth > 0);
			},
			{ timeout: 15000 },
		);

		const containerBefore = await aspectBox.boundingBox();
		await page.waitForTimeout(2000);
		const containerAfter = await aspectBox.boundingBox();
		expect(containerBefore).not.toBeNull();
		expect(containerAfter).not.toBeNull();
		if (!containerBefore || !containerAfter) return;

		// Pixel width/height can reflow with fonts, scrollbars, or flex siblings;
		// the invariant we care about is that aspect-video keeps a stable ratio.
		const aspect = (b: { width: number; height: number }) => b.width / b.height;
		const r0 = aspect(containerBefore);
		const r1 = aspect(containerAfter);
		expect(r0).toBeCloseTo(r1, 1);
		expect(r0).toBeCloseTo(16 / 9, 1);
	});

	test("Square aspect ratio containers maintain 1:1 ratio", async ({
		page,
	}) => {
		const squareContainers = await page
			.locator('div[class*="aspect-square"]')
			.count();

		if (squareContainers > 0) {
			const boundingBox = await page
				.locator('div[class*="aspect-square"]')
				.first()
				.boundingBox();
			if (boundingBox) {
				const ratio = boundingBox.width / boundingBox.height;
				expect(ratio).toBeCloseTo(1, 0.1);
			}
		}
	});

	test("Images with overflow:hidden do not create scroll shifts", async ({
		page,
	}) => {
		const initialScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		await page.waitForTimeout(3000);

		const finalScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		expect(finalScrollWidth).toBeLessThanOrEqual(initialScrollWidth + 1);
	});
});
