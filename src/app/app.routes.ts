import { Routes } from '@angular/router';
import { TaskDetails } from './pages/task-details/task-details';
import { TaskList } from './pages/task-list/task-list';

export const routes: Routes = [
{
  path: '',
  component: TaskList
},
{
  path: 'detail/:id',
  component: TaskDetails
}
];
