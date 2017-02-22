import {Component, OnInit} from '@angular/core';
import {TaskService} from "../services/task.service";
import {Task} from "../models/task";
import {TaskStatusService} from "../services/task-status.service";
import {TaskStatus} from "../models/task-status";
import {Location} from "@angular/common";

@Component({
  moduleId: module.id,
  templateUrl: 'reports.component.html',
  providers: [TaskService]
})

export class ReportsComponent implements OnInit {
  date: Date | null = new Date;
  tasks: Task[] = [];
  showDatePicker: boolean = false;
  TaskStatus = TaskStatus;

  constructor(private contextTaskService: TaskService,
              private taskStatusService: TaskStatusService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.contextTaskService
      .getTaskReportByDate(this.date)
      .subscribe(tasks => {
        this.contextTaskService.setTasks(tasks);
        return this.tasks = tasks;
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
    this.contextTaskService
      .getTaskReportByDate(this.date)
      .subscribe(tasks => {
        this.contextTaskService.setTasks(tasks);
        return this.tasks = tasks;
      });
  }

  getStatusById(id: string) {
    let status: TaskStatus | null = null;

    this.taskStatusService.getById(id)
      .subscribe(taskStatus => {
        status = taskStatus;
        return taskStatus;
      });

    return status;
  }

}
