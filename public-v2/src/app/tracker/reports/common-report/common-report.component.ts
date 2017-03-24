import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import * as moment from 'moment/moment';
import {Location} from "@angular/common";

@Component({
  templateUrl: 'common-report.component.html',
  providers: [TaskService]
})

export class CommonReportComponent implements OnInit {
  date: Date = new Date;
  today: Date = new Date;
  tasks: Task[] = [];
  showDatePicker: boolean = false;
  showMetrics: boolean = false;
  TaskStatus = TaskStatus;

  constructor(private contextTaskService: TaskService,
              private taskStatusService: TaskStatusService,
              private location: Location) {}

  ngOnInit(): void {
    this.contextTaskService
      .getTaskReportByDate(this.date.toString())
      .subscribe(tasks => {
        this.tasks = tasks;
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
    date = this.prepareDate(date);

    this.contextTaskService
      .getTaskReportByDate(date)
      .subscribe(tasks => {
        this.tasks = tasks;
      });

    this.showDatePicker = false;
  }

  getStatusById(id: string) {
    let status: TaskStatus | null = null;


    this.taskStatusService
      .getById(id)
      .subscribe(taskStatus => status = taskStatus);

    return status;
  }

  private prepareDate(date): string {
    let currentTime = moment(this.today).format('hh:mm:ss');

    date = date.toString()
      .replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, currentTime);

    return date;
  }
}
