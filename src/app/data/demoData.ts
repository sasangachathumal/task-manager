import { TaskStatus } from '@enums';
import { Task } from '@interface';

export const demoData: Task[] = [
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
