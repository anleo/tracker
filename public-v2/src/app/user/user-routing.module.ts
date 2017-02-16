import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ProfileComponent} from "./components/user-profile.component";

const userRoutes: Routes = [
  {path: '', redirectTo: '/app/users/me', pathMatch: 'full'},
  {
    path: '',
    children: [
      {
        path: 'me',
        component: ProfileComponent
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
