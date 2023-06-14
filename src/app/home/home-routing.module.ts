import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DashboardPage} from "./pages/dashboard/dashboard.page";
import {CasesComponent} from "./components/cases/cases.component";
import {ContactComponent} from "./components/contact/contact.component";

const routes: Routes = [
  { path: '', component: DashboardPage},
  { path: 'cases', component: CasesComponent},
  { path: 'contact', component: ContactComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
