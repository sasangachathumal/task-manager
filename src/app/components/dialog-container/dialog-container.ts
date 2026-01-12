import { NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DialogService } from '@service/dialog.service';

@Component({
  selector: 'app-dialog-container',
  imports: [NgComponentOutlet],
  templateUrl: './dialog-container.html',
  styleUrl: './dialog-container.css',
})
export class DialogContainer {
  protected dialogService = inject(DialogService);
}
