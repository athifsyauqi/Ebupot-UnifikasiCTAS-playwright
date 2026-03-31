import { test as base, expect } from '@fixtures/app.fixture';
import { requireEnv } from '@utils/env';

type AuthFixtures = {
  ensureAuthenticated: void;
};

export const test = base.extend<AuthFixtures>({
  ensureAuthenticated: [
    async ({ dashboardPage, loginPage, page }, use: (value: void) => Promise<void>) => {
      const username = process.env.USERNAME;
      const password = process.env.PASSWORD;

      if (username && password) {
        await loginPage.open();
        await loginPage.loginIfVisible(requireEnv('USERNAME'), requireEnv('PASSWORD'));
        await loginPage.expectLoginSuccess();
        await dashboardPage.expectLoaded();
        await expect(page).not.toHaveURL(/login/i);
      }

      await use(undefined);
    },
    { auto: true }
  ]
});

export { expect } from '@fixtures/app.fixture';
