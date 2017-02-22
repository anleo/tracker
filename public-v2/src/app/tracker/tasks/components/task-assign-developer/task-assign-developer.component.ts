import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {User} from "../../../../user/models/user";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'task-assign-developer',
  templateUrl: 'task-assign-developer.component.html'
})

export class TaskAssignDeveloperComponent implements OnInit {
  @Input() task: Task;

  teamFull: Array <{id: string, text: string}> = [];
  team: User[] = [];
  assignedTo = null;

  @Output() developerAssigned: EventEmitter <Task> = new EventEmitter();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService
      .getTaskTeam(this.task.parentTaskId)
      .map(team => this.team = team)
      .map(team => this.prepareUser(team))
      .subscribe(team => {
        return this.teamFull = team;
      });

    if(this.task.developer){
      this.assignedTo = this.prepareUser([this.task.developer])
    }
  }

  selected(user: {id: string, text: string}): void {
    this.team.filter((member, index) => {
      if (member._id === user.id) {
        this.task.developer = member;
        this.developerAssigned.emit(this.task);
      }
    });
  }

  protected prepareUser(users: User[]): Array<{id: string, text: string}> {
    let userList = [];
    users.forEach((user) => userList.push({id: user._id, text: user.name}));

    return userList;
  }

}
