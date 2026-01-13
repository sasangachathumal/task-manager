import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TaskStatus } from '@enums';
import { Task } from '@interface';
import { TaskService } from '@service/task.service';
import { TaskListItem } from './task-list-item';

describe('TaskListItem', () => {
  let component: TaskListItem;
  let fixture: ComponentFixture<TaskListItem>;

  let mockTaskService: any;
  let mockRouter: any;

  const mockTask: Task = {
    id: 101,
    title: 'Learn Unit Testing',
    description: 'Master Jest in Angular',
    status: TaskStatus.InProgress,
    created: '',
    updated: ''
  };

  beforeEach(async () => {

    mockTaskService = { setSelectedTask: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [TaskListItem],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListItem);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', mockTask);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render task title correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('p')?.textContent).toContain('Learn Unit Testing');
  });

  it('should render status correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.task-chip')?.textContent).toContain(TaskStatus.InProgress);
  });

  it('should apply the correct CSS class for InProgress status', () => {
    const chip = fixture.nativeElement.querySelector('.task-chip');
    expect(chip.classList).toContain('task-chip--inprogress');
  });

  it('should call setSelectedTask when button is clicked', () => {
    component.openDetails();

    expect(mockTaskService.setSelectedTask).toHaveBeenCalledWith(101);
  });

    it('should navigate to details when button is clicked', () => {
    component.openDetails();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detail', 101]);
  });
});
