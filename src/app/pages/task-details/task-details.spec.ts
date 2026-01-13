import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TaskStatus } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';
import { TaskDetails } from './task-details';

describe('TaskDetails', () => {
  let component: TaskDetails;
  let fixture: ComponentFixture<TaskDetails>;

  let mockTaskService: any;
  let mockDialogService: any;
  let mockRouter: any;

  const selectedTaskSignal = signal<any>(null);

  beforeEach(async () => {

    mockTaskService = {
      selectedTask: selectedTaskSignal,
      setSelectedTask: jest.fn(),
      removeTask: jest.fn()
    };
    mockDialogService = { open: jest.fn(), openConfirm: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [TaskDetails],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set the selected task from the input ID', () => {
    fixture.componentRef.setInput('id', '123');
    fixture.detectChanges();
    component.ngOnInit();

    expect(mockTaskService.setSelectedTask).toHaveBeenCalledWith(123);
  });

  it('should navigate back to list when goBack is called', () => {
    component.goBack();
    expect(mockTaskService.setSelectedTask).toHaveBeenCalledWith(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should open the edit popup with current task data', () => {
    const taskData = { id: 123, title: 'Test' };
    selectedTaskSignal.set(taskData);
    fixture.detectChanges();

    component.editTaskPopup();

    expect(mockDialogService.open).toHaveBeenCalledWith(expect.anything(), taskData);
  });

  it('should open confirmation dialog when deleting task', () => {
    const taskId = 123;
    component.onDeleteTask(taskId);

    expect(mockDialogService.openConfirm).toHaveBeenCalled();
  });

    it('should handle deletion via confirmation dialog', () => {
    const taskId = 123;
    component.onDeleteTask(taskId);

    const callback = mockDialogService.openConfirm.mock.calls[0][2];
    callback();

    expect(mockTaskService.removeTask).toHaveBeenCalledWith(taskId);
    expect(mockTaskService.setSelectedTask).toHaveBeenCalledWith(0);
  });

  it('should show "Task not found" if no task is selected', () => {
    selectedTaskSignal.set(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Task not found');
  });
});
