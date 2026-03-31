import { test } from '@fixtures/wpdn.fixture';
import { buildDraftDocumentNumber } from '@utils/document-number';
import { testData } from '@utils/test-data';
import { openWpdnModule } from '@fixtures/wpdn.fixture';

test.describe('WPDN - Create Draft', () => {
  // beforeEach ini dipakai untuk flow yang selalu sama:
  // login -> pilih company -> buka menu e-Bupot Unifikasi CTAS.
  test.beforeEach(async ({
    dashboardPage,
    loginPage,
    page,
    serviceMenuPage,
    wpdnPage
  }) => {
    await openWpdnModule({ dashboardPage, page, serviceMenuPage, wpdnPage });
  });

  test('user can create an ebupot draft from the CTAS form', async ({ wpdnPage }) => {
    const nitkuValue =
      process.env.EBUPOT_NITKU ?? 'NAMA0717166367077000 - 0717166367077000000000';
    const draft = testData.wpdn.createDraft;
    const documentNumber = buildDraftDocumentNumber();

    // Step 1: Buka form Rekam Bukti Potong dari halaman CTAS.
    await test.step('Open the Rekam Bukti Potong form', async () => {
      await wpdnPage.openRecordBuktiPotongForm();
    });

    // Step 2: Isi tanggal pemotongan dan masa pajak draft.
    await test.step('Set the withholding date and tax period for the draft', async () => {
      await wpdnPage.chooseWithholdingDate(draft.withholdingDateDay);
      await wpdnPage.expectWithholdingDateValue(/^01\s+\w+\s+2026$/);
      await wpdnPage.chooseTaxPeriod(draft.taxPeriod);
    });

    // Step 3: Pilih lawan dipotong, jenis pajak, dan objek pajak.
    await test.step('Select the counterparty, tax type, and tax object', async () => {
      await wpdnPage.selectCounterparty(draft.counterpartySearch, draft.counterpartyLabel);
      await wpdnPage.selectTaxType(draft.taxType);
      await wpdnPage.selectTaxObject(draft.taxObjectSearch, draft.taxObjectLabel);
    });

    // Step 4: Isi nilai bruto dan dokumen pendukung transaksi.
    await test.step('Fill the gross income amount and supporting document data', async () => {
      await wpdnPage.fillGrossIncome(draft.grossIncome);
      await wpdnPage.addSupportingDocument(
        draft.documentType,
        documentNumber,
        draft.documentDate
      );
    });

    // Step 5: Pilih NITKU lalu simpan draft.
    await test.step('Select the NITKU and save the draft', async () => {
      await wpdnPage.selectNitku(nitkuValue);
      await wpdnPage.saveDraft();
    });

    // Step 6: Pastikan draft berhasil dibuat.
    await test.step('Verify the application confirms draft creation', async () => {
      await wpdnPage.expectSuccessToast(draft.successMessage);
    });
  });
});
