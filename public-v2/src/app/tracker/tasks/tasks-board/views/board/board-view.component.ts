import {Component} from '@angular/core';

import {TaskService} from "../../../../services/task.service";
import {TaskStatusService} from "../../../../services/task-status.service";
import {BoardBaseComponent} from "../../board-base.component";

@Component({
  selector: 'board-view',
  templateUrl: 'board-view.component.html'
})
export class BoardViewComponent extends BoardBaseComponent {
  constructor(protected taskService: TaskService,
              protected taskStatusService: TaskStatusService) {
    super(taskService, taskStatusService);
  }

  checkComplexity(item) {
    return item.simple;
  }
}
