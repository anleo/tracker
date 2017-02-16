import {Component, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent {
  newPassword: string = null;
  newPasswordConfirm: string = null;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  change(): void {
    let token = this.route.snapshot.params['token'];

    if (this.newPassword === this.newPasswordConfirm && token) {
      this.authService
        .changePassword(this.newPassword, token)
        .then(() => {
          this.toastr.success('Saved');
          this.router.navigate(['/app/tasks']);
        })
        .catch((err: any) => {
          this.toastr.error('Wrong password');
        })
    } else {
      this.toastr.error('Mismatch in new password');
    }
  }
}
