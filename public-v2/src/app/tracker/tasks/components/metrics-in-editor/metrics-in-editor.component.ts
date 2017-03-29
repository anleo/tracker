import {Component, OnInit, OnDestroy} from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {Task} from "../../../models/task";
import {TaskMetricsService} from "../../../services/task-metrics.service";
import {Subject} from "rxjs";

import * as _ from "lodash";

@Component({
  selector: 'metrics-in-editor',
  templateUrl: 'metrics-in-editor.component.html'
})
export class MetricsInEditorComponent implements OnInit, OnDestroy {
  task: Task;
  parentTaskId: string;
  previousComplexity: number = 0;
  previousSpenttime: number = 0;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private taskService: TaskService,
              private taskMetricsService: TaskMetricsService) {
  }

  getTaskMetrics(task: Task): void {
    this.taskService.getTaskMetrics(task)
      .subscribe((task) => {
        this.taskService.setEditTask(task);
        this.task = task;
        this.task.timeToDo = task.estimatedTime ? task.estimatedTime - task.spenttime : 0 - task.spenttime;
      })
  }

  ngOnInit() {
    this.task = this.taskService.editTask;

    if (this.task && this.task._id) {
      this.previousComplexity = this.task.complexity;
      this.previousSpenttime = this.task.spenttime;

      this.taskMetricsService.task$
        .takeUntil(this.componentDestroyed$)
        .subscribe((task) => {
            if (!task) {
              return;
            }

            this.task = task;

            if (_.isNumber(task.spenttime) && this.previousSpenttime !== task.spenttime) {
              this.previousSpenttime = task.spenttime;
              this.task.timeToDo = task.estimatedTime ? task.estimatedTime - task.spenttime : 0;
            }

            if (_.isNumber(task.complexity) && this.previousComplexity !== task.complexity) {
              this.previousComplexity = task.complexity;
              this.getTaskMetrics(this.task);
            }
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
