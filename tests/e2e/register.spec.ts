import { test, expect } from '@playwright/test';

test.describe('Register form', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('h2')).toHaveText('Registrarse');
    await page.locator('button[type="submit"]').click();

    // At least the required-field errors are displayed
    const errors = page.locator('small.error');
    await expect(errors.first()).toBeVisible();
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('valid data registers a new user and shows confirmation', async ({
    page,
  }) => {
    const unique = Date.now();
    const username = `test+${unique}@playwright.com`;

    await page.goto('/register');
    await page.locator('#name').fill('Playwright');
    await page.locator('#lastname').fill('Test');
    await page.locator('#birthdate').fill('1990-01-01');
    await page.locator('#username').fill(username);
    await page.locator('#password').fill('test1234');

    // Country select is populated from the countries API
    const country = page.locator('#country');
    if (await country.count()) {
      await country.selectOption({ index: 1 });
    }

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('#popUpDetailLogin h3')).toBeVisible();
    const message = await page.locator('#popUpDetailLogin h3').innerText();
    expect(message).not.toContain('Corregir los errores');
  });
});
