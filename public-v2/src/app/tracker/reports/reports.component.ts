import {Component, OnInit} from '@angular/core';
import {TaskService} from "../services/task.service";
import {Task} from "../models/task";

@Component({
  moduleId: module.id,
  templateUrl: 'reports.component.html'
})

export class ReportsComponent implements OnInit {
  date: string = 'Thu%20Feb%2016%202017%2016:14:05%20GMT+0200%20(EET)'
  tasks: Task[] = [];
  date3: string = '';
  showDatepicker: boolean = false;

  constructor(private taskService: TaskService){}

  ngOnInit(): void {
    this.taskService
      .getReportByDate(this.date)
      .subscribe(tasks => this.tasks = tasks);
  }

  toggleDatepicker(): void {
    this.showDatepicker = !this.showDatepicker;
  }

}
