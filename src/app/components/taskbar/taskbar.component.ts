import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { Window } from '../../models/window.model';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit {
  openWindows: Window[] = [];
  activeWindowId: string | null = null;
  startMenuOpen = false;
  currentTime: Date = new Date();

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.windowService.getWindows().subscribe(windows => {
      this.openWindows = windows.filter(w => w.isOpen);
    });

    this.windowService.getActiveWindowId().subscribe(activeId => {
      this.activeWindowId = activeId;
    });

    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 500);
  }

  toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;
  }

  focusWindow(windowId: string) {
    this.windowService.restoreWindow(windowId);
  }
}
