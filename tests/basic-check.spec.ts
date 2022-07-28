import test from '@lib/BaseTest';

test(`Check basic display of main Coupon Follow page`, async ({ mainPage }) => {
  await mainPage.visit();
  await mainPage.shouldHaveCorrectLogo();
});
