import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // Fungsi internal: menutup modal session-expired jika muncul di halaman login.
  async dismissSessionExpiredModalIfPresent(): Promise<void> {
    const backToSignInButton = this.page.getByRole('button', { name: /Kembali Sign In/i });

    if (await backToSignInButton.isVisible().catch(() => false)) {
      await backToSignInButton.click();
    }
  }

  // Fungsi: membuka halaman login aplikasi.
  async open(): Promise<void> {
    await this.page.goto(process.env.LOGIN_URL ?? '/login', { waitUntil: 'domcontentloaded' });
    await this.dismissSessionExpiredModalIfPresent();
    await this.page.locator('#signin-email').waitFor({ state: 'visible' });
  }

  // Fungsi: mengisi email dan password lalu submit login.
  async login(username: string, password: string): Promise<void> {
    await this.dismissSessionExpiredModalIfPresent();
    const emailInput = this.page.locator('#signin-email');
    const passwordInput = this.page.locator('#signin-passowrd');
    const signInButton = this.page.locator('#signin-button');

    await emailInput.waitFor({ state: 'visible' });
    await passwordInput.waitFor({ state: 'visible' });

    await emailInput.clear();
    await emailInput.fill(username);
    await expect(emailInput).toHaveValue(username);

    await passwordInput.clear();
    await passwordInput.fill(password);
    await expect(passwordInput).toHaveValue(password);

    await signInButton.waitFor({ state: 'visible' });
    await expect(signInButton).toBeEnabled();
    await signInButton.click();
  }

  // Fungsi: login positif dengan satu retry jika submit pertama masih gagal di halaman login.
  async loginUntilDashboard(username: string, password: string): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      await this.login(username, password);

      try {
        await this.page.waitForURL(/\/dashboard/, { timeout: 10_000 });
        return;
      } catch {
        if (attempt === 2) {
          throw new Error('Login did not reach dashboard after two attempts.');
        }

        await this.open();
      }
    }
  }

  // Fungsi: login hanya jika form login masih tampil.
  async loginIfVisible(username: string, password: string): Promise<void> {
    const emailInput = this.page.locator('#signin-email');

    if (await emailInput.count()) {
      await this.login(username, password);
    }
  }

  // Fungsi: validasi pesan error saat login gagal.
  async expectInvalidCredentialsError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
    await expect(this.page).toHaveURL(/\/login/);
  }

  // Fungsi: validasi login sukses dan user masuk ke dashboard.
  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  }
}
