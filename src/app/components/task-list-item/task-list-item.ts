import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStatus } from '@enums';
import { Task } from '@interface';
import { TaskService } from '@service/task.service';

@Component({
  selector: 'app-task-list-item',
  imports: [NgClass],
  templateUrl: './task-list-item.html',
  styleUrl: './task-list-item.css',
})
export class TaskListItem {

  private router = inject(Router);
  private taskService = inject(TaskService);

  task = input.required<Task>();
  taskStatus = TaskStatus;

  openDetails() {
    const id = this.task().id;
    this.taskService.setSelectedTask(id);
    this.router.navigate(['/detail', id]);
  }

}
