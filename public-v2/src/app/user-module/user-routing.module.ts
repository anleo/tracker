import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ProfileComponent} from "./user-profile.component";

const userRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'me', component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})

export class UserRoutingModule {
}
