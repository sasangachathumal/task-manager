import { expect, test } from '@playwright/test';

test.describe('Task Editing Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // create a task to edit
    await page.getByTestId('btn-new-task').click();
    await page.getByTestId('input-title').fill('Playwright Task');
    await page.getByTestId('input-desc').fill('Learning E2E testing');
    await page.getByTestId('submit-btn').click();
  });

  test('should edit task title and description', async ({ page }) => {
    const taskName = 'Playwright Task';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await page.getByTestId('btn-edit').click();

    await page.getByTestId('input-title').fill('Updated Task Title');
    await page.getByTestId('input-desc').fill('Updated description content');
    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('txt-detail-title')).toHaveText('Updated Task Title');
    await expect(page.getByTestId('txt-detail-desc')).toHaveText('Updated description content');
  });

  test('should update task status from Pending to Inprogress', async ({ page }) => {
    const taskName = 'Playwright Task';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await page.getByTestId('btn-edit').click();

    await page.getByTestId('status-selector').selectOption('In Progress');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('txt-detail-status')).toHaveText('In Progress');
  });

  test('should update task status from Pending through Done', async ({ page }) => {
    const taskName = 'Playwright Task';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await page.getByTestId('btn-edit').click();

    await page.getByTestId('status-selector').selectOption('Done');
    await page.getByTestId('submit-btn').click();
    await expect(page.getByTestId('txt-detail-status')).toHaveText('Done');
  });

});
