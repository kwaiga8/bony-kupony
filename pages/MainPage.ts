import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { iterateLocator } from '../support/utils';

export class MainPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async visit(): Promise<void> {
    await this.page.goto('https://couponfollow.com/');
  }

  get logo(): Locator {
    return this.page.locator('[data-func="logoClick"]');
  }

  get dealsSelector(): string {
    return `[data-func="showDeal"]`;
  }
  get allDeals(): Locator {
    return this.page.locator(this.dealsSelector);
  }

  get topOfTheTopDeals(): Locator {
    return this.page.locator(`.top-deal>>${this.dealsSelector}`);
  }

  //staff-picks
  get topDeals(): Locator {
    return this.page.locator(`.staff-pick>>${this.dealsSelector}`);
  }

  get trendingDeals(): Locator {
    return this.page.locator(`.trending-offer>>${this.dealsSelector}`);
  }

  async debug(): Promise<void> {
    await this.page.pause();
  }

  async shouldHaveCorrectLogo(): Promise<void> {
    await this.logo.isVisible();
    const title = await this.logo.getAttribute('title');
    expect(title.trim()).toBe('CouponFollow (go to the homepage)');
  }

  async checkTopDealsNumber(): Promise<void> {
    const allDealsNumber = await this.allDeals.count();
    const topOfTheTopDealsNumber = await this.topOfTheTopDeals.count();
    const topDealsNumber = await this.topDeals.count();
    const trendingDealsNumber = await this.trendingDeals.count();
    console.log(allDealsNumber + '\n' + topDealsNumber + '\n' + topOfTheTopDealsNumber + '\n' + trendingDealsNumber);
    expect(allDealsNumber, `All deals number should equal the trending deals the top 3 deals and the 3 or 6 staff picks`).toEqual(
      topOfTheTopDealsNumber + topDealsNumber + trendingDealsNumber,
    );
  }

  async dealsAreVisible() {
    expect(await this.allDeals.count(), `deals should be visible on the page`).toBeGreaterThan(0);
  }

  async topThreeDealsAreDisplayed() {
    for await (const element of iterateLocator(this.topOfTheTopDeals)) {
      await expect(element).toBeVisible();
      const text = await element.getAttribute('title');
      expect(text.trim(), `Standard title for element not found`).toContain('(opens in a new tab)');
    }
    expect(await this.topOfTheTopDeals.count()).toEqual(3);
  }

  async trendingDealsAreVisible() {
    const minimumTrendingDealsNo: number = 30;
    expect(await this.trendingDeals.count()).toBeGreaterThanOrEqual(minimumTrendingDealsNo);
    for (let i = 0; i < minimumTrendingDealsNo; i++) {
      await expect(await this.trendingDeals.nth(i)).toBeVisible();
    }
  }

  async staffPicksBannersHasCorrectValues() {
    for await (const element of iterateLocator(this.topDeals.locator('.title-container>> .title'))) {
      const text = await element.textContent();
      await expect(element, `${text.trim} banner should contain monetary, percentage or text values`).toContainText(
        /(\$)|(\%)|(.*)/,
      );
    }
  }

  async staffPicksAreUnique() {
    let staffPicksTexts: string[] = [];
    for await (const element of iterateLocator(this.topDeals.locator('.merch'))) {
      const text = await element.textContent();
      staffPicksTexts.push(text);
    }
    expect(
      staffPicksTexts.every((e, i, a) => a.indexOf(e) === i),
      `name of companies should be unique ${staffPicksTexts}`,
    ).toBeTruthy();
  }
}
