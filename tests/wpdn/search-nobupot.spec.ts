import { test } from '@fixtures/wpdn.fixture';
import { openWpdnModule } from '@fixtures/wpdn.fixture';
import { testData } from '@utils/test-data';

test.describe('WPDN - Search NoBupot', () => {
  test.beforeEach(async ({ dashboardPage, page, serviceMenuPage, wpdnPage }) => {
    await openWpdnModule({ dashboardPage, page, serviceMenuPage, wpdnPage });
  });

  test('user can search existing NoBupot data', async ({ wpdnPage }) => {
    const { searchNoBupot } = testData.wpdn.uploadSingle;

    await test.step('Search data using a known NoBupot value', async () => {
      await wpdnPage.searchNoBupot(searchNoBupot);
    });

    await test.step('Open detail data from the search result', async () => {
      await wpdnPage.openDraftDetail();
    });
  });
});
