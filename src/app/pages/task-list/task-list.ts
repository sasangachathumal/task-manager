import { Component, inject, signal } from '@angular/core';
import { TaskListItem } from '@components/task-list-item/task-list-item';
import { SortOptions } from '@enums';
import { TaskService } from '@service/task.service';
import { LucideAngularModule, SearchIcon } from 'lucide-angular';

@Component({
  selector: 'app-task-list',
  imports: [LucideAngularModule, TaskListItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  readonly SearchIcon = SearchIcon;

  protected taskService = inject(TaskService);
  sortOptionList = Object.values(SortOptions);

  onSortChange(event: any) {
    if (event.target.value) {
      this.taskService.setSelectedSort(event.target.value);
    }
  }

}
