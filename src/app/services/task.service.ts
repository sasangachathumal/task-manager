import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SortOptions, TaskStatus } from '@enums';
import { Task } from '@interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { demoData } from '../data/demoData';
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

  searchTerm = signal<string | null>(null);
  private searchSubject = new Subject<string>();

  selectedSort = signal<SortOptions>(SortOptions.Title);

  // readonly task array
  tasks = this.tasksSignal.asReadonly();

  constructor() {
    // register effect to update local storage with new tasks list when some update happens.
    effect(() => {
      this.storage.setTaskList(this.tasksSignal());
    });

    // subject for manage user search, wait 300 miliseconds, and triggert ony when changes happened
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm.set(term);
    });
  }

  private getInitialTasks(): Task[] {
    const savedTasks = this.storage.getTaskList();

    // If we have data in storage, use it.
    // If not (null or empty array), return the demo data.
    if (savedTasks && savedTasks.length > 0) {
      return savedTasks;
    }

    this.storage.setTaskList(demoData);

    return demoData;

  }

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  // computed signal for the sorted list
  taskList = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (term) {
      return this.searchTaskbyName(term);
    } else {
      return this.sortTasks();
    }
  });

  sortTasks() {
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
  }

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
  searchTaskbyName (searchTerm: string) {
    const allTasks = this.tasksSignal();
    return allTasks.filter(t =>
      t.title.toLowerCase().includes(searchTerm)
    );
  };

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
