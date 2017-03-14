import {Component, OnInit} from "@angular/core";
import {TaskComplexities} from './task-complexities';
import {TaskComplexity} from "../../../models/task-complexity";
import {Task} from '../../../models/task';
import {TaskService} from "../../../services/task.service";
import {TaskByChannel} from "../../../models/task-by-channel";

@Component({
  selector: 'complexity',
  templateUrl: 'task-complexity.component.html'
})
export class TaskComplexityComponent implements OnInit {
  task: Task|null;
  complexities = TaskComplexities;
  complexityValue: number|null;

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.editTask$.subscribe((taskByChannel: TaskByChannel) => {
      this.task = taskByChannel && taskByChannel.task ? taskByChannel.task : null;
    });
    if (this.task && this.task.complexity) {
      this.complexityValue = this.task.complexity;
    }
  }

  setValue(complexity: TaskComplexity): void {
    this.task.complexity = complexity.value;
    this.complexityValue = complexity.value;
    this.taskService.setEditTask(this.task);
  }

}
