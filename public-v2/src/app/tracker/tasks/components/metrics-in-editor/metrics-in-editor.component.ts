import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {Task} from "../../../models/task";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'metrics-in-editor',
  templateUrl: 'metrics-in-editor.component.html'
})
export class MetricsInEditorComponent implements OnInit {
  task: Task;
  parentTaskId: string;
  previousComplexity: number = 0;
  previousSpenttime: number = 0;

  constructor(private taskService: TaskService) {
  }

  getTaskMetrics(task: Task): void {
    this.taskService.getTaskMetrics(task)
      .subscribe((task) => this.taskService.setEditTask(task))
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
            this.getTaskMetrics(this.task);
          }
        }
      );
    }
  }
}
