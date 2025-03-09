import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HomeModule} from "./home/home.module";
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import {NgOptimizedImage} from "@angular/common";
import {CdkDrag} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    UnderConstructionComponent,
  ],
  imports: [
    BrowserModule,
    HomeModule,
    AppRoutingModule,
    NgOptimizedImage,
    CdkDrag
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
