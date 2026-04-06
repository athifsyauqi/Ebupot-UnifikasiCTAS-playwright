import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // Fungsi: memastikan user sudah berada di dashboard.
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  // Fungsi: memilih company aktif dari dropdown dashboard.
  async selectCompany(npwp: string): Promise<void> {
    const activeCompanyCard = this.page.locator('.company-card').first();

    if (await activeCompanyCard.locator('.company-npwp').filter({ hasText: npwp }).count()) {
      await expect(activeCompanyCard).toContainText(npwp);
      return;
    }

    await activeCompanyCard.click({ force: true });

    const targetCompanyCard = this.page.locator('.company-card').filter({ hasText: npwp }).last();

    await expect(targetCompanyCard).toBeVisible();
    await targetCompanyCard.scrollIntoViewIfNeeded();
    await targetCompanyCard.click({ force: true });

    await expect(activeCompanyCard).toContainText(npwp);
  }
}
