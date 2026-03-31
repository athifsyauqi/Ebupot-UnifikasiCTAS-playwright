import { test, expect } from '@playwright/test';

test.describe('Authentication - Positive', () => {
  test('logs in with valid credentials', async ({ page }) => {
    // Step 1: Buka halaman login.
    await page.goto('/login');

    // Step 2: Isi username valid.
    await page.locator('input[placeholder="email@anda.com"]').clear();
    await page.locator('input[placeholder="email@anda.com"]').fill(
      'pengentestefaktur@yopmail.com'
    );

    // Step 3: Isi password valid.
    await page.locator('input[placeholder="Masukkan password"]').clear();
    await page.locator('input[placeholder="Masukkan password"]').fill('aaAA11!!');

    // Step 4: Klik tombol Masuk.
    await page.getByRole('button', { name: /^Masuk$/i }).click();

    // Step 5: Pastikan user masuk ke dashboard.
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });
});
