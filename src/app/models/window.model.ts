export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  component?: any;
  position: { x: number, y: number };
  size: { width: string, height: string };
  isOpen: boolean;
  isMaximized: boolean;
  isActive: boolean;
  previousSize?: { width: string, height: string };
  previousPosition?: { x: number, y: number };
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: string;
  height: string;
}

export interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: string;
    height: string;
  };
  zIndex: number;
  previousSize?: {
    width: string;
    height: string;
  };
  previousPosition?: {
    x: number;
    y: number;
  };
}

export interface DesktopIcon {
  id: string;
  title: string;
  iconPath: string;
  action: () => void;
}
