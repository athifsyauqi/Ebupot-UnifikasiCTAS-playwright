import { test, expect } from '@playwright/test';

test.describe('Authentication - Positive', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginUrl = process.env.LOGIN_URL ?? '/login';
    const username = process.env.APP_USERNAME ?? 'horecir498@nozamas.com';
    const password = process.env.PASSWORD ?? 'Pajakio!123';

    // Step 1: Buka halaman login.
    await page.goto(loginUrl);

    // Step 2: Isi username valid.
    await page.getByPlaceholder('email@contoh.com atau 081234567890').clear();
    await page.getByPlaceholder('email@contoh.com atau 081234567890').fill(username);

    // Step 3: Isi password valid.
    await page.getByPlaceholder('********').clear();
    await page.getByPlaceholder('********').fill(password);

    // Step 4: Klik tombol Masuk.
    await page.getByRole('button', { name: /^Masuk$/i }).click();

    // Step 5: Pastikan user masuk ke dashboard.
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });
});
