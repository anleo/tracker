import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./auth/login/login.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {PasswordResetComponent} from "./auth/password-reset/password-reset.component";
import {PasswordChangeComponent} from "./auth/password-change/password-change.component";
import {BlankComponent} from "./blank/blank.component";
import {LogoutComponent} from "./auth/logout/logout.component";

const routes: Routes = [
  {
    path: 'app',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      {
        path: 'reset-password',
        component: PasswordResetComponent
      },
      {
        path: 'tasks',
        loadChildren: './tracker/tracker.module#TrackerModule'
      }
    ]
  },
  {
    path: 'public',
    component: BlankComponent,
    children:[
      {
        path: 'change-password/:token',
        component: PasswordChangeComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'app/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'app/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
