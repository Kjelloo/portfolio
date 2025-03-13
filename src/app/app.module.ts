import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import {NgOptimizedImage} from "@angular/common";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import { DesktopComponent } from './components/desktop/desktop.component';
import { TaskbarComponent } from './components/taskbar/taskbar.component';
import { WindowComponent } from './components/window/window.component';
import { AboutComponent } from './windows/about/about.component';
import { ResumeComponent } from './windows/resume/resume.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UnderConstructionComponent,
    DesktopComponent,
    TaskbarComponent,
    WindowComponent,
    AboutComponent,
    ResumeComponent,
    ErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    DragDropModule,
    CdkDrag,
    CdkDragHandle
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
