import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {Task} from '../../../models/task';
import {TaskTimes} from './task-times';
import {TaskTime} from "../../../models/task-time";

@Component({
  selector: 'spent-time',
  templateUrl: 'task-spent-time.component.html'
})

export class TaskSpentTimeComponent implements OnInit {
  @Input() task: Task|null;
  @Output() updatedSpentTime: EventEmitter<TaskTime> = new EventEmitter();
  times = TaskTimes;
  oldSpentTime: number = 0;
  addedSpentTime: number = 0;

  ngOnInit(): void {
    this.oldSpentTime = this.task.spenttime || 0;
  }

  resetTime() {
    this.task.spenttime = this.oldSpentTime;
    this.addedSpentTime = null;
  }

  addTime(time: TaskTime) {
    this.addedSpentTime += time.value;
    this.task.spenttime += time.value;
  }

}
