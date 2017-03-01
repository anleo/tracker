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
  flag: number = 0;

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
    if (time.name === '5m') {
      this.flag++;
      if (this.flag === 3) {
        this.addedSpentTime = Math.floor(this.addedSpentTime * 100) / 100;
        this.flag = 0;
      } else {
        this.addedSpentTime = Math.floor(this.addedSpentTime * 1000) / 1000;
      }
    }

    this.task.spenttime += this.addedSpentTime;
    this.taskService.setEditTask(this.task);
  }

}
