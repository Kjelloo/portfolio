import { Component, Input, OnInit } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { WindowService } from '../../services/window.service';
import { Window } from '../../models/window.model';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {
  @Input() windowId!: string;
  window: Window | null = null;
  isActive: boolean = false;

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.windowService.getWindows().subscribe(windows => {
      this.window = windows.find(w => w.id === this.windowId) || null;
    });

    this.windowService.getActiveWindowId().subscribe(activeId => {
      this.isActive = activeId === this.windowId;
    });
  }

  onDragStarted(event: CdkDragStart) {
    this.windowService.setActiveWindow(this.windowId);
  }

  onDragEnded(event: CdkDragEnd) {
    const dragDelta = event.source.getFreeDragPosition();
    if (this.window) {
      this.windowService.updateWindowPosition(this.windowId, {
        x: this.window.position.x + dragDelta.x,
        y: this.window.position.y + dragDelta.y
      });
    }
    event.source.reset();
  }

  closeWindow() {
    this.windowService.closeWindow(this.windowId);
  }

  minimizeWindow() {
    this.windowService.minimizeWindow(this.windowId);
  }

  toggleMaximize() {
    this.windowService.toggleMaximize(this.windowId);
  }

  focusWindow() {
    this.windowService.setActiveWindow(this.windowId);
  }
} 