import { test as base } from '@fixtures/app.fixture';
import { requireEnv } from '@utils/env';

export const test = base;

// Fungsi shared untuk membuka modul WPDN dari awal sesi user.
export async function openWpdnModule(args: Parameters<typeof test.beforeEach>[0] extends never ? never : {
  dashboardPage: {
    selectCompany(npwp: string): Promise<void>;
  };
  page: {
    goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<unknown>;
    locator(selector: string): {
      clear(): Promise<void>;
      fill(value: string): Promise<void>;
      click(): Promise<void>;
    };
    getByRole(role: 'button', options: { name: RegExp }): {
      click(): Promise<void>;
    };
    getByPlaceholder(value: string): {
      clear(): Promise<void>;
      fill(value: string): Promise<void>;
    };
    waitForURL(url: RegExp, options?: { timeout?: number }): Promise<void>;
  };
  serviceMenuPage: {
    openEbupotUnifikasiCtas(): Promise<void>;
  };
  wpdnPage: {
    expectPageReady(): Promise<void>;
    dismissVisibleAlertNotifications(): Promise<void>;
  };
}): Promise<void> {
  const companyNpwp = process.env.COMPANY_NPWP ?? '0717166367077000';
  const loginUrl = process.env.LOGIN_URL ?? '/login';
  const username = requireEnv('APP_USERNAME');
  const password = requireEnv('PASSWORD');

  // Step 1: Login ke aplikasi.
  await args.page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
  await args.page.getByPlaceholder('email@contoh.com atau 081234567890').clear();
  await args.page.getByPlaceholder('email@contoh.com atau 081234567890').fill(username);
  await args.page.getByPlaceholder('********').clear();
  await args.page.getByPlaceholder('********').fill(password);
  await args.page.getByRole('button', { name: /^Masuk$/i }).click();
  await args.page.waitForURL(/\/dashboard/, { timeout: 15_000 });

  // Step 2: Pilih company aktif yang akan dipakai test.
  await args.dashboardPage.selectCompany(companyNpwp);

  // Step 3: Buka menu e-Bupot Unifikasi CTAS dan pastikan halaman siap.
  await args.serviceMenuPage.openEbupotUnifikasiCtas();
  await args.wpdnPage.expectPageReady();
  await args.wpdnPage.dismissVisibleAlertNotifications();
}

export { expect } from '@fixtures/app.fixture';
