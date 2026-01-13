import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogContainer } from '@components/dialog-container/dialog-container';
import { DialogService } from '@service/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-manager');
  protected dialogService = inject(DialogService);
}
