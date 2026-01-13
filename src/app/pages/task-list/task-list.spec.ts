import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SortOptions, TaskStatus } from '@enums';
import { DialogService } from '@service/dialog.service';
import { TaskService } from '@service/task.service';
import { TaskList } from './task-list';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  let mockTaskService: any;
  let mockDialogService: any;

  const taskListSignal = signal([
    { id: 1, title: 'Task 1', status: TaskStatus.Pending },
    { id: 2, title: 'Task 2', status: TaskStatus.Pending },
    { id: 3, title: 'Task 3', status: TaskStatus.Pending },
    { id: 4, title: 'Task 4', status: TaskStatus.Pending },
  ]);

  beforeEach(async () => {
    mockTaskService = {
      taskList: taskListSignal,
      setSelectedSort: jest.fn(),
      setSearchTerm: jest.fn(),
    };
    mockDialogService = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: DialogService, useValue: mockDialogService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination Logic', () => {
    it('should calculate total pages correctly based on page size (3)', () => {
      expect(component.totalPages()).toBe(2);
    });

    it('should return only the first 3 tasks for page 1', () => {
      component.currentPage.set(1);
      fixture.detectChanges();
      expect(component.pagedTasks().length).toBe(3);
      expect(component.pagedTasks()[0].id).toBe(1);
    });

    it('should return the remaining task for page 2', () => {
      component.currentPage.set(2);
      fixture.detectChanges();
      expect(component.pagedTasks().length).toBe(1);
      expect(component.pagedTasks()[0].id).toBe(4);
    });
  });

  describe('User Interactions', () => {
    it('should call taskService.setSearchTerm when searching', () => {
      const event = { target: { value: 'search query' } };
      component.onSearch(event);
      expect(mockTaskService.setSearchTerm).toHaveBeenCalledWith('search query');
    });

    it('should call taskService setSelectedSort when sort changes', () => {
      const event = { target: { value: SortOptions.Title } };
      component.onSortChange(event);
      expect(mockTaskService.setSelectedSort).toHaveBeenCalledWith(SortOptions.Title);
    });

    it('should NOT call taskService setSelectedSort when value is empty', () => {
    const mockEvent = {
      target: { value: '' }
    };

    component.onSortChange(mockEvent);

    expect(mockTaskService.setSelectedSort).not.toHaveBeenCalled();
  });

    it('should open TaskEditPopup when newTaskPopup is called', () => {
      component.newTaskPopup();
      expect(mockDialogService.open).toHaveBeenCalled();
    });
  });
});
