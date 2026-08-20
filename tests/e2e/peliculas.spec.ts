import { test, expect } from '@playwright/test';

test.describe('Peliculas page (local API)', () => {
  test('lists movies from the local backend', async ({ page }) => {
    await page.goto('/peliculas');

    await expect(page.locator('.cardMovie').first()).toBeVisible();
    await expect(page.locator('#pagination')).toContainText('Pagina 1 de');
  });

  test('search filters the movie list', async ({ page }) => {
    await page.goto('/peliculas');
    await expect(page.locator('.cardMovie').first()).toBeVisible();

    const firstTitle = await page
      .locator('.cardMovie h4')
      .first()
      .innerText();

    await page.locator('#searchMovie').fill(firstTitle);
    await page.locator('#searchMovie').press('Enter');
    await page.waitForTimeout(1500);

    const titles = await page.locator('.cardMovie h4').allInnerTexts();
    expect(titles.length).toBeGreaterThan(0);
    expect(
      titles.every((t) => t.toLowerCase().includes(firstTitle.toLowerCase())),
    ).toBeTruthy();
  });

  test('pagination next/previous buttons work', async ({ page }) => {
    await page.goto('/peliculas');
    await expect(page.locator('.cardMovie').first()).toBeVisible();

    const firstTitlePage1 = await page
      .locator('.cardMovie h4')
      .first()
      .innerText();

    const next = page.locator('#next');
    if (await next.isEnabled()) {
      await next.click();
      await page.waitForTimeout(1500);
      await expect(page.locator('#pagination')).toContainText('Pagina 2 de');

      await page.locator('#previous').click();
      await page.waitForTimeout(1500);
      await expect(page.locator('#pagination')).toContainText('Pagina 1 de');
      await expect(page.locator('.cardMovie h4').first()).toHaveText(
        firstTitlePage1,
      );
    }
  });

  test('movie card links to detail page', async ({ page }) => {
    await page.goto('/peliculas');
    await expect(page.locator('.cardMovie').first()).toBeVisible();

    const firstTitle = await page
      .locator('.cardMovie h4')
      .first()
      .innerText();

    await page.locator('.cardMovie').first().click();
    await expect(page).toHaveURL(/\/peliculas\/local\/\d+/);
    await expect(page.locator('h4, h1, h2, h3').first()).toContainText(
      firstTitle,
    );
  });

  test('add movie button links to the form', async ({ page }) => {
    await page.goto('/peliculas');
    await page.locator('#addMovie').click();
    await expect(page).toHaveURL(/\/peliculas\/add$/);
  });
});
