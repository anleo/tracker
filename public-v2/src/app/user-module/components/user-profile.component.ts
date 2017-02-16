import {Component, OnInit} from "@angular/core";
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

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.get().subscribe((user) => this.user = user);
  }

  save(): void {
    this.userService
      .save(this.user)
      .subscribe((user) => {
        // toaster.pop({
        //   title: 'Saved'
        // });
        this.user = user;
      }, (err) => {
        console.log('err', err.data);

        // toaster.pop({
        //   type: 'error',
        //   title: err.data.toString()
        // });
      })
  }

  passwordChange(): void {
    let isPasswordChanged = this.password.newPassword !== this.password.oldPassword;
    let arePasswordsEqual = this.password.newPassword === this.password.newPasswordConfirm;

    if (arePasswordsEqual && isPasswordChanged) {
      this.userService
        .editPassword(this.password)
        .subscribe(() => {
          console.log('password was changed')
          // toaster.pop({
          //   title: 'Saved'
          // });
        })
      // .catch({
      // toaster.pop({
      //   type: 'error',
      //   title: 'Wrong password'
      // });

      // });
    } else {
// TODO @@@id: add toster
//       toaster.pop({
//         type: 'error',
//         title: 'Mismatch in new password'
//       });
    }
  }
}
