import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../models/task";

@Component({
  selector: 'app-task-metrics',
  templateUrl: './task-metrics.component.html'
})
export class TaskMetricsComponent implements OnInit{
  @Input() task: Task;
  metricsDetails: number;
  options:any;

  ngOnInit(){
    console.log('task', this.task);
  }

  public setLabelClass(): string {
    let className = 'label-info';

    if (this.task.status === 'accepted') {
      className = 'label-success';
    }

    if (this.task.status === 'in progress') {
      className = 'label-warning'
    }

    return className;
  }
}
