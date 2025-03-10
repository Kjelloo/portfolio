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
  resizeHandle: 'bottom-left' | 'bottom-right' | null = null;
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

  startResizing(event: MouseEvent, handle: 'bottom-left' | 'bottom-right') {
    if (!this.window || !this.windowElement) return;
    if (this.window.isMaximized) return;

    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizeHandle = handle;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.windowElement.nativeElement.offsetWidth;
    this.startHeight = this.windowElement.nativeElement.offsetHeight;
    this.startLeft = this.window.position.x;
    this.startTop = this.window.position.y;
    this.windowService.setActiveWindow(this.window.id);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.window) return;
    if (this.isDragging) {
      const newX = event.clientX - this.startX;
      const newY = event.clientY - this.startY;
      this.windowService.updateWindowPosition(this.window.id, { x: newX, y: newY });
    } else if (this.isResizing && this.resizeHandle) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      if (this.resizeHandle === 'bottom-right') {
        const newWidth = Math.max(200, this.startWidth + deltaX);
        const newHeight = Math.max(100, this.startHeight + deltaY);
        this.windowService.updateWindowSize(this.window.id, {
          width: `${newWidth}px`,
          height: `${newHeight}px`
        });
      } else if (this.resizeHandle === 'bottom-left') {
        const newWidth = Math.max(200, this.startWidth - deltaX);
        const newHeight = Math.max(100, this.startHeight + deltaY);
        const newX = this.startLeft + deltaX;

        this.windowService.updateWindowPosition(this.window.id, { x: newX, y: this.startTop });
        this.windowService.updateWindowSize(this.window.id, {
          width: `${newWidth}px`,
          height: `${newHeight}px`
        });
      }
    }
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
}
