import { Component, computed, inject, signal } from '@angular/core';
import { Pagination } from '@components/pagination/pagination';
import { TaskEditPopup } from '@components/task-edit-popup/task-edit-popup';
import { TaskListItem } from '@components/task-list-item/task-list-item';
import { SortOptions } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';
import { LucideAngularModule, SearchIcon } from 'lucide-angular';

@Component({
  selector: 'app-task-list',
  imports: [LucideAngularModule, TaskListItem, Pagination],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  readonly SearchIcon = SearchIcon;

  protected taskService = inject(TaskService);
  private dialogService = inject(DialogService);
  sortOptionList = Object.values(SortOptions);

  // pagination
  currentPage = signal(1);
  pageSize = 3;

  onSortChange(event: any) {
    if (event.target.value) {
      this.taskService.setSelectedSort(event.target.value);
    }
  }

  onSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.taskService.setSearchTerm(value);
  }

  pagedTasks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.taskService.taskList().slice(startIndex, endIndex);
  });

  totalPages = computed(() =>
    Math.ceil(this.taskService.taskList().length / this.pageSize)
  );

  newTaskPopup() {
    this.dialogService.open(TaskEditPopup);
  }

}
