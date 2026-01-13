import { expect, test } from '@playwright/test';

test.describe('Task Detail Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to task details and back to list', async ({ page }) => {
    const taskName = 'Fix login issue';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await expect(page).toHaveURL(/.*detail.*/);
    await expect(page.getByTestId('txt-detail-title')).toContainText(taskName);
    await page.getByTestId('btn-back-to-list').click();
    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.getByTestId('task-list-item')).toHaveCount(3);
  });

  test('should show correct content for different tasks', async ({ page }) => {
    const taskName = 'Update documentation';
    const taskItem = await page.getByTestId('task-list-item').filter({
      hasText: taskName
    });

    await taskItem.getByTestId('btn-details').click();
    await expect(page).toHaveURL(/.*detail.*/);
    await expect(page.getByTestId('txt-detail-title')).toContainText(taskName);
    await page.getByTestId('btn-back-to-list').click();
    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.getByTestId('task-list-item')).toHaveCount(3);
  });
});
