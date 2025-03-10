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
