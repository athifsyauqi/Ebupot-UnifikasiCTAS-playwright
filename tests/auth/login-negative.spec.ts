import { test, expect } from '@playwright/test';

test.describe('Authentication - Negative', () => {
  test('shows an error with invalid credentials', async ({ page }) => {
    const loginUrl = process.env.LOGIN_URL ?? '/login';
    const username = process.env.APP_USERNAME ?? 'horecir498@nozamas.com';

    // Step 1: Buka halaman login.
    await page.goto(loginUrl);

    // Step 2: Isi username valid.
    await page.getByPlaceholder('email@contoh.com atau 081234567890').clear();
    await page.getByPlaceholder('email@contoh.com atau 081234567890').fill(username);

    // Step 3: Isi password yang salah.
    await page.getByPlaceholder('********').clear();
    await page.getByPlaceholder('********').fill('wrongpass');

    // Step 4: Klik tombol Masuk.
    await page.getByRole('button', { name: /^Masuk$/i }).click();

    // Step 5: Pastikan pesan error tampil dan tetap di halaman login.
    await expect(page.getByText(/kata sandi salah/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
