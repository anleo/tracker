import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';

import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {AuthResource} from "./auth.resource";
import {AuthRoutingModule} from "./auth.routing.module";
import {BlankComponent} from "../blank/blank.component";
import {AuthService} from "./auth.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [
    BlankComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordChangeComponent,
    PasswordResetComponent
  ],
  providers: [
    AuthResource,
    AuthService
  ]
})

export class AuthModule {
}
