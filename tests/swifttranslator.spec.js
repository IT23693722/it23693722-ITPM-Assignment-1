const { test, expect } = require('@playwright/test');

test('Positive test: Singlish to Sinhala translation', async ({ page }) => {
  await page.goto('https://swifttranslator.com');

  // Fill the first textarea found
  await page.locator('textarea').first().fill('mama gedhara yanavaa');

  // Wait a bit for translation to happen
  await page.waitForTimeout(2000);

  // Check that page contains Sinhala text (basic validation)
  await expect(page.locator('body')).toContainText('මම');
});
