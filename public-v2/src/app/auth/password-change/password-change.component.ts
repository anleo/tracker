import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {AuthService} from "../auth.service";
import {ToastService} from "../../services/toast.service";

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
              public toastService: ToastService) {
  }

  change(): void {
    let token = this.route.snapshot.params['token'];

    if (this.newPassword === this.newPasswordConfirm && token) {
      this.authService
        .changePassword(this.newPassword, token)
        .then(() => {
          this.toastService.success('Saved');
          this.router.navigate(['/app/tasks']);
        })
        .catch((err: any) => {
          this.toastService.error('Wrong password');
        })
    } else {
      this.toastService.error('Mismatch in new password');
    }
  }
}
