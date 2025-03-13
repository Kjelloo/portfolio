import { Component, OnInit } from '@angular/core';
import { WindowService } from './services/window.service';
import { ErrorDialogService } from './services/error-dialog.service';
import { Window } from './models/window.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  windows: Window[] = [];
  errorDialog = {
    isOpen: false,
    title: '',
    message: ''
  };

  constructor(
    private windowService: WindowService,
    private errorDialogService: ErrorDialogService
  ) {}

  ngOnInit() {
    this.windowService.getWindows().subscribe(windows => {
      this.windows = windows;
    });

    this.errorDialogService.getErrorDialog().subscribe(dialog => {
      this.errorDialog = dialog;
    });
  }
}
