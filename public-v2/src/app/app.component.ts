import {Component, OnInit} from '@angular/core';
import {User} from "./user/models/user";
import {UserService} from "./user/services/user.service";

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  };

  ngOnInit(): void {
  }
}
