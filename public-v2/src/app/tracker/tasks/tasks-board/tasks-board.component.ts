import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import {BoardViewComponent} from "./views/board/board-view.component";
import {ListViewComponent} from "./views/list/list-view.component";
import {Board} from "../../models/board";
import {BoardsMock} from "../../mocks/boards.mock";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-tasks-board',
  templateUrl: 'tasks-board.component.html',
  entryComponents: [
    BoardViewComponent,
    ListViewComponent
  ]
})
export class TasksBoardComponent implements OnInit {
  @Input() tasks: Task[];

  statusTypes: TaskStatus[];
  boards: Board[] = BoardsMock;
  currentBoard: Board;
  orderByPriory: string = 'desc';
  orderByDate: string = 'asc';
  metricsViewType: number = 2;

  constructor(
    private taskStatusService: TaskStatusService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.statusTypes = taskStatusList);

    this.defaultBoard();
  }

  onChangeBoard(board): void {
    this.currentBoard = board;
  }

  defaultBoard(): void {
    this.currentBoard = this.boards.find(item => item.name === 'board');
  }

  sortByPriority(): void {
    this.orderByPriory = (this.orderByPriory === 'asc')
      ? 'desc'
      : 'asc';
  }

  sortByDate(): void {
    this.orderByDate = (this.orderByDate === 'asc')
      ? 'desc'
      : 'asc';
  }

  changeMetricsView(): void {
    if(this.metricsViewType < 2){
      this.metricsViewType++;
    }else{
      this.metricsViewType = 0;
    }

    this.taskService.setTaskMetricsViewType(this.metricsViewType);
  }
}
