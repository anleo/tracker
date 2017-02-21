import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {UserService} from "../../../../user/services/user.service";
import {User} from "../../../../user/models/user";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'task-team-select',
  templateUrl: 'task-team.component.html'
})

export class TaskTeamComponent implements OnInit {
  @Input() task: Task;

  users: Array <{id: string, text: string}> = [];
  teamFull: Array <{id: string, text: string}> = [];
  team: Array <string> = [];

  @Output() teamUpdated = new EventEmitter();

  constructor(private userService: UserService,
              private taskService: TaskService) {}

  ngOnInit(): void {
    this.userService
      .getUsers()
      .map(users => this.convertUserForNgSelect(users))
      .subscribe(users => this.users = users);

    if(this.task._id){
      this.taskService
        .getTaskTeam(this.task._id)
        .map(team => this.convertUserForNgSelect(team))
        .subscribe(team => {
          team.map(member => this.team.push(member.id));

          return this.teamFull = team;
        });
    }

  }

  public selected(user: {id: string, text: string}): void {
    this.team.push(user.id);
    this.task.team = this.team;
    this.teamUpdated.emit(this.task);
  }

  public removed(user: {id: string, text: string}): void {
    this.team.filter((member, index) => {
      if (member === user.id) {
        delete this.task.team[index];
      }
    });
  }

  protected convertUserForNgSelect(users: User[]): Array<{id: string, text: string}> {
    let userList = [];
    users.forEach((user) => userList.push({id: user._id, text: user.name}));

    return userList;
  }

}
