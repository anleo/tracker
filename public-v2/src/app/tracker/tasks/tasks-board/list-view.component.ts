import {Component} from '@angular/core';

import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {BoardBaseComponent} from "./board-base.component";

@Component({
  selector: 'list-view',
  templateUrl: 'list-view.component.html'
})
export class ListViewComponent extends BoardBaseComponent {
  constructor(protected taskService: TaskService,
              protected taskStatusService: TaskStatusService) {
    super(taskService, taskStatusService);
  }
}
