import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'task-move',
  templateUrl: 'task-move.component.html'
})

export class TaskMoveComponent implements OnInit {
  @Input() task: Task;

  tasks: Task[] = [];
  search: string = '';

  @Output() onMove: EventEmitter <Task> = new EventEmitter<Task>(null);

  constructor(private taskService: TaskService){}

  ngOnInit(): void {
    this.taskService.getTasksForMove(this.task._id)
      .subscribe(tasks => this.tasks = tasks);
  }

  moveToTask(task: Task): void {
    this.taskService.moveTask(this.task._id, task._id)
      .subscribe(task => this.onMove.emit(task));
  }
}
