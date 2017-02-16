import {Component, OnInit, Input} from '@angular/core';
import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent implements OnInit {
  @Input() tasks: Task[];
  @Input() board;
  constructor(private taskService:TaskService) { }

  ngOnInit() {
  }

}
