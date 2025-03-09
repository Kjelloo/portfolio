// app.component.ts
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragEnd, CdkDragStart, CdkDragHandle } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Kjell Schoke';

  currentTime: Date = new Date();
  startMenuOpen: boolean = false;
  activeWindow: string | null = null;
  userMaximized: boolean = false;

  openWindows: {[key: string]: boolean} = {
    about: false,
    resume: false,
    photos: false,
    mail: false,
    github: false
  };

  windowPositions: {[key: string]: {x: number, y: number}} = {
    about: { x: 120, y: 50 },
    resume: { x: 400, y: 30 },
    photos: { x: 150, y: 100 },
    mail: { x: 200, y: 150 },
    github: { x: 250, y: 200 }
  };

  windowSizes: {[key: string]: {width: string, height: string}} = {
    about: { width: '500px', height: '400px' },
    resume: { width: '650px', height: '500px' },
    photos: { width: '450px', height: '350px' },
    mail: { width: '400px', height: '300px' },
    github: { width: '450px', height: '350px' }
  };

  isMaximized: {[key: string]: boolean} = {
    about: false,
    resume: false,
    photos: false,
    mail: false,
    github: false
  };

  previousSizes: {[key: string]: {width: string, height: string}} = {};
  previousPositions: {[key: string]: {x: number, y: number}} = {};

  ngOnInit() {
    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 768;

    // For all open windows
    Object.keys(this.openWindows).forEach(app => {
      if (this.openWindows[app]) {
        // Only apply auto-maximize to the active window on mobile
        if (isMobile && app === this.activeWindow && !this.isMaximized[app]) {
          // If we're on a mobile size and the active window isn't maximized yet,
          // save the current size/position and maximize
          this.previousSizes[app] = { ...this.windowSizes[app] };
          this.previousPositions[app] = { ...this.windowPositions[app] };

          // Maximize
          this.windowSizes[app] = { width: '100%', height: 'calc(100% - 28px)' };
          this.windowPositions[app] = { x: 0, y: 0 };
          this.isMaximized[app] = true;
        }
        else if (!isMobile && this.isMaximized[app] && !this.userMaximized) {
          // We've resized from mobile to desktop, restore the window
          // only if it wasn't manually maximized by the user
          this.windowSizes[app] = this.previousSizes[app] || { width: '500px', height: '400px' };
          this.windowPositions[app] = this.previousPositions[app] || { x: 50, y: 50 };
          this.isMaximized[app] = false;
        }
        else if (this.isMaximized[app]) {
          // Adjust already maximized windows to fit new viewport
          this.windowSizes[app] = { width: '100%', height: 'calc(100% - 28px)' };
          this.windowPositions[app] = { x: 0, y: 0 };
        }
        else {
          // For non-maximized windows, ensure they stay within viewport
          this.ensureWindowInViewport(app);
        }
      }
    });
  }

  toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;
  }

  openApp(app: string) {
    console.log(`Opening app: ${app}`);

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate appropriate window size based on viewport
    // Using percentages with maximum values
    let width, height;

    if (viewportWidth < 768) { // Mobile
      width = Math.min(320, viewportWidth * 0.9) + 'px';
      height = Math.min(450, viewportHeight * 0.7) + 'px';
    } else if (viewportWidth < 1024) { // Tablet
      width = Math.min(500, viewportWidth * 0.8) + 'px';
      height = Math.min(500, viewportHeight * 0.8) + 'px';
    } else { // Desktop
      width = Math.min(650, viewportWidth * 0.6) + 'px';
      height = Math.min(550, viewportHeight * 0.7) + 'px';
    }

    // Set the window size
    this.windowSizes[app] = { width, height };

    // Calculate center position
    const widthNum = parseInt(width, 10);
    const heightNum = parseInt(height, 10);
    const centerX = (viewportWidth - widthNum) / 2;
    const centerY = (viewportHeight - heightNum - 28) / 2; // Subtract taskbar height

    // Set the window position to center
    this.windowPositions[app] = { x: centerX, y: centerY };

    this.openWindows[app] = true;
    this.setActiveWindow(app);
    this.startMenuOpen = false;

    // Auto-maximize ONLY on mobile devices when first opening
    const isMobile = viewportWidth < 768;
    if (isMobile) {
      // Save current size and position before maximizing
      this.previousSizes[app] = { ...this.windowSizes[app] };
      this.previousPositions[app] = { ...this.windowPositions[app] };

      // Use setTimeout to ensure the window is rendered before maximizing
      setTimeout(() => {
        // Maximize
        this.windowSizes[app] = { width: '100%', height: 'calc(100% - 28px)' };
        this.windowPositions[app] = { x: 0, y: 0 };
        this.isMaximized[app] = true;
      }, 50);
    }
  }

  closeApp(app: string) {
    this.openWindows[app] = false;

    // Set active window to the next open window if available
    const openApps = Object.keys(this.openWindows).filter(key => this.openWindows[key]);
    if (openApps.length > 0) {
      this.activeWindow = openApps[openApps.length - 1];
    } else {
      this.activeWindow = null;
    }
  }

  minimizeApp(app: string) {
    // Just toggle focus away for now
    this.activeWindow = null;
  }

  resetDragPosition(app: string) {
    // This helps reset the CDK drag position after programmatic position changes
    setTimeout(() => {
      const element = document.querySelector(`.${app}-window`) as HTMLElement;
      if (element) {
        // Force a reflow to reset the drag position
        element.style.transform = 'none';
      }
    }, 0);
  }

  maximizeApp(app: string) {
    if (this.isMaximized[app]) {
      // Restore previous size and position
      this.windowSizes[app] = this.previousSizes[app];
      this.windowPositions[app] = this.previousPositions[app];
      this.isMaximized[app] = false;
    } else {
      // Save current size and position
      this.previousSizes[app] = { ...this.windowSizes[app] };
      this.previousPositions[app] = { ...this.windowPositions[app] };

      // Windows 98 maximized windows fill the entire screen
      // and are positioned at (0,0)
      this.windowSizes[app] = { width: '100%', height: 'calc(100vh - 28px)' };
      this.windowPositions[app] = { x: 0, y: 0 };
      this.isMaximized[app] = true;
    }

    // Reset the CDK drag position to avoid conflicts
    this.resetDragPosition(app);

    // Make sure the window is active when maximized/restored
    this.setActiveWindow(app);
  }

  setActiveWindow(app: string) {
    this.activeWindow = app;
  }

  focusApp(app: string) {
    if (this.activeWindow === app) {
      // If already active, minimize
      this.activeWindow = null;
    } else {
      // Otherwise, focus
      this.activeWindow = app;
    }
  }

  onDragStarted(event: CdkDragStart, app: string) {
    // Ensure the window is active when dragging starts
    this.setActiveWindow(app);

    // If the window is maximized, restore it first
    if (this.isMaximized[app]) {
      this.maximizeApp(app); // This will toggle it back to normal size
    }
  }

  onDragEnded(event: CdkDragEnd, app: string) {
    // When drag ends, get the change in position
    const dragDelta = event.source.getFreeDragPosition();

    // Update the position by adding the delta to the original position
    this.windowPositions[app] = {
      x: this.windowPositions[app].x + dragDelta.x,
      y: this.windowPositions[app].y + dragDelta.y
    };

    // Reset the drag element's position to avoid double-counting
    event.source.reset();

    // Ensure the window stays within the viewport
    this.ensureWindowInViewport(app);

    // Keep the window active after dragging
    this.setActiveWindow(app);
  }

// Add this method to keep windows within viewport bounds
  ensureWindowInViewport(app: string) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 28; // Account for taskbar

    // Get current window dimensions
    let width = this.windowSizes[app].width;
    let height = this.windowSizes[app].height;

    // Convert percentage to pixels if needed
    if (width.endsWith('%')) {
      const percentage = parseFloat(width) / 100;
      width = (viewportWidth * percentage) + 'px';
    }

    if (height.endsWith('%')) {
      const percentage = parseFloat(height) / 100;
      height = (viewportHeight * percentage) + 'px';
    }

    // Get window width and height in pixels
    const widthPx = parseInt(width, 10);
    const heightPx = parseInt(height, 10);

    // Get current position
    let x = this.windowPositions[app].x;
    let y = this.windowPositions[app].y;

    // Ensure window title bar is accessible (at least 20px visible)
    if (x < -widthPx + 20) {
      x = -widthPx + 20;
    }

    if (x > viewportWidth - 20) {
      x = viewportWidth - 20;
    }

    if (y < 0) {
      y = 0;
    }

    if (y > viewportHeight - 20) {
      y = viewportHeight - 20;
    }

    // Update position
    this.windowPositions[app] = { x, y };
  }
}
