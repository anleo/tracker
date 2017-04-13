import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {TaskBoard} from "../../../models/task-board";
import {UserService} from "../../../../user/services/user.service";
import {User} from "../../../../user/models/user";
import {TaskService} from "../../../services/task.service";
import * as _ from 'lodash';

@Component({
  selector: 'board-team-select',
  templateUrl: 'board-team.component.html'
})

export class BoardTeamComponent implements OnInit {
  @Input() task: Task;
  @Input() board: TaskBoard;

  users: Array <{id: string, text: string}> = [];
  teamFull: Array <{id: string, text: string}> = [];
  team: Array <string> = [];

  @Output() teamUpdated: EventEmitter <TaskBoard> = new EventEmitter();

  constructor(private userService: UserService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    if (this.task && this.task._id) {
      this.taskService
        .getTaskTeam(this.task._id)
        .map(team => this.prepareUser(team))
        .subscribe(team => {
          this.users = team;
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
    this.team = _.without(this.team, user.id);
    this.updateTeam();
  }

  protected updateTeam(): void {
    this.board.shared = this.team;
    this.teamUpdated.emit(this.board);
  }

  protected syncTaskTeam(team: Array<{id: string, text: string}>) {
    let teamFullArray = [];
    let teamArray = [];

    team.map(member => {
      this.board.shared
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
