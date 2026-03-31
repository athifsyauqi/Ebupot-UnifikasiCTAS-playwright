import { test, expect } from '@playwright/test';

test.describe('Authentication - Negative', () => {
  test('shows an error with invalid credentials', async ({ page }) => {
    // Step 1: Buka halaman login.
    await page.goto('/login');

    // Step 2: Isi username valid.
    await page.locator('input[placeholder="email@anda.com"]').clear();
    await page.locator('input[placeholder="email@anda.com"]').fill(
      'pengentestefaktur@yopmail.com'
    );

    // Step 3: Isi password yang salah.
    await page.locator('input[placeholder="Masukkan password"]').clear();
    await page.locator('input[placeholder="Masukkan password"]').fill('wrongpass');

    // Step 4: Klik tombol Masuk.
    await page.getByRole('button', { name: /^Masuk$/i }).click();

    // Step 5: Pastikan pesan error tampil dan tetap di halaman login.
    await expect(
      page.getByText('GAGAL MASUK, SILAHKAN COBA LAGI ATAU HUBUNGI ADMIN')
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
