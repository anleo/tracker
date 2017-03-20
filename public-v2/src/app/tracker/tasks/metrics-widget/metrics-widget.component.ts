import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Task} from "../../models/task";
import {MetricsWidget} from "./MetricsWidget";

@Component({
  selector: 'metrics-widget',
  templateUrl: './metrics-widget.component.html'
})
export class MetricsWidgetComponent implements OnInit, OnChanges {
  metricsWidget: MetricsWidget;
  counter: number = 0;

  @Input()
  tasks: Task[];

  @Input()
  simpleOnly: boolean = false;

  ngOnInit() {
    this.tasks && this.tasks.length && this.getWidgetData(this.tasks);
  }

  ngOnChanges(): void {
    this.getWidgetData(this.tasks);
  }

  getMetrics(tasks: Task[]) {
    this.metricsWidget = new MetricsWidget();
    tasks.forEach((task) => {
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

        if (task.spenttime && task.simple) {
          this.metricsWidget.spentime += task.spenttime;
        }
      }
      return this.metricsWidget;
    });
    return this.metricsWidget;
  }

  getWidgetData(tasks: Task[]) {
    this.counter = tasks.length;
    this.getMetrics(tasks);
  }
}
