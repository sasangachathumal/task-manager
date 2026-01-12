import { Component, inject } from '@angular/core';
import { DialogService } from '@service/dialog.service';

@Component({
  selector: 'app-confirm-popup',
  imports: [],
  templateUrl: './confirm-popup.html',
  styleUrl: './confirm-popup.css',
})
export class ConfirmPopup {
  protected dialogService = inject(DialogService);

  handleConfirm() {
    const action = this.dialogService.onConfirm();
    if (action) {
      action();
    }
    this.dialogService.closeConfirm();
  }
}
