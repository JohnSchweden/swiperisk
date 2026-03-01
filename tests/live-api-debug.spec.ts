/**
 * Debug test - captures console and errors to diagnose Live API issues
 */
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

test('capture errors when roast fails', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  await navigateToPlaying(page);
  const textarea = page.getByLabel(
    'Describe your use case / workflow for governance review'
  );
  await textarea.waitFor({ state: 'visible', timeout: 10000 });
  await textarea.fill('test');

  await page.locator('[aria-label="Send roast"]').click();

  await page.waitForTimeout(10000);

  const output = await page.locator('[data-testid="roast-output"]').textContent().catch(() => null);
  const body = await page.locator('[data-testid="roast-output-body"]').textContent().catch(() => null);

  console.log('Output:', output);
  console.log('Body:', body);
  console.log('Errors:', errors);
  console.log('Recent logs:', logs.filter((l) => l.includes('Gemini') || l.includes('roast') || l.includes('Error')).slice(-20));

  expect(errors, errors.join('\n')).toHaveLength(0);
});
