import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { CasesComponent } from './components/cases/cases.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    DashboardPage,
    IntroductionComponent,
    CasesComponent,
    ContactComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
