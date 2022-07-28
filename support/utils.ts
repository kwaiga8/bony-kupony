import { Locator } from '@playwright/test';

export async function* iterateLocator(locator: Locator): AsyncGenerator<Locator> {
  for (let index = 0; index < (await locator.count()); index++) {
    yield locator.nth(index);
  }
}
