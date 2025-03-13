import {Component, ElementRef, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { WindowService } from '../../services/window.service';
import { Window } from '../../models/window.model';
import { ErrorDialogService } from '../../services/error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit, OnDestroy {
  @Input() errorMessage: string = '';
  @Input() title: string = 'Error';
  @ViewChild('errorDialog') errorDialog: ElementRef | undefined;

  windowDialog: Window;
  isDragging = false;
  startX = 0;
  startY = 0;
  initialPosition = { x: 0, y: 0 };

  constructor(
    private windowService: WindowService,
    private errorDialogService: ErrorDialogService
  ) {
    this.windowDialog = {
      id: 'error-dialog',
      title: this.title,
      isOpen: true,
      isMaximized: false,
      isMinimized: false,
      position: { x: 0, y: 0 },
      size: { width: '280px', height: '140px' },
      zIndex: 9999
    };
  }

  ngOnInit() {
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
    if (!this.errorDialog || (event.target instanceof HTMLElement && event.target.closest('.title-bar-controls'))) {
      return;
    }
    
    this.isDragging = true;
    
    // Get the current position of the dialog
    const rect = this.errorDialog.nativeElement.getBoundingClientRect();
    this.initialPosition = { 
      x: rect.left, 
      y: rect.top 
    };
    
    // Calculate the offset from the mouse to the top-left corner of the dialog
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    
    // Apply initial position to make the dialog absolutely positioned
    this.errorDialog.nativeElement.style.position = 'absolute';
    this.errorDialog.nativeElement.style.top = `${rect.top}px`;
    this.errorDialog.nativeElement.style.left = `${rect.left}px`;
    this.errorDialog.nativeElement.style.transform = 'none';
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging && this.errorDialog) {
      const newX = Math.max(0, event.clientX - this.startX);
      const newY = Math.max(0, event.clientY - this.startY);
      
      this.errorDialog.nativeElement.style.left = `${newX}px`;
      this.errorDialog.nativeElement.style.top = `${newY}px`;
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  close() {
    this.errorDialogService.closeError();
  }
}
