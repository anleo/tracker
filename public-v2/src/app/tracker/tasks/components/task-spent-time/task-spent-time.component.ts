import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {Task} from '../../../models/task';
import {TaskTimes} from './task-times';
import {TaskTime} from "../../../models/task-time";
import {TaskService} from "../../../services/task.service";
import {TaskByChannel} from "../../../models/task-by-channel";

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
    this.taskService.editTask$.subscribe((taskByChannel: TaskByChannel) => {
      this.task = taskByChannel && taskByChannel.task ? taskByChannel.task : null;
    });
    this.oldSpentTime = this.task && this.task.spenttime || 0;
  }

  resetTime() {
    this.flag = 0;
    this.task.spenttime = this.oldSpentTime;
    this.addedSpentTime = null;
    this.taskService.setEditTask(this.task);
  }

  fixSpenttimeMathematicalError(addedTime: number): number {

    this.flag++;
    if (this.flag === 3) {
      addedTime = Math.floor(addedTime * 100) / 100;
      this.flag = 0;
    } else {
      addedTime = Math.floor(addedTime * 1000) / 1000;
    }
    return addedTime;
  }

  calculationAddedSpenttime(time: TaskTime): number {
    let addedTime ;
    if (time.name === '5m') {
      addedTime = this.fixSpenttimeMathematicalError(time.value);
    } else {
      addedTime = time.value;
    }
    return Math.ceil(addedTime* 1000) / 1000;
  }

  addTime(time: TaskTime) {
    this.addedSpentTime += this.calculationAddedSpenttime(time);
    this.task.spenttime += this.calculationAddedSpenttime(time);
    this.taskService.setEditTask(this.task);
  }

}
