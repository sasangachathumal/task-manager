import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStatus } from '@enums';
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

  id = input<string>();
  taskStatus = TaskStatus;
  protected taskService = inject(TaskService);
  private router = inject(Router);

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

}
