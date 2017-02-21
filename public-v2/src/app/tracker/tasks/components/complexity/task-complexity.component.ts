import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {TaskComplexities} from './task-complexities';
import {TaskComplexity} from "../../../models/task-complexity";
import {Task} from '../../../models/task';

@Component({
  selector: 'complexity',
  templateUrl: 'task-complexity.component.html'
})
export class TaskComplexityComponent implements OnInit {
  @Input() task: Task|null;
  @Output() updateTask: EventEmitter<Task> = new EventEmitter();
  complexities = TaskComplexities;
  complexityValue: number|null;

  ngOnInit(): void {
    if (this.task && this.task.complexity) {
      this.complexityValue = this.task.complexity;
    }
  }

  setValue(complexity: TaskComplexity): void {
    this.task.complexity = complexity.value;
    this.updateTask.emit(this.task);
    this.complexityValue = complexity.value;
  }

}
