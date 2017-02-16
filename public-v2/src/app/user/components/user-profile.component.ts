import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/catch'
import 'rxjs/Rx';

import {User} from "../model/user";
import {Password} from "../model/password";
import {UserService} from "../service/user.service";

@Component({
  moduleId: module.id,
  templateUrl: 'user-profile.component.html'
})

export class ProfileComponent implements OnInit {
  user: User = new User();
  password: Password = new Password();
  changePass: boolean = false;

  constructor(private userService: UserService,
              private toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.userService.get().subscribe((user) => this.user = user);
  }

  save(): void {
    this.userService
      .save(this.user)
      .subscribe((user) => {
        this.user = user;
        this.toastr.info('', 'Saved');
      }, (err) => {
        this.toastr.error('', JSON.parse(err._body).toString());
      })
  }

  passwordChange(): void {
    let isPasswordChanged = this.password.newPassword !== this.password.oldPassword;
    let arePasswordsEqual = this.password.newPassword === this.password.newPasswordConfirm;

    if (arePasswordsEqual && isPasswordChanged) {
      this.userService
        .editPassword(this.password)
        .subscribe(() => {
          this.toastr.info('', 'Saved');
        }, () => {
          this.toastr.error('', 'Wrong password');
        });
    } else {
      this.toastr.error('', 'Mismatch in new password');
    }
  }
}
