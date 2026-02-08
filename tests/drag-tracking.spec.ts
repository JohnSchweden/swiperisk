import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Card Drag Tracking', () => {
  test('card follows drag gesture', async ({ page }) => {
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    // Find the current card (front card with z-index: 10)
    const card = await page.locator('div[style*="z-index: 10"]').first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Get initial transform
      const initialTransform = await card.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      console.log('Initial transform:', initialTransform);
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Move 50px to the right
      await page.mouse.move(startX + 50, startY, { steps: 5 });
      
      // Check transform during drag
      const midDragTransform = await card.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      console.log('Mid-drag transform:', midDragTransform);
      
      // The transform should have changed from initial (should include translateX)
      expect(midDragTransform).not.toBe(initialTransform);
      expect(midDragTransform).not.toBe('none');
      expect(midDragTransform).toContain('matrix');
      
      // Release
      await page.mouse.up();
      await page.waitForTimeout(600); // Wait for spring back
    }
  });
  
  test('card tracks drag position smoothly', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    const card = await page.locator('div[style*="z-index: 10"]').first();
    const box = await card.boundingBox();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Drag in steps and check transform updates
      const transforms = [];
      for (let i = 0; i <= 5; i++) {
        await page.mouse.move(startX + (i * 10), startY);
        await page.waitForTimeout(50);
        const transform = await card.evaluate(el => {
          return window.getComputedStyle(el).transform;
        });
        transforms.push(transform);
      }
      
      await page.mouse.up();
      
      // All transforms should be different (card is moving)
      const uniqueTransforms = new Set(transforms);
      console.log('Unique transforms during drag:', uniqueTransforms.size);
      expect(uniqueTransforms.size).toBeGreaterThan(1);
    }
  });
});
