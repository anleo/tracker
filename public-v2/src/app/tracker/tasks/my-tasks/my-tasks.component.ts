import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../user/services/user.service";
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {User} from "../../../user/models/user";
import {Location} from "@angular/common";

@Component({
  templateUrl: 'my-tasks.component.html'
})

export class MyTasksComponent implements OnInit {
  tasks: Task[] = [];
  user: User | null = null;
  editMode: boolean = false;
  editTask$: Task|null;

  constructor(private userService: UserService,
              private taskService: TaskService,
              private location: Location) {}

  ngOnInit(): void {
    this.taskService.editTaskModal$
      .subscribe((flag) => this.editMode = flag);
    this.taskService.editTask$
      .subscribe((task) => this.editTask$ = task);

    this.userService.get()
      .subscribe(user => this.user = user);

    this.taskService.getUserTasks(this.user._id)
      .subscribe(tasks => {
        this.tasks = tasks;
        this.taskService.setTasks(tasks);
      });
  }
}
