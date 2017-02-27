import {OnInit, Input} from "@angular/core";
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import {Task} from "../../models/task";

export class BoardBaseComponent implements OnInit {
  @Input() tasks: Task[];
  statusTypes: TaskStatus[];

  constructor(protected taskService: TaskService,
              protected taskStatusService: TaskStatusService) {
  }

  ngOnInit() {
    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.statusTypes = taskStatusList);
  }
}
