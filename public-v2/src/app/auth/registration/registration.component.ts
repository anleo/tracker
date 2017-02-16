import {Component, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {AuthService} from "../auth.service";
import {AuthUser} from "../AuthUser";
import {User} from "../../user/model/user";

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})
export class RegistrationComponent {
  user: AuthUser = new AuthUser();

  constructor(private authService: AuthService,
              private router: Router,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  register(): void {
    this.authService
      .register(this.user)
      .then((user: User) => this.router.navigate(['/app/tasks']))
      .catch((err: any) => {
        this.toastr.error(err._body);
      })
  }

}
