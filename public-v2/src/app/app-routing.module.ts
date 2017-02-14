import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {BlankComponent} from "./blank/blank.component";

const routes: Routes = [
  {
    path: 'app',
    component: BlankComponent
  },
  {
    path: 'tracker',
    loadChildren: './tracker/tracker.module#TrackerModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
