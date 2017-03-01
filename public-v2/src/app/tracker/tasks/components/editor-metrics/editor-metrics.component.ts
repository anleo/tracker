import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {Task} from "../../../models/task";

@Component({
  selector: 'editor-metrics',
  templateUrl: './editor-metrics.component.html'
})
export class EditorMetricsComponent implements OnInit {
  task: Task;
  previousComplexity: number = 0;
  previousSpenttime: number = 0;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.task = this.taskService.editTask;

    if (this.task && this.task._id) {
      this.previousComplexity = this.task.complexity;
      this.previousSpenttime = this.task.spenttime;
      this.taskService.editTask$.subscribe((task) => {
          this.task = task;
          if (task.spenttime && this.previousSpenttime !== task.spenttime) {
            this.previousSpenttime = task.spenttime;
            this.task.timeToDo = task.estimatedTime ? task.estimatedTime - task.spenttime : 0;

          }
          if (task.complexity && this.previousComplexity !== task.complexity) {
            this.previousComplexity = task.complexity;
            this.taskService.getTaskMetrics(this.task)
              .subscribe((task) => this.task)
          }
        }
      );
    }


  }

}
