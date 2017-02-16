import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';

import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {AuthResource} from "./auth.resource";

import {BlankComponent} from "../blank/blank.component";
import {AuthService} from "./auth.service";
import {RouterModule} from "@angular/router";
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    BlankComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordChangeComponent,
    PasswordResetComponent,
    LogoutComponent
  ],
  providers: [
    AuthResource,
    AuthService
  ]
})

export class AuthModule {
}
