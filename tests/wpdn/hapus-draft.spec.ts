import { test } from '@fixtures/wpdn.fixture';
import { openWpdnModule } from '@fixtures/wpdn.fixture';
import { testData } from '@utils/test-data';

test.describe('WPDN - Hapus Draft', () => {
  test.beforeEach(async ({ dashboardPage, page, serviceMenuPage, wpdnPage }) => {
    await openWpdnModule({ dashboardPage, page, serviceMenuPage, wpdnPage });
  });

  test('user can delete an existing draft', async ({ wpdnPage }) => {
    const { draftName, searchNoBupot } = testData.wpdn.uploadSingle;

    await test.step('Find the target draft before deletion', async () => {
      await wpdnPage.searchNoBupot(searchNoBupot);
      await wpdnPage.expectDraftVisible(draftName);
    });

    await test.step('Delete the draft and confirm the action', async () => {
      await wpdnPage.deleteDraft();
    });

    await test.step('Verify the application shows a successful deletion state', async () => {
      await wpdnPage.expectSuccessToast();
    });
  });
});
