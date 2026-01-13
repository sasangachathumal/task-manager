import { Component, signal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DialogService } from '@service/dialog.service';
import { DialogContainer } from './dialog-container';

// a dummy component to inject into the outlet
@Component({ selector: 'app-dummy', template: '<p>Dummy Content</p>' })
class DummyComponent { }

describe('DialogContainer', () => {
  let component: DialogContainer;
  let fixture: ComponentFixture<DialogContainer>;
  let mockDialogService: jest.Mocked<Partial<DialogService>>;

  const activeComponentSignal = signal<Type<any> | null>(null);

  beforeEach(async () => {

    mockDialogService = {
      activeComponent: activeComponentSignal,
      bgClose: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogContainer],
      providers: [
        { provide: DialogService, useValue: mockDialogService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the overlay when activeComponent is null', () => {
    activeComponentSignal.set(null);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('[data-tm="dialog-overlay"]'));
    expect(overlay).toBeNull();
  });

  it('should show the overlay when activeComponent is set', () => {
    activeComponentSignal.set(DummyComponent);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('[data-tm="dialog-overlay"]'));
    expect(overlay).not.toBeNull();
  });

  it('should render component when activeComponent is set', () => {
    activeComponentSignal.set(DummyComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Dummy Content');
  });

  it('should call bgClose when the overlay (background) is clicked', () => {
    activeComponentSignal.set(DummyComponent);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('[data-tm="dialog-overlay"]'));
    overlay.nativeElement.click();

    expect(mockDialogService.bgClose).toHaveBeenCalled();
  });

  it('should NOT call bgClose when the content box is clicked (Stop Propagation)', () => {
    activeComponentSignal.set(DummyComponent);
    fixture.detectChanges();
    const contentBox = fixture.debugElement.query(By.css('[data-tm="dialog-body"]'));
    contentBox.nativeElement.click();
    expect(mockDialogService.bgClose).not.toHaveBeenCalled();
  });
});
