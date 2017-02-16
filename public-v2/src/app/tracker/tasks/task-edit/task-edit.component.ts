import {Component, OnInit, Input} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-edit',
  templateUrl: 'task-edit.component.html'
})
export class TasksEditComponent implements OnInit {
  @Input()
  task: Task|null = null;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.task = this.task ? this.task : new Task();
  }

  initTask() {
    this.task = new Task();
  }

  save() {
    this.taskService.save(this.task).subscribe((task) => console.log('>>>>> ', task))
  }

  close() {
    this.initTask();
  }

}
