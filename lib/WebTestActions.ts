import type { Page } from '@playwright/test';
export class WebTestActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElementAttached(locator: string): Promise<void> {
    await this.page.waitForSelector(locator);
  }

  async delay(timeInMilliseconds: number): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeInMilliseconds);
    });
  }
}
