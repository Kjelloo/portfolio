import {Component, OnInit} from '@angular/core';
import {CdkDragEnd, CdkDragStart} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Kjell Schoke';

  currentTime: Date = new Date();
  startMenuOpen: boolean = false;
  activeWindow: string | null = null;

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
    }, 60000);

    // Open default windows on start
    setTimeout(() => {
      this.openApp('about');
      setTimeout(() => {
        this.openApp('resume');
      }, 500);
    }, 1000);
  }

  toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;
  }

  openApp(app: string) {
    this.openWindows[app] = true;
    this.setActiveWindow(app);
    this.startMenuOpen = false;
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

      // Maximize
      this.windowSizes[app] = { width: '100%', height: 'calc(100% - 28px)' };
      this.windowPositions[app] = { x: 0, y: 0 };
      this.isMaximized[app] = true;
    }

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

    // Keep the window active after dragging
    this.setActiveWindow(app);
  }
}
