import { TestBed } from '@angular/core/testing';
import { TaskStatus } from '@enums';
import { Task } from '@interface';
import { StorageService } from './storage.service';

describe('Storage', () => {
  let service: StorageService;
  const STORAGE_KEY = 'task_list';

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'D', status: TaskStatus.Pending, created: '', updated: '' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);

    localStorage.clear();

    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTaskList', () => {
    it('should return parsed tasks if they exist in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));

      const result = service.getTaskList();

      expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(result).toEqual(mockTasks);
    });

    it('should return null if localStorage is empty', () => {
      const result = service.getTaskList();
      expect(result).toBeNull();
    });

    it('should handle corrupted JSON gracefully (optional safety check)', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');

      expect(() => service.getTaskList()).toThrow();
    });
  });

  describe('setTaskList', () => {
    it('should stringify and save the task list to localStorage', () => {
      service.setTaskList(mockTasks);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(mockTasks)
      );

      const storedData = localStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(storedData!)).toEqual(mockTasks);
    });
  });

});
