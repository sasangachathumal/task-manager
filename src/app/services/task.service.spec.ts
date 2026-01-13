import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SortOptions, TaskStatus } from '@enums';
import { Task } from '@interface';
import { StorageService } from './storage.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let storageServiceMock: jest.Mocked<StorageService>;

  const mockTasks: Task[] = [
    { id: 1, title: 'B Task', description: 'Desc', status: TaskStatus.Pending, created: '2025-01-01', updated: '2025-01-01' },
    { id: 2, title: 'A Task', description: 'Desc', status: TaskStatus.Done, created: '2025-01-02', updated: '2025-01-02' },
  ];

  beforeEach(() => {
    storageServiceMock = {
      getTaskList: jest.fn().mockReturnValue(mockTasks),
      setTaskList: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: StorageService, useValue: storageServiceMock },
      ],
    });

    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call storage service to load initial tasks', () => {
    expect(storageServiceMock.getTaskList).toHaveBeenCalled();
  });

  describe('Sorting tasks', () => {
    it('should sort tasks by Title by default', () => {
      const sorted = service.taskList();
      expect(sorted[0].title).toBe('A Task');
    });

    it('should sort tasks by created', () => {
      service.setSelectedSort(SortOptions.Created);
      const sorted = service.taskList();
      expect(sorted[0].id).toBe(2);
    });

    it('should sort tasks by status', () => {
      service.setSelectedSort(SortOptions.Status);
      const sorted = service.taskList();
      expect(sorted[0].status).toBe(TaskStatus.Done);
    });
  });

  describe('Searching tasks', () => {
    it('should have an empty search term before debounce', fakeAsync(() => {
      service.setSearchTerm('B Task');
      expect(service.searchTerm()).toBeNull();
    }));
    it('should set search term after debounce', fakeAsync(() => {
      service.setSearchTerm('B Task');
      tick(300);
      expect(service.searchTerm()).toBe('B Task');
    }));
    it('should filter task list by search term after debounce', fakeAsync(() => {
      service.setSearchTerm('B Task');
      tick(300);
      expect(service.taskList()[0].title).toBe('B Task');
    }));
  });

  it('should add a new task', () => {
    const newTask: Task = { id: 3, title: 'C', description: '', status: TaskStatus.Pending, created: '', updated: '' };
    service.addTask(newTask);
    expect(service.tasks()).toContainEqual(newTask);
  });

  it('should find a selected task when ID is set', () => {
    service.setSelectedTask(1);
    expect(service.selectedTask()?.title).toBe('B Task');
  });

  it('should remove a task', () => {
    service.removeTask(1);
    expect(service.tasks().length).toBe(1);
    expect(service.tasks().find(t => t.id === 1)).toBeUndefined();
  });

  it('should edit an existing task', () => {
    const originalTask = service.tasks()[0];
    const updatedTask: Task = {
      ...originalTask,
      title: 'Updated Title',
      status: TaskStatus.InProgress
    };
    service.editTask(updatedTask);

    const tasks = service.tasks();
    const resultTask = tasks.find(t => t.id === originalTask.id);

    expect(resultTask).toEqual(updatedTask);
  });

});
