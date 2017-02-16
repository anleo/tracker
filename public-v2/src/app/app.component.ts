import {Component, OnInit} from '@angular/core';
import {UserService} from "./user/service/user.service";
import {User} from "./user/model/user";

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  constructor(private userService: UserService) {
  };

  user: User;

  ngOnInit() {
    // this.userService.user$.subscribe((user) => this.user = user)
  }
}
