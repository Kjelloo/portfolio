import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {UnderConstructionComponent} from "./under-construction/under-construction.component";

const routes: Routes = [
  {
    // path: '' ,
    // loadChildren: () => import('./home/home.module')
    //   .then(m => m.HomeModule)
    path: '',
    component: UnderConstructionComponent,
  },
  {
    path: '**',
    component: UnderConstructionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
