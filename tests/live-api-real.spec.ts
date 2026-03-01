/**
 * Live API test: roast_con.exe with real input. Run headed to hear audio:
 *   bunx playwright test tests/live-api-real.spec.ts --headed --project=chromium-desktop
 */
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({
  baseURL: 'http://localhost:3000',
  launchOptions: { headless: false },
});

test('roast_con.exe: input triggers instant Live API audio', async ({ page }) => {
  test.setTimeout(90000);
  await navigateToPlaying(page);

  const roastTextarea = page.getByLabel(
    'Describe your use case / workflow for governance review'
  );
  await roastTextarea.waitFor({ state: 'visible', timeout: 10000 });
  await roastTextarea.fill("I don't ever know what the test is");

  const roastButton = page.locator('[aria-label="Send roast"]');
  await roastButton.click();

  const outputElement = page.locator('[data-testid="roast-output"]');
  await outputElement.waitFor({ state: 'visible', timeout: 20000 });

  const text = await outputElement.textContent();
  expect(text).not.toContain('Roast service unavailable');
  expect(text?.length).toBeGreaterThan(0);

  // Wait for full audio playback before closing (roast ~5-15s)
  await page.waitForTimeout(18000);
});
