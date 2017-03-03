import {Component, Input} from '@angular/core';
import {Task} from "../../models/task";

@Component({
  selector: 'app-task-metrics',
  templateUrl: './task-metrics.component.html'
})
export class TaskMetricsComponent {
  @Input() task: Task;
  @Input() showStatus: boolean;
  @Input() metricsDetails: number;

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
