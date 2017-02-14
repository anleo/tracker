import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

import {BlankComponent} from "../blank/blank.component";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {PasswordChangeComponent} from "./password-change/password-change.component";

const routes: Routes = [
  {
    path: '',
    component: BlankComponent,

    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      {
        path: 'password',
        children: [
          {
            path: 'reset',
            component: PasswordResetComponent
          },
          {
            path: 'change',
            component: PasswordChangeComponent
          }
        ],
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
