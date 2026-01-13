import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';

// Dummy component to use as a Type for testing
@Component({ template: '' })
class MockPopupComponent { }

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogService]
    });
    service = TestBed.inject(DialogService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with all signals as null/false', () => {
    expect(service.activeComponent()).toBeNull();
    expect(service.dialogData()).toBeNull();
    expect(service.onConfirm()).toBeNull();
  });

  describe('Standard Dialog (open/close)', () => {
    it('should set the active component when opened', () => {
      service.open(MockPopupComponent);

      expect(service.activeComponent()).toBe(MockPopupComponent);
    });

    it('should set the data when opened', () => {
      const mockData = { id: 1, title: 'Test Task' };

      service.open(MockPopupComponent, mockData);

      expect(service.dialogData()).toEqual(mockData);
    });

    it('should clear signals when closed', () => {
      service.open(MockPopupComponent);
      service.close();

      expect(service.activeComponent()).toBeNull();
      expect(service.dialogData()).toBeNull();
    });

    it('should close on background click if it is NOT a confirmation dialog', () => {
      service.open(MockPopupComponent);
      service.bgClose();

      expect(service.activeComponent()).toBeNull();
    });
  });

  describe('Confirmation Dialog (openConfirm/closeConfirm)', () => {
    it('should set confirmation signals correctly', () => {
      const confirmSpy = jest.fn();
      const message = 'Are you sure?';

      service.openConfirm(MockPopupComponent, message, confirmSpy);

      expect(service.activeComponent()).toBe(MockPopupComponent);
      expect(service.confirmMessage()).toBe(message);
      expect(service.onConfirm()).toBe(confirmSpy);
    });

    it('should NOT close on background click if it is a confirmation dialog', () => {
      const confirmSpy = jest.fn();
      service.openConfirm(MockPopupComponent, 'Msg', confirmSpy);

      service.bgClose();

      expect(service.activeComponent()).toBe(MockPopupComponent);
    });

    it('should clear all confirmation state when closeConfirm is called', () => {
      service.openConfirm(MockPopupComponent, 'Msg', () => { });
      service.closeConfirm();

      expect(service.activeComponent()).toBeNull();
      expect(service.onConfirm()).toBeNull();
      expect(service.confirmMessage()).toBeNull();
    });
  });

  describe('Computed Signals', () => {
    it('should update isConfirm when onConfirm changes', () => {
      expect(service.isConfirm()).toBe(false);

      service.onConfirm.set(() => console.log('Confirmed'));

      expect(service.isConfirm()).toBe(true);
    });
  });
});
