import {Component, OnInit} from '@angular/core';
import {User} from "./user/model/user";
import {UserService} from "./user/service/user.service";

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
  };

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => this.user = user);
  }
}
