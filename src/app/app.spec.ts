import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DialogService } from '@service/dialog.service';
import { App } from './app';

describe('App', () => {

  let component: App;
  let fixture: ComponentFixture<App>;
  let mockDialogService: any;

  beforeEach(async () => {
    mockDialogService = {
      activeComponent: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title signal value', () => {
    expect(component['title']()).toEqual('task-manager');
  });

  it('should render the router outlet', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).toBeTruthy();
  });

  it('should render the dialog container component', () => {
    const dialogContainer = fixture.debugElement.query(By.css('app-dialog-container'));
    expect(dialogContainer).toBeTruthy();
  });
});
