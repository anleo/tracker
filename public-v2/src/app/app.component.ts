import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "./user/models/user";
import {UserService} from "./user/services/user.service";
import {BrowserTitleService} from './services/browser-title/browser-title.service';
import {TaskService} from "./tracker/services/task.service";
import {ROOT_TASKSERVICE} from "./app.tokens";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers: [TaskService]
})

export class AppComponent implements OnInit, OnDestroy {
  user: User;
  taskId: string = null;

  constructor(private router: Router,
              private browserTitleService: BrowserTitleService,
              private userService: UserService,
              @Inject(ROOT_TASKSERVICE) private rootTaskService) {
  };

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.browserTitleService.getTitleByUrl(event.url);
    });

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.rootTaskService.task$
      .subscribe((task) => {
        this.taskId = task && task._id;
      })
  }

  ngOnDestroy() {
    this.rootTaskService.task$.unsubscribe();
  }
}
