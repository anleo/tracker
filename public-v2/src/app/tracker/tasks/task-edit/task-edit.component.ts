import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-edit',
  templateUrl: 'task-edit.component.html'
})
export class TasksEditComponent implements OnInit {
  @Input()
  task: Task|null = null;
  @Output() onUpdate: EventEmitter<Task> = new EventEmitter();

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.task = this.task ? this.task : new Task();
  }

  initTask() {
    this.task = new Task();
  }

  save() {
    if (this.task && this.task.parentTaskId) {
      this.taskService.saveChildTask(this.task).subscribe((task) => {
        this.emitUpdate(task);
        this.initTask();
      });
    } else {
      this.taskService.save(this.task).subscribe((task) => {
        this.emitUpdate(task);
        this.initTask();
      });
    }
  }

  emitUpdate(task: Task) {
    this.onUpdate.emit(task);
  }

  close() {
    this.initTask();
  }

}
