import { Component, OnInit } from '@angular/core';
import { DesktopService } from '../../services/desktop.service';
import { DesktopIcon } from '../../models/window.model';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})
export class DesktopComponent implements OnInit {
  desktopIcons: DesktopIcon[] = [];

  constructor(private desktopService: DesktopService) {}

  ngOnInit() {
    this.desktopService.getDesktopIcons().subscribe(icons => {
      this.desktopIcons = icons;
    });
  }

  handleIconClick(iconId: string) {
    this.desktopService.handleIconClick(iconId);
  }
} 