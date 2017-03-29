import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from "@angular/common";
import * as moment from 'moment/moment';
import {Subject} from "rxjs";

import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import {Task} from "../../models/task";
import {User} from "../../../user/models/user";
import {UserService} from "../../../user/services/user.service";
import {CurrentTaskService} from "../../services/current-task.service";

@Component({
  templateUrl: 'task-report.component.html',
  providers: [TaskService]
})

export class TaskReportComponent implements OnInit, OnDestroy {
  date: Date = new Date;
  today: Date = new Date;
  tasks: Task[] = [];
  taskId: string;
  showDatePicker: boolean = false;
  TaskStatus = TaskStatus;
  team: Array<{id: string, text: string}> = [];
  developer: Array<{id: string, text: string}> = [];
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private contextTaskService: TaskService,
              private taskStatusService: TaskStatusService,
              private currentTaskService: CurrentTaskService,
              private userService: UserService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => {
      this.taskId = task._id;
    });

    this.contextTaskService
      .getTaskTeam(this.taskId)
      .map(users => this.prepareUsers(users))
      .subscribe(users => {
        this.team = users;
        this.team.unshift({id: 'all', text: 'All'});
      });

    this.userService.get()
      .map(user => this.prepareUsers([user]))
      .map(user => this.developer = user)
      .subscribe(user => {
        let developer = this.getDeveloper();

        this.initTasks(this.taskId, this.date.toString(), developer.id);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  initTasks(taskId, date, userId): void {
    this.contextTaskService
      .getTaskReportByTask(taskId, date, userId)
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onClose(): void {
    this.showDatePicker = false;
  }

  onChangeDate(date): void {
    this.date = date;
    let developer = this.getDeveloper();
    date = this.prepareDate(date);

    this.initTasks(this.taskId, date, developer.id);
    this.showDatePicker = false;
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

    this.taskStatusService
      .getById(id)
      .subscribe(taskStatus => status = taskStatus);

    return status;
  }

  private getDeveloper(): {id: string, text: string}  {
    return this.developer[0];
  }

  private setDeveloper(developer) {
    this.developer = [developer];

    return this;
  }

  private prepareUsers(users: User[]): Array<{id: string, text: string}> {
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
