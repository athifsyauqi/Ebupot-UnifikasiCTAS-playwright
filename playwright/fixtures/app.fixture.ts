import { test as base } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { LoginPage } from '@pages/login.page';
import { ServiceMenuPage } from '@pages/service-menu.page';
import { WpdnPage } from '@pages/wpdn.page';

type AppFixtures = {
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
  serviceMenuPage: ServiceMenuPage;
  wpdnPage: WpdnPage;
};

export const test = base.extend<AppFixtures>({
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  serviceMenuPage: async ({ page }, use) => {
    await use(new ServiceMenuPage(page));
  },
  wpdnPage: async ({ page }, use) => {
    await use(new WpdnPage(page));
  }
});

export { expect } from '@playwright/test';
