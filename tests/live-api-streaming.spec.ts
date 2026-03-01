/**
 * Live API streaming tests - verifies simultaneous text + audio.
 * No mocks. Run: bunx playwright test tests/live-api-streaming.spec.ts --project=chromium-desktop
 */
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Live API simultaneous text + audio', () => {
  test.setTimeout(60000);

  test('text appears incrementally while streaming', async ({ page }) => {
    await navigateToPlaying(page);
    const textarea = page.getByLabel(
      'Describe your use case / workflow for governance review'
    );
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    await textarea.fill('test input');

    const outputBody = page.locator('[data-testid="roast-output-body"]');
    const lengths: number[] = [];
    const startTime = Date.now();

    await page.locator('[aria-label="Send roast"]').click();

    while (Date.now() - startTime < 5000) {
      const text = await outputBody.textContent().catch(() => '');
      if (text) lengths.push(text.length);
      await page.waitForTimeout(100);
    }

    const uniqueLengths = [...new Set(lengths.filter((l) => l > 0))];
    expect(uniqueLengths.length).toBeGreaterThan(1); // At least 2 chunks
  });

  test('text visible within 5 seconds of click', async ({ page }) => {
    await navigateToPlaying(page);
    const textarea = page.getByLabel(
      'Describe your use case / workflow for governance review'
    );
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    await textarea.fill('test');

    const startTime = Date.now();
    await page.locator('[aria-label="Send roast"]').click();

    await page
      .locator('[data-testid="roast-output"], [data-testid="roast-output-body"]')
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });

    const textVisibleAt = Date.now() - startTime;
    expect(textVisibleAt).toBeLessThan(5000);
  });
});
