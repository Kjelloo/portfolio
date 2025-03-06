import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { IntroductionComponent } from './components/introduction/introduction.component';

@NgModule({
  declarations: [
    DashboardPage,
    IntroductionComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
