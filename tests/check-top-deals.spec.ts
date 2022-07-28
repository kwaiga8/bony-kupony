import test from '@lib/BaseTest';

test.beforeEach(async ({ mainPage }) => {
  await mainPage.visit();
});

test(`Validate that 3 out of 6 or 9 total Top Deal coupons are displayed.`, async ({ mainPage }) => {
  await mainPage.dealsAreVisible();
  await mainPage.topThreeDealsAreDisplayed();
  await mainPage.checkTopDealsNumber();
});

test(`Validate that at least 30 Today’s Trending Coupons are displayed on the main page.`, async ({ mainPage }) => {
  await mainPage.trendingDealsAreVisible();
});

test(`Validate that Staff Picks contains unique stores with proper discounts for monetary, percentage or text values.`, async ({
  mainPage,
}) => {
  await mainPage.staffPicksBannersHasCorrectValues();
  await mainPage.staffPicksAreUnique();
});
