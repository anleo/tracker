import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import * as moment from 'moment/moment';
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../user/models/user";
import {Location} from "@angular/common";
import {UserService} from "../../../user/services/user.service";

@Component({
  templateUrl: 'task-report.component.html',
  providers: [TaskService]
})

export class TaskReportComponent implements OnInit {
  date: Date | null = new Date;
  today: Date | null = new Date;
  tasks: Task[] = [];
  taskId: string;
  showDatePicker: boolean = false;
  showMetrics: boolean = false;
  TaskStatus = TaskStatus;
  team: Array<{id: string, text: string}> = [];
  developer: Array<{id: string, text: string}> = [];

  constructor(private contextTaskService: TaskService,
              private taskStatusService: TaskStatusService,
              private userService: UserService,
              private location: Location,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.taskId = this.route.parent.snapshot.params['taskId'];

    this.contextTaskService
      .getTaskTeam(this.taskId)
      .map(users => this.prepareUser(users))
      .subscribe(users => {
        this.team = users;
        this.team.unshift({id: 'all', text: 'All'});
      });

    this.userService.get()
      .map(user => this.prepareUser([user]))
      .map(user => this.developer = user)
      .subscribe(user => {
        let developer = this.getDeveloper();

        this.initTasks(this.taskId, this.date.toString(), developer.id);
      });
  }

  initTasks(taskId, date, userId): void {
    this.contextTaskService
      .getTaskReportByTask(taskId, date, userId)
      .subscribe(tasks => {
        this.contextTaskService.setTasks(tasks);
        return this.tasks = tasks;
      });
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  toggleMetrics(): void {
    this.showMetrics = !this.showMetrics;
  }

  onClose(): void {
    this.showDatePicker = false;
  }

  onChangeDate(date): void {
    this.date = date;
    let developer = this.getDeveloper();
    date = this.prepareDate(date);

    this.initTasks(this.taskId, date, developer.id);
  }

  onChangeDeveloper(developer): void {
    this.setDeveloper(developer);

    if(developer.id === 'all'){
      developer.id = '';
    }

    this.initTasks(this.taskId, this.date.toString(), developer.id);
  }

  getStatusById(id: string): TaskStatus {
    let status: TaskStatus | null = null;

    this.taskStatusService.getById(id)
      .subscribe(taskStatus => {
        status = taskStatus;
        return taskStatus;
      });

    return status;
  }

  private getDeveloper(): {id: string, text: string}  {
    return this.developer[0];
  }

  private setDeveloper(developer) {
    this.developer = [developer];

    return this;
  }

  private prepareUser(users: User[]): Array<{id: string, text: string}> {
    let userList = [];
    users.forEach((user) => userList.push({id: user._id, text: user.name}));

    return userList;
  }

  private prepareDate(date): string {
    let currentTime = moment(this.today).format('hh:mm:ss');

    date = date.toString()
      .replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, currentTime);

    return date;
  }
}
