import {Component, OnInit} from '@angular/core';
import {TaskService} from "../services/task.service";
import {Task} from "../models/task";
import {TaskStatusService} from "../services/task-status.service";
import {TaskStatus} from "../models/task-status";

@Component({
  moduleId: module.id,
  templateUrl: 'reports.component.html'
})

export class ReportsComponent implements OnInit {
  date: Date | null = new Date;
  tasks: Task[] = [];
  showDatePicker: boolean = false;
  TaskStatus = TaskStatus;

  constructor(
    private taskService: TaskService,
    private taskStatusService: TaskStatusService
  ) {}

  ngOnInit(): void {
    this.taskService
      .getTaskReportByDate(this.date)
      .subscribe(tasks => this.tasks = tasks);
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onClose(): void {
    this.showDatePicker = false;
  }

  onChangeDate(date): void {
      this.date = date;
      this.taskService
        .getTaskReportByDate(this.date)
        .subscribe(tasks => this.tasks = tasks);
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
