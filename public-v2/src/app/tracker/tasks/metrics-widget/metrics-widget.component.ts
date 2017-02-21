import {Component, OnInit, Input} from '@angular/core';
import {Task} from "../../models/task";
import {MetricsWidget} from "./MetricsWidget";

@Component({
  selector: 'app-metrics-widget',
  templateUrl: './metrics-widget.component.html'
})
export class MetricsWidgetComponent implements OnInit {
  metricsWidget: MetricsWidget;
  counter: number = 0;
  @Input()
  tasks: Task[];
  simpleOnly: boolean = false;

  constructor() {
  }

  getMetrics() {
    this.metricsWidget = new MetricsWidget();
    this.tasks.forEach((task) => {
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
      return this.metricsWidget;
    });
    return this.metricsWidget;
  }


  ngOnInit() {
    this.counter = this.tasks.length;
    this.getMetrics();
  }

}
