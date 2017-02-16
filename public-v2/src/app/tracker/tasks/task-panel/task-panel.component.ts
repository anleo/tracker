import {Component, OnInit, Input} from '@angular/core';
import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-panel',
  templateUrl: 'task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
  @Input() task: Task;
  metricsDetails: any;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
  }

}
