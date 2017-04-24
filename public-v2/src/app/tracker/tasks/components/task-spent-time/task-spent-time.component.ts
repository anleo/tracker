import {Component, Output, OnInit, EventEmitter, OnDestroy} from "@angular/core";
import {Task} from '../../../models/task';
import {TaskTimes} from './task-times';
import {TaskTime} from "../../../models/task-time";
import {TaskService} from "../../../services/task.service";
import {TaskMetricsService} from "../../../services/task-metrics.service";
import {Subject} from "rxjs";

@Component({
  selector: 'spent-time',
  templateUrl: 'task-spent-time.component.html'
})

export class TaskSpentTimeComponent implements OnInit, OnDestroy {
  task: Task|null;
  spentTimeValues = TaskTimes;
  oldSpentTime: number = 0;
  addedSpentTime: number = 0;
  flag: number = 0;
  componentDestroyed$: Subject<boolean> = new Subject();

  @Output() spentTimeChanged: EventEmitter <Task> = new EventEmitter();

  constructor(public taskService: TaskService,
              private taskMetricsService: TaskMetricsService) {
  }

  ngOnInit(): void {
    this.taskService.editTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task: Task) => {
      this.task = task;
    });

    this.oldSpentTime = this.task.spenttime || 0;
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  resetTime() {
    this.flag = 0;
    this.task.spenttime = 0;
    this.addedSpentTime = null;
    this.taskMetricsService.task$.next(this.task);
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
    let addedTime;

    if (time.name === '5m') {
      addedTime = this.fixSpenttimeMathematicalError(time.value);
    } else {
      addedTime = time.value;
    }

    return Math.ceil(addedTime * 1000) / 1000;
  }

  addTime(time: TaskTime) {
    this.addedSpentTime += this.calculationAddedSpenttime(time);
    this.task.spenttime += this.calculationAddedSpenttime(time);
    this.spentTimeChanged.emit(this.task);
    this.taskMetricsService.task$.next(this.task);
  }

}
