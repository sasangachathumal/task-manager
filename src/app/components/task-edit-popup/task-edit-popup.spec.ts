import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditPopup } from './task-edit-popup';

describe('TaskEditPopup', () => {
  let component: TaskEditPopup;
  let fixture: ComponentFixture<TaskEditPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
