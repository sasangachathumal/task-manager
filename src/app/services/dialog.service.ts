import { computed, Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  activeComponent = signal<Type<any> | null>(null);
  dialogData = signal<any>(null);
  onConfirm = signal<(() => void) | null>(null);
  confirmMessage = signal<string | null>(null);
  isConfirm = computed(() => {
    return !!this.onConfirm();
  });

  // open popup using a component passing data to it
  open(component: Type<any>, data: any = null, isConfirm: boolean = false) {
    this.activeComponent.set(component);
    this.dialogData.set(data);
  }

  // close the open popup
  close() {
    this.activeComponent.set(null);
    this.dialogData.set(null);
  }

  // handel background close
  bgClose() {
    if (!this.isConfirm()) {
      this.activeComponent.set(null);
      this.dialogData.set(null);
    }
  }

  // open confirmation popup usinf a component and passing message and confirmation call back
  openConfirm(component: Type<any>, message: any = null, confirmAction: (() => void) | null = null) {
    this.activeComponent.set(component);
    this.confirmMessage.set(message);
    this.onConfirm.set(confirmAction);
    this.dialogData.set(null);
  }

  // close confirmation popup
  closeConfirm() {
    this.activeComponent.set(null);
    this.dialogData.set(null);
    this.onConfirm.set(null);
    this.confirmMessage.set(null);
  }

}
