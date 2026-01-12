import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmPopup } from '@components/confirm-popup/confirm-popup';
import { TaskEditPopup } from '@components/task-edit-popup/task-edit-popup';
import { TaskStatus } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-task-details',
  imports: [LucideAngularModule, NgClass, DatePipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {

  readonly ArrowLeftIcon = ArrowLeftIcon

  protected taskService = inject(TaskService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  id = input<string>();
  taskStatus = TaskStatus;

  ngOnInit(): void {
    // To handel page refresh get id from url and set to signal
    const taskId = Number(this.id());
    if (taskId) {
      this.taskService.setSelectedTask(taskId);
    }
  }

  goBack() {
    this.taskService.setSelectedTask(0);

    this.router.navigate(['']);
  }

  editTaskPopup() {
    this.dialogService.open(TaskEditPopup, this.taskService.selectedTask());
  }

  onDeleteTask(taskId: number) {
    this.dialogService.openConfirm(
      ConfirmPopup,
      'This will permanently delete this task.',
      () => {
        this.taskService.removeTask(taskId);
        this.taskService.setSelectedTask(0);
        this.router.navigate(['']);
      }
    );
  }

}
