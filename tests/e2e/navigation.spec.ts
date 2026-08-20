import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page renders carousel and navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#carouselExampleCaptions')).toBeVisible();
    await expect(page.locator('header h1')).toHaveText('Peliculas y Series');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navbar links navigate between pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Peliculas' }).click();
    await expect(page).toHaveURL(/\/peliculas$/);

    await page.getByRole('link', { name: 'Nosotros' }).click();
    await expect(page).toHaveURL(/\/nosotros$/);
    await expect(page.locator('h1')).toHaveText('Codo a codo');

    await page.getByRole('link', { name: 'Iniciar Sesion' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
