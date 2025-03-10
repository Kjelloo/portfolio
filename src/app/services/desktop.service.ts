import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DesktopIcon } from '../models/window.model';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class DesktopService {
  private desktopIcons: DesktopIcon[] = [
    {
      id: 'about',
      title: 'About Me',
      iconPath: 'assets/icons/about.png',
      action: () => this.windowService.openWindow('about')
    },
    {
      id: 'resume',
      title: 'Resume',
      iconPath: 'assets/icons/file.png',
      action: () => this.windowService.openWindow('resume')
    },
    {
      id: 'mail',
      title: 'Email Me',
      iconPath: 'assets/icons/mail.png',
      action: () => window.location.href = "mailto:kjell.schoke@outlook.com"
    },
    {
      id: 'github',
      title: 'GitHub',
      iconPath: 'assets/icons/github.png',
      action: () => window.open('https://github.com/kjelloo', '_blank')
    },
    {
      'id': 'trash',
      'title': 'Recycle Bin',
      'iconPath': 'assets/icons/trash.png',
      'action': () => undefined
    },
    {
      'id': 'computer',
      'title': 'Computer',
      'iconPath': 'assets/icons/computer.png',
      'action': () => undefined
    }
  ];

  private desktopIconsSubject = new BehaviorSubject<DesktopIcon[]>(this.desktopIcons);

  constructor(private windowService: WindowService) {}

  getDesktopIcons(): Observable<DesktopIcon[]> {
    return this.desktopIconsSubject.asObservable();
  }

  handleIconClick(iconId: string) {
    const icon = this.desktopIcons.find(i => i.id === iconId);
    if (icon) {
      icon.action();
    }
  }
}
