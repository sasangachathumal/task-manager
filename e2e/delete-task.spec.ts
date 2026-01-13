import { expect, test } from '@playwright/test';

test.describe('Task Deletion', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // create a task to delete
    await page.getByTestId('btn-new-task').click();
    await page.getByTestId('input-title').fill('Playwright Task');
    await page.getByTestId('input-desc').fill('Learning E2E testing');
    await page.getByTestId('submit-btn').click();
  });

  test('should cancel task deletion and keep the task in the list', async ({ page }) => {
    const taskName = 'Playwright Task';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await page.getByTestId('btn-delete').click();
    await page.getByTestId('btn-cancel').click();
    await page.getByTestId('btn-back-to-list').click();
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('should permanently delete a task after confirmation', async ({ page }) => {
    const taskName = 'Playwright Task';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await page.getByTestId('btn-delete').click();
    await page.getByTestId('btn-confirm').click();
    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.getByText(taskName)).not.toBeVisible();
  });
});
