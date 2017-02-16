import {Component, ViewContainerRef} from '@angular/core';
import {AuthService} from "../auth.service";
// import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  email: string = null;

  constructor(private authService: AuthService,
              // private toastr: ToastsManager,
              // private vcr: ViewContainerRef
  ) {
    // this.toastr.setRootViewContainerRef(vcr);
  }

  reset(): void {
    this.authService
      .resetPassword(this.email)
      .then((res: any) => console.log('email was sent', res))
      .catch((err: any) => {
        // this.toastr.error('This is not good!', 'Oops!');
        console.log(err)
      });
  }
}
