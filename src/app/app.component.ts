// app.component.ts
import { Component, OnInit } from '@angular/core';
import { WindowService } from './services/window.service';
import { Window } from './models/window.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  windows: Window[] = [];

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.windowService.getWindows().subscribe(windows => {
      this.windows = windows;
    });
  }
}
