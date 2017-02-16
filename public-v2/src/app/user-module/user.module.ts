import {NgModule} from '@angular/core';
import {UserService} from "./service/user.service";
import {UserResource} from "./service/user.resource";
import {UserRoutingModule} from "./user-routing.module";
import {ProfileComponent} from "./components/user-profile.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    UserRoutingModule,
    FormsModule,
    CommonModule,
  ],
  providers: [
    UserResource,
    UserService]
})

export class UserModule {
}
