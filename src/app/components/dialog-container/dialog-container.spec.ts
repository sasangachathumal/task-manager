import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContainer } from './dialog-container';

describe('DialogContainer', () => {
  let component: DialogContainer;
  let fixture: ComponentFixture<DialogContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
