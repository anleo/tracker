import {Component, OnInit, Input} from '@angular/core';
import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-tasks-board',
  templateUrl: 'tasks-board.component.html'
})
export class TasksBoardComponent implements OnInit {
  @Input() tasks: Task[];
  boardTypes: any[] = [
    {name: 'New', value: ''},
    {name: 'In progress', value: 'in progress'},
    {name: 'Accepted', value: 'accepted'}
  ];

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
  }

}
