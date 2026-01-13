import { expect, test } from '@playwright/test';

test.describe('Pagination Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between pages using number buttons', async ({ page }) => {
    let page1Button = page.getByTestId('page-active-btn');
    let page2Button = page.getByTestId('page-btn');

    await expect(page1Button).toHaveClass(/bg-blue-600/);

    await page2Button.click();

    page1Button = page.getByTestId('page-btn');
    page2Button = page.getByTestId('page-active-btn');

    await expect(page2Button).toHaveClass(/bg-blue-600/);
    await expect(page1Button).not.toHaveClass(/bg-blue-600/);

    await page1Button.click();
  });

  test('should navigate using Next and Previous arrows', async ({ page }) => {
    const nextButton = page.getByTestId('next-btn');
    const prevButton = page.getByTestId('prev-btn');

    await nextButton.click();
    await expect(page.getByTestId('page-active-btn')).toHaveClass(/bg-blue-600/);
    await expect(page.getByTestId('page-active-btn')).toHaveText('2');

    await prevButton.click();
    await expect(page.getByTestId('page-active-btn')).toHaveClass(/bg-blue-600/);
    await expect(page.getByTestId('page-active-btn')).toHaveText('1');
  });
});
