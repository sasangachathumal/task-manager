import { expect, test } from '@playwright/test';

test.describe('Task Creation Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a new task and show it in the list', async ({ page }) => {
    await page.getByTestId('btn-new-task').click();
    await page.getByTestId('input-title').fill('Playwright Task');
    await page.getByTestId('input-desc').fill('Learning E2E testing');
    await page.getByTestId('submit-btn').click();

    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: 'Playwright Task'
    });
    await expect(taskItem).toBeVisible();
  });

  test('should close the dialog when cancel is clicked', async ({ page }) => {
    await page.getByTestId('btn-new-task').click();
    await page.getByTestId('btn-cancel').click();
    await expect(page.getByTestId('popup-form')).not.toBeVisible();
  });

});
