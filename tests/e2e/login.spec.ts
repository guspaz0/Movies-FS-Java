import { test, expect } from "@playwright/test";

const VALID_USER = { username: "jhon@cac.com", password: "gusta10" };

test.describe("Login form validation", () => {
  test("shows errors for empty and invalid input", async ({ page }) => {
    await page.goto("/login");

    // Empty username
    await page.locator("#username").fill("a", { timeout: 3000 });
    await page.locator("#username").blur();
    await expect(page.locator("small.error").first()).toContainText(
      "El nombre de usuario debe tener mas de 3 digitos",
    );

    // Invalid email
    await page.locator("#username").fill("not-an-email");
    await page.locator("#username").blur();
    await expect(page.locator("small.error").first()).toContainText(
      "Debe ser un email valido",
    );

    // Empty password
    await page.locator("#password").fill("");
    await page.locator("#password").blur();
    await expect(page.locator("small.error").last()).toContainText(
      "El campo no puede estar vacio",
    );
  });

  test("submit with errors shows popup and does not log in", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.locator("#username").fill("not-an-email");
    await page.locator("#username").blur();
    await page.locator("#submit").click();

    await expect(page.locator("#popUpDetailLogin h3")).toContainText(
      "Corregir los errores del formulario",
    );
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Login against backend", () => {
  test("logs in with valid credentials and redirects to home", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.locator("#username").fill(VALID_USER.username);
    await page.locator("#password").fill(VALID_USER.password);
    await page.locator("#submit").click();

    await expect(page.locator("#popUpDetailLogin h3")).toContainText(
      "Bienvenido",
    );
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });

    const userData = await page.evaluate(() =>
      sessionStorage.getItem("userData"),
    );
    expect(JSON.parse(userData ?? "null")).toMatchObject({
      username: VALID_USER.username,
    });
  });

  test("rejects invalid password", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#username").fill(VALID_USER.username);
    await page.locator("#password").fill("wrong-password");
    await page.locator("#submit").click();

    await page.waitForTimeout(2000);
    // No welcome popup, still on login page, no session stored
    await expect(page.locator("#popUpDetailLogin h3")).not.toContainText(
      "Bienvenido",
    );
    await expect(page).toHaveURL(/\/login$/);
    const userData = await page.evaluate(() =>
      sessionStorage.getItem("userData"),
    );
    expect(userData).toBeNull();
  });
});
