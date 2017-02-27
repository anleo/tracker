import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../user/services/user.service";
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {User} from "../../../user/models/user";

@Component({
  templateUrl: 'my-tasks.component.html'
})

export class MyTasksComponent implements OnInit {
  tasks: Task[] = [];
  user: User | null = null;

  constructor(private userService: UserService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.userService.get()
      .subscribe(user => this.user = user);

    this.taskService.getUserTasks(this.user._id)
      .subscribe(tasks => this.tasks = tasks);
  }


}
