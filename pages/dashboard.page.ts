import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  // Fungsi: memastikan user sudah berada di dashboard.
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  // Fungsi: memilih company aktif dari dropdown dashboard.
  async selectCompany(npwp: string): Promise<void> {
    const trigger = this.page.locator(
      '#select-company-navbar > div.select-label.mr-auto.value-dropdown-company.card-view > div > svg'
    );

    await trigger.click({ force: true });

    await expect(
      this.page.locator('#select-company-navbar > div.select-options.list-plan.card-options')
    ).toBeVisible();

    await this.page
      .locator('div.select-option.card-option, label.select-box__option')
      .filter({ hasText: npwp })
      .first()
      .scrollIntoViewIfNeeded();

    await this.page
      .locator('div.select-option.card-option, label.select-box__option')
      .filter({ hasText: npwp })
      .first()
      .click({ force: true });

    await expect(
      this.page.locator(
        '#select-company-navbar > div.select-label.mr-auto.value-dropdown-company.card-view'
      )
    ).toContainText(npwp);
  }
}
