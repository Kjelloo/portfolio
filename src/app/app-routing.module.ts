import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  // {
  //   path: '',
  //   component: UnderConstructionComponent,
  // },
  // {
  //   path: '**',
  //   component: UnderConstructionComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
