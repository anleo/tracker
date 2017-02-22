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

  @Output() teamUpdated: EventEmitter <Task> = new EventEmitter();

  constructor(private userService: UserService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.userService
      .getUsers()
      .map(users => this.prepareUser(users))
      .subscribe(users => this.users = users);

    if (this.task._id) {
      this.taskService
        .getTaskTeam(this.task._id)
        .map(team => this.prepareUser(team))
        .subscribe(team => {
          let teamData = this.syncTaskTeam(team);
          this.teamFull = teamData.teamFull;
          this.team = teamData.team;

          return this;
        });
    }
  }

  selected(user: {id: string, text: string}): void {
    this.team.push(user.id);
    this.updateTeam();
  }

  removed(user: {id: string, text: string}): void {
    this.team.filter((member, index) => {
      if (member === user.id) {
        delete this.team[index];
        this.updateTeam();
      }
    });
  }

  protected updateTeam(): void {
    this.task.team = this.team;
    this.teamUpdated.emit(this.task);
  }

  protected syncTaskTeam(team: Array<{id: string, text: string}>) {
    let teamFullArray = [];
    let teamArray = [];

    team.map(member => {
      this.task.team
        .filter(memberId => {
          if (memberId === member.id) {
            teamFullArray.push(member);
            teamArray.push(member.id)
          }
        });
    });

    return {
      teamFull: teamFullArray,
      team: teamArray
    };
  }

  protected prepareUser(users: User[]): Array<{id: string, text: string}> {
    let userList = [];
    users.forEach((user) => userList.push({id: user._id, text: user.name}));

    return userList;
  }

}
