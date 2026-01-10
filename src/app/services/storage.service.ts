import { Injectable } from '@angular/core';
import { Task } from '@interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  // task list storage key
  private readonly STORAGE_KEY = 'task_list';

  // get task list from local storage
  getTaskList() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  // save task list to local storage
  setTaskList(value: Task[]) {
    return localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
  }

}
