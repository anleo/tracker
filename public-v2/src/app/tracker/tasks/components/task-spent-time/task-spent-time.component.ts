import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {Task} from '../../../models/task';
import {TaskTimes} from './task-times';
import {TaskTime} from "../../../models/task-time";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'spent-time',
  templateUrl: 'task-spent-time.component.html'
})

export class TaskSpentTimeComponent implements OnInit {
  task: Task|null;
  spentTimeValues = TaskTimes;
  oldSpentTime: number = 0;
  addedSpentTime: number = 0;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTask$.subscribe((task: Task) => {
      this.task = task;
    });
    this.oldSpentTime = this.task.spenttime || 0;
  }

  resetTime() {
    this.task.spenttime = this.oldSpentTime;
    this.addedSpentTime = null;
    this.taskService.setEditTask(this.task);
  }

  addTime(time: TaskTime) {
    this.addedSpentTime += time.value;
    this.task.spenttime += time.value;
    this.taskService.setEditTask(this.task);
  }

}
