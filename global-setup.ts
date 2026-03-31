import 'dotenv/config';
import { chromium, type FullConfig } from '@playwright/test';
import path from 'node:path';

async function dismissSessionExpiredModalIfPresent(page: import('@playwright/test').Page): Promise<void> {
  const backToSignInButton = page.getByRole('button', { name: /Kembali Sign In/i });

  if (await backToSignInButton.isVisible().catch(() => false)) {
    await backToSignInButton.click();
  }
}

async function globalSetup(config: FullConfig): Promise<void> {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const loginPath = process.env.LOGIN_URL ?? '/login';
  const baseURL = config.projects[0]?.use?.baseURL;

  if (!baseURL || !username || !password) {
    console.log('Global setup skipped: BASE_URL, USERNAME, or PASSWORD is missing.');
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const storagePath = path.resolve('.auth/user.json');

  await page.goto(`${baseURL}${loginPath}`, { waitUntil: 'domcontentloaded' });
  await dismissSessionExpiredModalIfPresent(page);
  await page.locator('#signin-email').waitFor({ state: 'visible', timeout: 60_000 });
  await page.locator('#signin-email').fill(username);
  await page.locator('#signin-passowrd').fill(password);
  await page.locator('#signin-button').click();
  await page.waitForURL(/\/dashboard/, { timeout: 60_000 });

  await page.context().storageState({ path: storagePath });
  await browser.close();
}

export default globalSetup;
