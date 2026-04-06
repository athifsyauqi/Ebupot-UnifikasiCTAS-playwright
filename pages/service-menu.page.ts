import { expect, type Page } from '@playwright/test';

export class ServiceMenuPage {
  constructor(private readonly page: Page) {}

  // Fungsi: membuka service e-Bupot Unifikasi CTAS dari side navigation.
  async openEbupotUnifikasiCtas(): Promise<void> {
    if (this.page.url().includes('/ctas-ebupot-unifikasi')) {
      return;
    }

    const ebupotUnifikasiButton = this.page.getByRole('button', {
      name: /^e-Bupot Unifikasi$/i
    });

    await expect(ebupotUnifikasiButton).toBeVisible();
    await ebupotUnifikasiButton.click();

    await expect(this.page).toHaveURL(/\/ctas-ebupot-unifikasi/);
  }
}
