import {Component, OnInit, Input} from '@angular/core';
import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";

@Component({
  selector: 'app-tasks-board',
  templateUrl: 'tasks-board.component.html'
})
export class TasksBoardComponent implements OnInit {
  @Input() tasks: Task[];
  boardTypes: TaskStatus[];

  constructor(private taskService: TaskService,
              private taskStatusService: TaskStatusService) {
  }

  ngOnInit() {
    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.boardTypes = taskStatusList);
  }

}
