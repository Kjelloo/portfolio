import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Window } from '../models/window.model';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private windows: Map<string, Window> = new Map();
  private activeWindowId = new BehaviorSubject<string | null>(null);
  private windowsSubject = new BehaviorSubject<Window[]>([]);
  private isMobile = false;

  constructor() {
    // Initialize default windows
    this.initializeWindows();
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    // Initial resize check
    this.handleResize();
  }

  private handleResize() {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;
    
    if (this.isMobile !== isMobile) {
      this.isMobile = isMobile;
      this.updateAllWindowsForViewport();
    }
  }

  private updateAllWindowsForViewport() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 768;

    this.windows.forEach((windowConfig, id) => {
      if (windowConfig.isOpen) {
        if (isMobile && !windowConfig.isMaximized) {
          // Save current state before maximizing
          windowConfig.previousSize = { ...windowConfig.size };
          windowConfig.previousPosition = { ...windowConfig.position };
          
          // Maximize window
          windowConfig.size = { width: '100%', height: 'calc(100vh - 28px)' };
          windowConfig.position = { x: 0, y: 0 };
          windowConfig.isMaximized = true;
        } else if (!isMobile && windowConfig.isMaximized) {
          // Restore previous state
          windowConfig.size = windowConfig.previousSize || { width: '600px', height: '400px' };
          windowConfig.position = windowConfig.previousPosition || this.calculateCenterPosition(windowConfig.size);
          windowConfig.isMaximized = false;
        }
      }
    });
    this.updateWindowsSubject();
  }

  private calculateCenterPosition(size: { width: string; height: string }): { x: number; y: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Convert size to pixels
    const width = parseInt(size.width, 10);
    const height = parseInt(size.height, 10);
    
    // Calculate center position
    const x = Math.max(0, (viewportWidth - width) / 2);
    const y = Math.max(0, (viewportHeight - height - 28) / 2); // 28px for taskbar
    
    return { x, y };
  }

  private initializeWindows() {
    const defaultWindows: Window[] = [
      {
        id: 'about',
        title: 'About Me',
        isOpen: false,
        isMaximized: false,
        position: { x: 0, y: 0 },
        size: { width: '600px', height: '500px' },
        zIndex: 5
      },
      {
        id: 'resume',
        title: 'Resume',
        isOpen: false,
        isMaximized: false,
        position: { x: 0, y: 0 },
        size: { width: '750px', height: '600px' },
        zIndex: 5
      }
    ];

    defaultWindows.forEach(windowConfig => this.windows.set(windowConfig.id, windowConfig));
    this.updateWindowsSubject();
  }

  getWindows(): Observable<Window[]> {
    return this.windowsSubject.asObservable();
  }

  getActiveWindowId(): Observable<string | null> {
    return this.activeWindowId.asObservable();
  }

  openWindow(windowId: string) {
    const windowConfig = this.windows.get(windowId);
    if (windowConfig) {
      windowConfig.isOpen = true;
      
      // Calculate initial position and size based on viewport
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768;
      
      if (isMobile) {
        windowConfig.size = { width: '100%', height: 'calc(100vh - 28px)' };
        windowConfig.position = { x: 0, y: 0 };
        windowConfig.isMaximized = true;
      } else {
        windowConfig.size = { width: '600px', height: '500px' };
        windowConfig.position = this.calculateCenterPosition(windowConfig.size);
        windowConfig.isMaximized = false;
      }
      
      this.setActiveWindow(windowId);
      this.updateWindowsSubject();
    }
  }

  closeWindow(windowId: string) {
    const windowConfig = this.windows.get(windowId);
    if (windowConfig) {
      windowConfig.isOpen = false;
      if (this.activeWindowId.value === windowId) {
        this.setActiveWindow(null);
      }
      this.updateWindowsSubject();
    }
  }

  minimizeWindow(windowId: string) {
    this.setActiveWindow(null);
  }

  setActiveWindow(windowId: string | null) {
    this.activeWindowId.next(windowId);
    if (windowId) {
      const windowConfig = this.windows.get(windowId);
      if (windowConfig) {
        windowConfig.zIndex = 10;
        this.updateWindowsSubject();
      }
    }
  }

  updateWindowPosition(windowId: string, position: { x: number; y: number }) {
    const windowConfig = this.windows.get(windowId);
    if (windowConfig && !windowConfig.isMaximized) {
      windowConfig.position = position;
      this.updateWindowsSubject();
    }
  }

  updateWindowSize(windowId: string, size: { width: string; height: string }) {
    const windowConfig = this.windows.get(windowId);
    if (windowConfig && !windowConfig.isMaximized) {
      windowConfig.size = size;
      this.updateWindowsSubject();
    }
  }

  toggleMaximize(windowId: string) {
    const windowConfig = this.windows.get(windowId);
    if (windowConfig) {
      windowConfig.isMaximized = !windowConfig.isMaximized;
      if (windowConfig.isMaximized) {
        windowConfig.previousSize = { ...windowConfig.size };
        windowConfig.previousPosition = { ...windowConfig.position };
        windowConfig.size = { width: '100%', height: 'calc(100vh - 28px)' };
        windowConfig.position = { x: 0, y: 0 };
      } else {
        windowConfig.size = windowConfig.previousSize || { width: '600px', height: '500px' };
        windowConfig.position = windowConfig.previousPosition || this.calculateCenterPosition(windowConfig.size);
      }
      this.updateWindowsSubject();
    }
  }

  private updateWindowsSubject() {
    this.windowsSubject.next(Array.from(this.windows.values()));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}
