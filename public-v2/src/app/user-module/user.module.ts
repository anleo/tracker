import {NgModule} from '@angular/core';
import {UserService} from "./user.service";
import {UserResource} from "./user.resource";
import {UserRoutingModule} from "./user-routing.module";
import {ProfileComponent} from "./user-profile.component";

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    UserRoutingModule],
  providers: [
    UserResource,
    UserService]
})

export class UserModule {
}
