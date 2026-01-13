import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskStatus } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';
import { TaskEditPopup } from './task-edit-popup';

describe('TaskEditPopup', () => {
  let component: TaskEditPopup;
  let fixture: ComponentFixture<TaskEditPopup>;

  let mockDialogService: any;
  let mockTaskService: any;

  beforeEach(async () => {

    mockDialogService = {
      dialogData: signal(null),
      close: jest.fn()
    };

    mockTaskService = {
      addTask: jest.fn(),
      editTask: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskEditPopup],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: TaskService, useValue: mockTaskService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskEditPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with an empty form in "Add Mode"', () => {
      expect(component.isEditMode()).toBe(false);
      expect(component.taskForm.value.title).toBe('');
    });

    it('should pre-fill the form in "Edit Mode"', () => {
      const existingTask = { id: 1, title: 'Test', description: 'Desc', status: TaskStatus.Pending };
      mockDialogService.dialogData.set(existingTask);

      component.ngOnInit();

      expect(component.isEditMode()).toBe(true);
      expect(component.taskForm.value.title).toBe('Test');
    });
  });

  describe('Validation', () => {
    it('should keep the form invalid if required fields are empty', () => {
      component.taskForm.patchValue({ title: '', description: '' });
      expect(component.taskForm.valid).toBe(false);
    });

    it('should be valid if title and description are filled', () => {
      component.taskForm.patchValue({ title: 'New Task', description: 'Some description' });
      expect(component.taskForm.valid).toBe(true);
    });
  });

  describe('Submission', () => {
    it('should call addTask when valid in Add Mode', () => {
      component.taskForm.patchValue({ title: 'New Task', description: 'Desc' });

      component.submit();

      expect(mockTaskService.addTask).toHaveBeenCalled();
    });

    it('should call editTask when in Edit Mode', () => {
      mockDialogService.dialogData.set({ id: 123, title: 'Old', description: 'Old' });
      component.ngOnInit();

      component.taskForm.patchValue({ title: 'Updated Title' });
      component.submit();

      expect(mockTaskService.editTask).toHaveBeenCalledWith(
        expect.objectContaining({ id: 123, title: 'Updated Title' })
      );
    });
  });

  it('should show "Title is required" error message when title is touched and empty', () => {
    const titleControl = component.taskForm.get('title');

    titleControl?.setValue('');
    titleControl?.markAsTouched();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('[data-tm="title-error"]');

    expect(errorMessage?.textContent).toContain('Title is required');
  });

  it('should show "Description is required" error message when description is touched and empty', () => {
    const descControl = component.taskForm.get('description');
    descControl?.setValue('');
    descControl?.markAsTouched();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('[data-tm="desc-error"]');
    expect(errorMessage?.textContent).toContain('Description is required');
  });

  it('should HIDE the status dropdown in "Add Mode"', () => {
    mockDialogService.dialogData.set(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const statusElement = compiled.querySelector('[data-tm="status-selector"]');
    expect(statusElement).toBeNull();
  });

  it('should SHOW the status dropdown in "Edit Mode"', () => {
    mockDialogService.dialogData.set({ id: 1, title: 'Existing', description: 'Desc', status: TaskStatus.Pending });

    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const statusElement = compiled.querySelector('[data-tm="status-selector"]');

    expect(statusElement).not.toBeNull();
  });

  it('should show "Create" button in Add Mode', () => {
    mockDialogService.dialogData.set(null);
    fixture.detectChanges();
    let submitBtn = fixture.nativeElement.querySelector('[data-tm="submit-btn"]');
    expect(submitBtn.textContent).toContain('Create');
  });

    it('should show "Save" in Edit Mode', () => {
    mockDialogService.dialogData.set({ id: 1, title: 'T', description: 'D' });
    component.ngOnInit();
    fixture.detectChanges();
    let submitBtn = fixture.nativeElement.querySelector('[data-tm="submit-btn"]');
    expect(submitBtn.textContent).toContain('Save');
  });
});
