import { expect, test } from '@playwright/test';

test.describe('Task Sorting', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should sort tasks by Title (Alphabetical)', async ({ page }) => {
    await page.getByTestId('select-tasks-sort').selectOption('Title');

    const titles = page.getByTestId('task-list-item');

    await expect(titles.first()).toHaveText(/Fix login issue/i);
    await expect(titles.last()).toHaveText(/Update documentation/i);
  });

  test('should sort tasks by Status', async ({ page }) => {
    await page.getByTestId('select-tasks-sort').selectOption('Status');

    const firstTaskStatus = page.getByTestId('task-list-item').first().getByTestId('txt-item-status');

    await expect(firstTaskStatus).toHaveText(/Done/i);
  });

  test('should sort tasks by Created Date', async ({ page }) => {
    await page.getByTestId('select-tasks-sort').selectOption('Created');

    const firstTaskTitle = await page.getByTestId('task-list-item').first().textContent();
    expect(firstTaskTitle).toContain('Implement Search');
  });
});
