import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - Audit UI @area:layout", () => {
	test("shows Swipe left / Swipe right labels above fork badges", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		const leftLabel = page.getByText("Swipe left", { exact: true });
		const rightLabel = page.getByText("Swipe right", { exact: true });
		await expect(leftLabel).toBeVisible();
		await expect(rightLabel).toBeVisible();

		const leftBox = await leftLabel.boundingBox();
		const cyanBadge = page.locator(".bg-cyan-500\\/20").first();
		await expect(cyanBadge).toBeVisible();
		const badgeBox = await cyanBadge.boundingBox();
		expect(leftBox?.y).toBeLessThan(badgeBox?.y ?? 0);
	});

	test("one fork block per history entry", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		await expect(page.getByText("#1", { exact: true })).toBeVisible();
		await expect(page.getByText("#2", { exact: true })).toBeVisible();
	});

	test("reflection hint strip is centered under the header", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		await expect(
			page.locator("div.mb-6.text-center").filter({
				hasText: /Replay the forks mentally/i,
			}),
		).toBeVisible();
	});

	test("card descriptions show full text without expand toggles", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		await expect(page.getByText("show more")).toHaveCount(0);
		await expect(page.getByText("show less")).toHaveCount(0);
		await expect(page.getByText(/might miss edge cases/)).toBeVisible();
	});
});

test.describe("Debrief Page 2 - Fork consequences @area:gameplay", () => {
	test("safe (LEFT) branch uses cyan styling when chosen", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		const chosen = page.locator(".bg-cyan-500\\/20").filter({
			hasText: "Proper patch",
		});
		await expect(chosen).toBeVisible();
	});

	test("risky (RIGHT) branch uses amber when chosen and shows violation", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		const chosen = page.locator(".bg-amber-500\\/20").filter({
			hasText: "Quick fix",
		});
		await expect(chosen).toBeVisible();
		await expect(
			page.getByText(/Security Negligence \+ Vulnerability Exposure/i),
		).toBeVisible();
	});

	test("mixed LEFT and RIGHT decisions show distinct styling per entry", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});
		await page.getByRole("heading", { name: /incident audit log/i }).waitFor({
			timeout: 10000,
		});

		await expect(
			page.locator(".bg-cyan-500\\/20").filter({ hasText: "Proper patch" }),
		).toBeVisible();
		await expect(
			page.locator(".bg-amber-500\\/20").filter({ hasText: "Ship messy code" }),
		).toBeVisible();
	});
});
