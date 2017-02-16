import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "./user.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [UserService]
})

export class UserModule {
}
