import { expect, type Page } from '@playwright/test';

export class ServiceMenuPage {
  constructor(private readonly page: Page) {}

  // Fungsi: membuka service e-Bupot Unifikasi CTAS dari side navigation.
  async openEbupotUnifikasiCtas(): Promise<void> {
    if (this.page.url().includes('/ctas-ebupot-unifikasi')) {
      return;
    }

    await expect(this.page.locator('#ebupot-unifikasi')).toBeVisible();
    await this.page.locator('#ebupot-unifikasi > div.flex.items-center.item-side-nav').click();

    await expect(this.page.locator('#ebupot-unifikasi > div.sub-child')).toBeVisible();
    await this.page
      .locator('#ebupot-unifikasi > div.sub-child')
      .getByText('e-Bupot Unifikasi CTAS')
      .click();

    await expect(this.page).toHaveURL(/\/ctas-ebupot-unifikasi/);
  }
}
