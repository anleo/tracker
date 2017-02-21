import {Component, Input} from '@angular/core';
import {Task} from "../../models/task";

@Component({
  selector: 'app-task-metrics',
  templateUrl: './task-metrics.component.html'
})
export class TaskMetricsComponent {
  @Input() task: Task;
  metricsDetails: number;
  options:any;

  constructor() {
  }

}
