import {Component, OnInit, Input} from '@angular/core';

import {TaskService} from "../../../../services/task.service";
import {TaskStatusService} from "../../../../services/task-status.service";
import {BoardBaseComponent} from "../../board-base.component";
import {TaskStatus} from "../../../../models/task-status";

@Component({
  selector: 'board-view',
  templateUrl: 'board-view.component.html'
})
export class BoardViewComponent extends BoardBaseComponent implements OnInit {
  @Input() statusTypes: TaskStatus[];

  constructor(protected taskService: TaskService,
              protected taskStatusService: TaskStatusService) {
    super(taskService, taskStatusService);
  }

  ngOnInit() {
    if (!this.statusTypes) {
      this.taskStatusService
        .getTaskStatusList()
        .subscribe(taskStatusList => this.statusTypes = taskStatusList);
    }
  }

  setClass() {
    let listsCount = this.statusTypes && this.statusTypes.length;
    let colCount = 12 / listsCount;
    let classIndex = colCount >= 3 ? Math.round(colCount) : 3;
    return 'col-sm-' + classIndex;
  }
}
