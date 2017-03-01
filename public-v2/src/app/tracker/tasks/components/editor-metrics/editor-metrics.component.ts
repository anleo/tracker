import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../services/task.service";
import {Task} from "../../../models/task";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'editor-metrics',
  templateUrl: './editor-metrics.component.html'
})
export class EditorMetricsComponent implements OnInit {
  task: Task;
  parentTaskId: string;
  previousComplexity: number = 0;
  previousSpenttime: number = 0;

  constructor(private taskService: TaskService,
              private route: ActivatedRoute) {
  }

  findParentTaskId(): void {
    this.route.params
      .subscribe((params: Params) => {
          this.parentTaskId = (params['taskId']);
          console.log('taskid', this.parentTaskId);

        },
        err => console.log('err', err));
  }

  getTaskMetrics(task: Task): void {
    this.taskService.getTaskMetrics(task)
      .subscribe((task) => this.task)
  }

  ngOnInit() {
    this.task = this.taskService.editTask;

    if (this.task && !this.task._id) {
      this.task.estimatedTime = 0;
      this.task.spenttime = 0;
      this.task.timeToDo = 0;
      this.findParentTaskId();
      this.task._id = this.parentTaskId
    }
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
              .subscribe((task) => {
                this.taskService.setEditTask(task);
                // this.task = task;
              });
          }
        }
      );
    }
  }
}
