import {Component, OnInit, Input} from '@angular/core';
import {Task} from "../../models/task";
import {MetricsWidget} from "./MetricsWidget";

@Component({
  selector: 'app-metrics-widget',
  templateUrl: './metrics-widget.component.html'
})
export class MetricsWidgetComponent implements OnInit {
  @Input()
  tasks: Task[] = [];
  simpleOnly: boolean;
  metricsWidget: MetricsWidget;

  constructor() {
  }

  ngOnInit() {
    this.tasks.forEach(function (task) {
      if (this.simpleOnly && task.simple || !this.simpleOnly) {
        if (task.estimatedTime) {
          this.metricsWidget.estimatedTime += task.estimatedTime;
        }
        if (task.complexity) {
          this.metricsWidget.points += task.points;
        }
        if (task.timeToDo) {
          this.metricsWidget.timeToDo += task.timeToDo;
        }
      }
    })
  }

}
