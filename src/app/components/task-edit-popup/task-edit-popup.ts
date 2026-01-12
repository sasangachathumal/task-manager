import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskStatus } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';

@Component({
  selector: 'app-task-edit-popup',
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit-popup.html',
  styleUrl: './task-edit-popup.css',
})
export class TaskEditPopup implements OnInit {

  protected dialogService = inject(DialogService);
  private formBuilder = inject(FormBuilder);
  private taskService = inject(TaskService);

  isEditMode = computed(() => !!this.dialogService.dialogData());
  statusOptions = Object.values(TaskStatus);

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: [TaskStatus.Pending]
  });

  ngOnInit(): void {
    const data = this.dialogService.dialogData();
    if (data) {
      this.taskForm.patchValue(data);
    }
  }

  submit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      if (this.isEditMode()) {
        const id = this.dialogService.dialogData().id;
        this.taskService.editTask({
          id: id,
          title: formValue.title!,
          description: formValue.description!,
          status: formValue.status!,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        });
      } else {
        this.taskService.addTask({
          id: new Date().getTime(),
          title: formValue.title!,
          description: formValue.description!,
          status: TaskStatus.Pending,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        });
      }

      this.dialogService.close();
    } else {
      this.taskForm.markAllAsTouched(); // Show validation errors
    }
  }

}
