import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {isNull} from "util";

@Component({
  selector: 'app-task-panel',
  templateUrl: 'task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
  @Input() task: Task;
  metricsDetails: number;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.taskService.taskMetricsViewType$
      .map(type => !isNull(type) ? type : 0)
      .subscribe(type => {
        this.metricsDetails = type;
      })
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }
}
