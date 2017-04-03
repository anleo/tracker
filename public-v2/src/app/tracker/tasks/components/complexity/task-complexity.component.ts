import {Component, OnInit, OnDestroy, Output, EventEmitter} from "@angular/core";
import {TaskComplexities} from './task-complexities';
import {TaskComplexity} from "../../../models/task-complexity";
import {Task} from '../../../models/task';
import {TaskService} from "../../../services/task.service";
import {TaskMetricsService} from "../../../services/task-metrics.service";
import {Subject} from "rxjs";

@Component({
  selector: 'complexity',
  templateUrl: 'task-complexity.component.html'
})
export class TaskComplexityComponent implements OnInit, OnDestroy {
  task: Task|null;
  complexities = TaskComplexities;
  complexityValue: number|null;
  componentDestroyed$: Subject<boolean> = new Subject();

  @Output() complexityChanged: EventEmitter <Task> = new EventEmitter();

  constructor(public taskService: TaskService,
              private taskMetricsService: TaskMetricsService) {
  }

  ngOnInit(): void {
    this.taskService.editTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task: Task) => {
        this.task = task;

        if (this.task && this.task.complexity) {
          this.complexityValue = this.task.complexity;
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  setValue(complexity: TaskComplexity): void {
    this.task.complexity = complexity.value;
    this.complexityValue = complexity.value;
    this.complexityChanged.emit(this.task);
    this.taskMetricsService.task$.next(this.task);
  }
}
