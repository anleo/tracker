import {Component, ViewContainerRef} from '@angular/core';
import {AuthService} from "../auth.service";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  email: string = null;

  constructor(private authService: AuthService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  reset(): void {
    this.authService
      .resetPassword(this.email)
      .then((res: any) => this.toastr.success('Request was sent'))
      .catch((err: any) => {
        this.toastr.error('Check your e-mail or login');
      });
  }
}
