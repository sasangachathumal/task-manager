import { expect, test } from '@playwright/test';

test.describe('Search and Filter Logic', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should filter the list based on search term', async ({ page }) => {
    const searchInput = page.getByTestId('input-task-search');

    await searchInput.fill('fix');
    await expect(page.getByTestId('task-list-item').first()).toContainText(/fix/i);
    await searchInput.fill('upda');
    await expect(page.getByTestId('task-list-item').first()).toContainText(/upda/i);
  });

  test('should show all tasks when search is cleared', async ({ page }) => {
    const searchInput = page.getByTestId('input-task-search');

    await searchInput.fill('fix');
    await expect(page.getByTestId('task-list-item')).toHaveCount(1);
    await searchInput.fill('');
    await expect(async () => {
      const count = await page.getByTestId('task-list-item').count();
      expect(count).toBeGreaterThan(1);
    }).toPass();
  });
});
