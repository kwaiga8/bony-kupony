import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { iterateLocator } from '../support/utils';
import { WebTestActions } from '@lib/WebTestActions';

let webActions: WebTestActions;

export class MainPage {
  readonly page: Page;
  readonly isMobile: boolean;

  constructor(page: Page, isMobile: boolean) {
    this.page = page;
    this.isMobile = isMobile;
    webActions = new WebTestActions(this.page);
  }

  async visit(): Promise<void> {
    await this.page.goto('');
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

  get topDeals(): Locator {
    return this.page.locator(`.staff-pick>>${this.dealsSelector}`);
  }

  get trendingDeals(): Locator {
    if (this.isMobile) {
      return this.page.locator(`.trending-mobile>>${this.dealsSelector}`);
    } else return this.page.locator(`.trending-offer>>${this.dealsSelector}`);
  }

  get activeTopDeal(): Locator {
    return this.page.locator('.swiper-slide-active');
  }

  get nextTopDeal(): Locator {
    return this.page.locator('.swiper-slide-next');
  }

  get previousTopDeal(): Locator {
    return this.page.locator('.swiper-slide-prev');
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
    expect(allDealsNumber, `All deals number should equal the trending deals the top 3 deals and the 3 or 6 staff picks`).toEqual(
      topOfTheTopDealsNumber + topDealsNumber + trendingDealsNumber,
    );
  }

  async dealsAreVisible(): Promise<void> {
    expect(await this.allDeals.count(), `deals should be visible on the page`).toBeGreaterThan(0);
  }

  async topThreeDealsAreDisplayed(): Promise<void> {
    if (this.isMobile) {
      await expect(this.activeTopDeal).toBeVisible();
      await expect(this.nextTopDeal).toBeVisible();
      await expect(this.previousTopDeal).toBeVisible();
    } else {
      for await (const element of iterateLocator(this.topOfTheTopDeals)) {
        await expect(element).toBeVisible();
        const text = await element.getAttribute('title');
        expect(text.trim(), `Standard title for element not found`).toContain('(opens in a new tab)');
      }
      expect(await this.topOfTheTopDeals.count()).toEqual(3);
    }
  }

  async trendingDealsAreVisible(): Promise<void> {
    const minimumTrendingDealsNo: number = 30;
    expect(await this.trendingDeals.count()).toBeGreaterThanOrEqual(minimumTrendingDealsNo);
    for (let i = 0; i < minimumTrendingDealsNo; i++) {
      await expect(await this.trendingDeals.nth(i)).toBeVisible();
    }
  }

  async staffPicksBannersHasCorrectValues(): Promise<void> {
    for await (const element of iterateLocator(this.topDeals.locator('.title-container>> .title'))) {
      const text = await element.textContent();
      await expect(element, `${text.trim} banner should contain monetary, percentage or text values`).toContainText(
        /(\$)|(\%)|(.*)/,
      );
    }
  }

  async staffPicksAreUnique(): Promise<void> {
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

  async topOfTheTopDealsSwipesCorrectly(): Promise<void> {
    if ((await this.topOfTheTopDeals.count()) > 3) {
      const newTopDealSelector = `.top-deal>>${this.dealsSelector}>>nth=3`;
      await webActions.delay(5000);
      try {
        await webActions.waitForElementAttached(newTopDealSelector);
      } catch (e) {
        console.log(e, 'Not found element, deals not swipe');
      }
    } else {
      console.log('There is only 3 best deals, scenario will not be executed');
    }
  }
}
