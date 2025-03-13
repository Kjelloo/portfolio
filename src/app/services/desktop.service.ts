import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DesktopIcon } from '../models/window.model';
import { WindowService } from './window.service';
import { ErrorDialogService } from './error-dialog.service';

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
      iconPath: 'assets/icons/resume.png',
      action: () => this.windowService.openWindow('resume')
    },
    {
      id: 'mail',
      title: 'Email Me',
      iconPath: 'assets/icons/mail.png',
      action: () => window.location.href = "mailto:kjell.schoke@outlook.com"
    },
    {
      'id': 'trash',
      'title': 'Recycle Bin',
      'iconPath': 'assets/icons/trash.png',
      'action': () => this.errorDialogService.showError('Recycle Bin', 'The Recycle Bin is currently unavailable.')
    },
    {
      'id': 'computer',
      'title': 'Computer',
      'iconPath': 'assets/icons/computer.png',
      'action': () => this.errorDialogService.showError('My Computer', 'Access to this resource has been denied.')
    }
  ];

  private desktopIconsSubject = new BehaviorSubject<DesktopIcon[]>(this.desktopIcons);

  constructor(
    private windowService: WindowService,
    private errorDialogService: ErrorDialogService
  ) {}

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
