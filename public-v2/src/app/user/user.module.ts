import {NgModule} from '@angular/core';
import {UserService} from "./services/user.service";
import {UserResource} from "./services/user.resource";
import {ProfileComponent} from "./components/user-profile.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {UserResolver} from "./resolver/UserResolver";

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    ProfileComponent
  ],
  providers: [
    UserResource,
    UserService,
    UserResolver]
})

export class UserModule {
}
