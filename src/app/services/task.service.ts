import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { SortOptions, TaskStatus } from '@enums';
import { Task } from '@interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  // Inject local storage service
  private storage = inject(StorageService);

  // Private signal to manage tasks in state
  private tasksSignal = signal<Task[]>(this.getInitialTasks());
  // selected task ID
  selectedTaskId = signal<number | null>(null);
  selectedStatus = signal<TaskStatus | null>(null);
  searchedTaskName = signal<string | null>(null);
  selectedSort = signal<SortOptions>(SortOptions.Title);

  // readonly task array
  tasks = this.tasksSignal.asReadonly();

  onstructor() {
    // register effect to update local storage with new tasks list when some update happens.
    effect(() => {
      this.storage.setTaskList(this.tasksSignal());
    });
  }

  // 1. Logic to determine initial state
  private getInitialTasks(): Task[] {
    const savedTasks = this.storage.getTaskList();

    // If we have data in storage, use it.
    // If not (null or empty array), return the demo data.
    if (savedTasks && savedTasks.length > 0) {
      return savedTasks;
    }

    const demoData: Task[] = [
      {
        id: new Date('2025-01-05').getTime(),
        title: 'Zindex style issue',
        description: 'Home page animated elements have issue with zindex when animating.',
        status: TaskStatus.Done,
        created: new Date('2025-01-05').toISOString(),
        updated: new Date('2025-01-05').toISOString()
      },
      {
        id: new Date('2025-01-01').getTime(),
        title: 'Update documentation',
        description: 'Update the documentation about features in tech doc.',
        status: TaskStatus.Pending,
        created: new Date('2025-01-01').toISOString(),
        updated: new Date('2025-01-01').toISOString()
      },
      {
        id: new Date().getTime(),
        title: 'Implement Search',
        description: 'Users shoud be able to search task by typing task name in search and press enter.',
        status: TaskStatus.InProgress,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      {
        id: new Date('2025-01-08').getTime(),
        title: 'Fix login issue',
        description: 'Users are unable to login when enter correct credentials.',
        status: TaskStatus.Done,
        created: new Date('2025-01-08').toISOString(),
        updated: new Date('2025-01-08').toISOString()
      }
    ];

    this.storage.setTaskList(demoData);

    return demoData;

  }

  // computed signal for the sorted list
  sortedTasks = computed(() => {
    const allTasks = this.tasksSignal();
    const criteria = this.selectedSort();

    return [...allTasks].sort((a, b) => {
      switch (criteria) {
        case SortOptions.Created:
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case SortOptions.Title:
          return a.title.localeCompare(b.title);
        case SortOptions.Status:
          return a.status.localeCompare(b.status);
      }
    });
  });

  // selected Task
  selectedTask = computed(() =>
    this.tasksSignal().find(t => t.id === this.selectedTaskId()) ?? null
  );

  // filter tasks by status
  tasksByStatus = computed(() => {
    const status = this.selectedStatus();
    if (status === null) return this.tasksSignal();

    return this.tasksSignal().filter(t => t.status === status);
  });

  // search tasks by name
  searchTaskbyName = computed(() => {
    const searchName = this.searchedTaskName();
    if (searchName === null) return this.tasksSignal();

    return this.tasksSignal().filter(t => t.title === searchName);
  });

  // update the selectedtaskId
  setSelectedTask(id: number) {
    if (!id) return;
    this.selectedTaskId.set(id);
  }

  // update the sort option
  setSelectedSort(sortOpt: SortOptions) {
    if (!sortOpt) return;
    this.selectedSort.set(sortOpt);
  }

  // Add a new task to the list
  addTask(newTask: Task) {
    this.tasksSignal.update((tasks) => [
      ...tasks,
      newTask,
    ]);
  }

  // Edit a task from the list
  editTask(updatedTask: Task) {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => t.id === updatedTask.id ? updatedTask : t)
    );
  }

  // update task status
  toggleTask(id: number, status: TaskStatus) {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, status: status } : t))
    );
  }

  // remove a task from the list
  removeTask(id: number) {
    this.tasksSignal.update((tasks) =>
      tasks.filter((t) => t.id !== id)
    );
  }

}
