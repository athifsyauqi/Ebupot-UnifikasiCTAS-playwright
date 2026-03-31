import { expect, type Page } from '@playwright/test';

type DocumentDate = {
  day: number;
  month: string;
  year: number;
};

export class WpdnPage {
  constructor(private readonly page: Page) {}

  // Fungsi: membuka halaman utama CTAS e-Bupot Unifikasi.
  async open(): Promise<void> {
    await this.page.goto('/ctas-ebupot-unifikasi');
  }

  // Fungsi: memastikan halaman CTAS sudah terbuka.
  async expectPageReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/ctas-ebupot-unifikasi/);
  }

  // Fungsi: menutup alert/toast yang menutupi elemen form bila ada.
  async dismissVisibleAlertNotifications(): Promise<void> {
    const closeButton = this.page
      .locator(".alert-notification-wrapper button, .alert-notification-wrapper [aria-label='Close']")
      .filter({ visible: true })
      .first();

    if (await closeButton.count()) {
      await closeButton.click({ force: true });
    }
  }

  // Fungsi: membuka form Rekam Bukti Potong dari halaman list.
  async openRecordBuktiPotongForm(): Promise<void> {
    await this.page.getByText('Rekam Bukti Potong', { exact: true }).click();
  }

  // Fungsi: memilih tanggal pemotongan dari datepicker.
  async chooseWithholdingDate(day: number): Promise<void> {
    await this.page.locator('input[name="tanggal-pemotongan"]').click();
    await this.page.locator('[role="dialog"]').first().getByRole('gridcell', { name: String(day), exact: true }).click();
    await this.closeDatepicker();
  }

  // Fungsi: memvalidasi nilai tanggal pemotongan setelah dipilih.
  async expectWithholdingDateValue(expectedPattern: RegExp): Promise<void> {
    await expect(this.page.locator('input[name="tanggal-pemotongan"]')).toHaveValue(expectedPattern);
  }

  // Fungsi: memilih masa pajak dari datepicker bulan/tahun.
  async chooseTaxPeriod(value: string): Promise<void> {
    await this.page.locator('input[aria-label="Datepicker input"]').nth(1).click();
    await this.selectMonthYearFromDialog(value);
    await expect(this.page.locator('input[aria-label="Datepicker input"]').nth(1)).toHaveValue(value);
  }

  // Fungsi: memilih lawan dipotong pada dropdown pencarian.
  async selectCounterparty(searchValue: string, optionLabel: string): Promise<void> {
    await this.page.locator('input[placeholder="Pilih Lawan Dipotong"]').click({ force: true });
    const dropdown = this.page.locator('div.dropdown-content:visible').last();
    await dropdown.locator('input').first().fill(searchValue);
    await this.page.locator('div.pr-3.text-left, label.select-box__option').filter({ hasText: optionLabel }).first().click();
    await expect(this.page.locator('input[placeholder="Pilih Lawan Dipotong"]')).toHaveValue(optionLabel);
  }

  // Fungsi: memilih jenis pajak.
  async selectTaxType(taxType: string): Promise<void> {
    await this.page.locator('input[placeholder="Pilih jenis pajak"]').click({ force: true });
    await this.page.locator('div.dropdown-content:visible').last().locator('div.pr-3.text-left, label.select-box__option').filter({ hasText: taxType }).first().click({ force: true });
    await expect(this.page.locator('input[placeholder="Pilih jenis pajak"]')).toHaveValue(taxType);
  }

  // Fungsi: memilih kode objek pajak.
  async selectTaxObject(searchValue: string, optionLabel: string): Promise<void> {
    await this.page.locator('input[placeholder="Pilih objek pajak"]').click({ force: true });
    const dropdown = this.page.locator('div.dropdown-content:visible').last();
    await dropdown.locator('input[placeholder="Cari"]').fill(searchValue);
    await dropdown.locator('div.pr-3.text-left, label.select-box__option').filter({ hasText: optionLabel }).first().click({ force: true });
    await expect(this.page.locator('input[placeholder="Pilih objek pajak"]')).toHaveValue(optionLabel);
  }

  // Fungsi: mengisi jumlah penghasilan bruto.
  async fillGrossIncome(amount: string): Promise<void> {
    await this.page.locator('#inputCurrency').fill(amount);
  }

  // Fungsi: menambah dokumen referensi pendukung ke draft.
  async addSupportingDocument(documentType: string, documentNumber: string, documentDate: DocumentDate): Promise<void> {
    await this.page.locator('#button-tambah-dokref').click();
    await this.page.locator('input[placeholder="Pilih Jenis Dokumen"]').click({ force: true });
    await this.page.locator('div.dropdown-content:visible').last().locator('div, label, span').filter({ hasText: documentType }).first().click({ force: true });
    await this.page.locator('input[placeholder="Nomor Dokumen"]').fill(documentNumber);
    await this.fillDocumentDate(documentDate);
    await this.confirmDateIfButtonExists();
  }

  // Fungsi: memilih NITKU yang digunakan untuk draft.
  async selectNitku(value: string): Promise<void> {
    await this.page.locator('input[placeholder="Pilih NITKU"]').click({ force: true });
    const dropdown = this.page.locator('div.dropdown-content:visible').last();
    await dropdown.locator('input[placeholder="Cari"]').fill(value);
    await this.page.locator('div.pr-3.text-left, label.select-box__option').filter({ hasText: value }).first().click({ force: true });
    await expect(this.page.locator('input[placeholder="Pilih NITKU"]')).toHaveValue(value);
  }

  // Fungsi: menyimpan draft bukti potong.
  async saveDraft(): Promise<void> {
    await this.page.locator('#button-simpan-bupot').click();
  }

  // Fungsi: memvalidasi toast sukses dari aplikasi.
  async expectSuccessToast(message: string | RegExp = /berhasil|success/i): Promise<void> {
    const locator =
      typeof message === 'string' ? this.page.getByText(message) : this.page.getByText(message);
    await expect(locator).toBeVisible();
  }

  // Fungsi: mencari data berdasarkan NoBupot atau keyword list.
  async searchNoBupot(value: string): Promise<void> {
    await this.page.getByPlaceholder(/search|cari/i).fill(value);
    await this.page.keyboard.press('Enter');
  }

  // Fungsi: membuka detail draft dari hasil list.
  async openDraftDetail(): Promise<void> {
    await this.page.getByRole('button', { name: /detail|lihat detail/i }).first().click();
  }

  // Fungsi: menghapus draft dari action menu.
  async deleteDraft(): Promise<void> {
    await this.page.getByRole('button', { name: /hapus draft|delete draft/i }).click();
    await this.page.getByRole('button', { name: /ya|yes|confirm|hapus/i }).last().click();
  }

  // Fungsi: memvalidasi draft tampil pada list.
  async expectDraftVisible(draftName: string): Promise<void> {
    await expect(this.page.getByText(draftName)).toBeVisible();
  }

  // Fungsi internal: menutup datepicker agar input berikutnya bisa diakses.
  private async closeDatepicker(): Promise<void> {
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
    await this.page.keyboard.press('Escape');
  }

  // Fungsi internal: memilih bulan dan tahun dari dialog masa pajak.
  private async selectMonthYearFromDialog(value: string): Promise<void> {
    const [monthLabel, yearLabel] = value.split(' ');
    const targetYear = Number(yearLabel);
    const currentYear = new Date().getFullYear();
    const yearDifference = currentYear - targetYear;
    const dialog = this.page.locator('[role="dialog"]').first();

    if (yearDifference > 0) {
      for (let index = 0; index < yearDifference; index += 1) {
        await dialog.getByRole('button', { name: 'Previous year' }).click();
      }
    } else if (yearDifference < 0) {
      for (let index = 0; index < Math.abs(yearDifference); index += 1) {
        await dialog.getByRole('button', { name: 'Next year' }).click();
      }
    }

    const monthMap: Record<string, string> = {
      Januari: 'Jan',
      Februari: 'Feb',
      Maret: 'Mar',
      April: 'Apr',
      Mei: 'Mei',
      Juni: 'Jun',
      Juli: 'Jul',
      Agustus: 'Agu',
      September: 'Sep',
      Oktober: 'Okt',
      November: 'Nov',
      Desember: 'Des'
    };

    await dialog.getByRole('gridcell', { name: monthMap[monthLabel] ?? monthLabel }).click();
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
  }

  // Fungsi internal: mengisi tanggal dokumen dalam format yang diterima form.
  private async fillDocumentDate(documentDate: DocumentDate): Promise<void> {
    const monthMap: Record<string, string> = {
      Januari: '01',
      Februari: '02',
      Maret: '03',
      April: '04',
      Mei: '05',
      Juni: '06',
      Juli: '07',
      Agustus: '08',
      September: '09',
      Oktober: '10',
      November: '11',
      Desember: '12'
    };

    const monthNumber = monthMap[documentDate.month];

    if (!monthNumber) {
      throw new Error(`Bulan tidak dikenali: ${documentDate.month}`);
    }

    const formattedDate = `${documentDate.year}/${monthNumber}/${String(documentDate.day).padStart(2, '0')}`;
    await this.page.locator('input[name="tanggal-dokumen"]').fill(formattedDate);
  }

  // Fungsi internal: klik tombol simpan datepicker jika muncul.
  private async confirmDateIfButtonExists(): Promise<void> {
    const button = this.page.getByRole('button', { name: 'Simpan' }).filter({ visible: true }).first();

    if (await button.count()) {
      await button.click({ force: true });
    }
  }
}
