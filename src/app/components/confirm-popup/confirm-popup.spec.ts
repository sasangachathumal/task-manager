import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from '@service/dialog.service';
import { ConfirmPopup } from './confirm-popup';

describe('ConfirmPopup', () => {
  let component: ConfirmPopup;
  let fixture: ComponentFixture<ConfirmPopup>;
  let mockDialogService: jest.Mocked<Partial<DialogService>>;

  const onConfirmSignal = signal<(() => void) | null>(null);
  const confirmMessageSignal = signal<string | null>(null);

  beforeEach(async () => {

    mockDialogService = {
      onConfirm: onConfirmSignal,
      confirmMessage: confirmMessageSignal,
      closeConfirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmPopup],
      providers: [
        { provide: DialogService, useValue: mockDialogService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute the action when handleConfirm is called', () => {
    const actionSpy = jest.fn();
    onConfirmSignal.set(actionSpy);

    component.handleConfirm();

    expect(actionSpy).toHaveBeenCalled();
  });

    it('should close the dialog when handleConfirm is called', () => {
    const actionSpy = jest.fn();
    onConfirmSignal.set(actionSpy);

    component.handleConfirm();

    expect(mockDialogService.closeConfirm).toHaveBeenCalled();
  });

  it('should display the confirmation message from the service', () => {
    const testMessage = 'Delete this task?';
    confirmMessageSignal.set(testMessage);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(testMessage);
  });

});
