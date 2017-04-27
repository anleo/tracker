import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {TaskBoard} from "../../models/task-board";
import {TaskBoardItem} from "../../models/task-board-item";
import {BoardItemService} from "../../services/board-item.service";

@Component({
  selector: 'simple-task-form',
  templateUrl: 'simple-task-form.component.html',
})
export class SimpleTaskFormComponent implements OnInit {
  @Input() parentTask: Task|null = null;
  @Input() parentBoard: TaskBoard|null = null;
  @Output() taskSaved = new EventEmitter();
  task: Task|null = null;
  boardItem: TaskBoardItem|null = null;

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    if (this.parentTask) {
      this.initTask();
    } else if (this.parentBoard) {
      this.initBoardItem();
    }
  }

  initBoardItem() {
    this.task = new Task();
    this.task.parentTaskId = this.parentBoard && this.parentBoard.project;

    this.boardItem = new TaskBoardItem();
    this.boardItem.board = this.parentBoard && this.parentBoard._id;
    this.boardItem.type = 'task';
  }

  initTask() {
    this.task = new Task();
    this.task.parentTaskId = this.parentTask && this.parentTask._id;
  }

  saveBoardItem() {
    this.taskService
      .saveChildTask(this.task)
      .toPromise()
      .then((task) => setTimeout(() => {
        this.boardItem.item = task && task._id;

        this.boardItemService.save(this.boardItem).toPromise()
          .then(() => {
            this.initBoardItem();
            this.taskSaved.emit(task);
          })
          .catch((err) => console.log(err));
      }, 0))
      .catch((err) => console.log(err));
  }

  saveTask() {
    if (this.task && this.task.parentTaskId) {
      this.taskService
        .saveChildTask(this.task)
        .toPromise()
        .then((task) => setTimeout(() => {
          this.initTask();
          this.taskSaved.emit(task);
        }, 0))
        .catch((err) => console.log(err));
    } else {
      this.taskService
        .save(this.task)
        .toPromise()
        .then((task) => setTimeout(() => {
          this.initTask();
          this.taskSaved.emit(task);
        }, 0))
        .catch((err) => console.log(err));
    }
  }

  save(): void {
    if (this.parentTask) {
      this.saveTask();
    } else if (this.parentBoard) {
      this.saveBoardItem();
    }
  }

  reset(): void {
    setTimeout(() => this.init(), 0);
  }
}
