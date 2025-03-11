import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { Window } from '../../models/window.model';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input() window!: Window;
  @ViewChild('windowElement') windowElement!: ElementRef;

  isActive = false;
  isDragging = false;
  isResizing = false;
  resizeHandle: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null = null;
  startX = 0;
  startY = 0;
  startWidth = 0;
  startHeight = 0;
  startLeft = 0;
  startTop = 0;

  constructor(protected windowService: WindowService) {}

  ngOnInit() {
    if (!this.window) {
      console.error('Window component initialized without window data');
      return;
    }

    this.windowService.getActiveWindowId().subscribe(id => {
      this.isActive = id === this.window.id;
    });

    // Add global mouse event listeners
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  ngOnDestroy() {
    // Remove global mouse event listeners
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  startDragging(event: MouseEvent) {
    if (!this.window) return;
    if (event.target instanceof HTMLElement && event.target.closest('.title-bar-controls')) {
      return;
    }
    this.isDragging = true;
    this.startX = event.clientX - this.window.position.x;
    this.startY = event.clientY - this.window.position.y;
    this.windowService.setActiveWindow(this.window.id);
  }

  startResizing(event: MouseEvent, handle: typeof this.resizeHandle) {
    if (!this.window || this.window.isMaximized) return;

    this.isResizing = true;
    this.resizeHandle = handle;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.windowElement.nativeElement.offsetWidth;
    this.startHeight = this.windowElement.nativeElement.offsetHeight;
    this.startLeft = this.window.position.x;
    this.startTop = this.window.position.y;
    this.windowService.setActiveWindow(this.window.id);
    event.preventDefault();
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
  }

  minimize() {
    if (!this.window) return;
    this.windowService.minimizeWindow(this.window.id);
  }

  toggleMaximize() {
    if (!this.window) return;
    this.windowService.toggleMaximize(this.window.id);
  }

  close() {
    if (!this.window) return;
    this.windowService.closeWindow(this.window.id);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.window) return;

    if (this.isDragging && !this.window.isMaximized) {
      const newX = event.clientX - this.startX;
      const newY = event.clientY - this.startY;
      this.window.position = { x: newX, y: newY };
    }

    if (this.isResizing && !this.window.isMaximized) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      const minWidth = 320;
      const minHeight = 480;

      let newWidth = this.startWidth;
      let newHeight = this.startHeight;
      let newX = this.startLeft;
      let newY = this.startTop;

      switch (this.resizeHandle) {
        case 'right':
          newWidth = Math.max(minWidth, this.startWidth + deltaX);
          break;
        case 'bottom':
          newHeight = Math.max(minHeight, this.startHeight + deltaY);
          break;
        case 'left':
          const possibleWidth = this.startWidth - deltaX;
          if (possibleWidth >= minWidth) {
            newWidth = possibleWidth;
            newX = this.startLeft + deltaX;
          }
          break;
        case 'top':
          const possibleHeight = this.startHeight - deltaY;
          if (possibleHeight >= minHeight) {
            newHeight = possibleHeight;
            newY = this.startTop + deltaY;
          }
          break;
        case 'top-left':
          const topLeftPossibleWidth = this.startWidth - deltaX;
          const topLeftPossibleHeight = this.startHeight - deltaY;
          if (topLeftPossibleWidth >= minWidth) {
            newWidth = topLeftPossibleWidth;
            newX = this.startLeft + deltaX;
          }
          if (topLeftPossibleHeight >= minHeight) {
            newHeight = topLeftPossibleHeight;
            newY = this.startTop + deltaY;
          }
          break;
        case 'top-right':
          const topRightPossibleHeight = this.startHeight - deltaY;
          newWidth = Math.max(minWidth, this.startWidth + deltaX);
          if (topRightPossibleHeight >= minHeight) {
            newHeight = topRightPossibleHeight;
            newY = this.startTop + deltaY;
          }
          break;
        case 'bottom-left':
          const bottomLeftPossibleWidth = this.startWidth - deltaX;
          if (bottomLeftPossibleWidth >= minWidth) {
            newWidth = bottomLeftPossibleWidth;
            newX = this.startLeft + deltaX;
          }
          newHeight = Math.max(minHeight, this.startHeight + deltaY);
          break;
        case 'bottom-right':
          newWidth = Math.max(minWidth, this.startWidth + deltaX);
          newHeight = Math.max(minHeight, this.startHeight + deltaY);
          break;
      }

      // Update size and position in a single operation
      this.window.size = { 
        width: `${Math.round(newWidth)}px`, 
        height: `${Math.round(newHeight)}px` 
      };
      this.window.position = { x: newX, y: newY };

      // Prevent text selection during resize
      event.preventDefault();
    }
  }
}
