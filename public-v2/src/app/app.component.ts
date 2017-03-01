import {Component, OnInit, OnDestroy} from '@angular/core';
import {User} from "./user/models/user";
import {UserService} from "./user/services/user.service";
import {TaskService} from "./tracker/services/task.service";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers: [TaskService]
})

export class AppComponent implements OnInit, OnDestroy {
  user: User;
  taskId: string = null;

  constructor(private userService: UserService,
              private taskService: TaskService) {
  };

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.taskService.task$
      .subscribe((task) => {
        this.taskId = task && task._id;
      })
  }

  ngOnDestroy() {
    this.taskService.task$.unsubscribe();
  }
}
