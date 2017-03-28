import {Component, OnInit, Input, ElementRef, Renderer} from '@angular/core';

import {Task} from '../../models/task'
import {TaskStatusService} from "../../services/task-status.service";
import {TaskStatus} from "../../models/task-status";
import {BoardViewComponent} from "./views/board/board-view.component";
import {ListViewComponent} from "./views/list/list-view.component";
import {Board} from "../../models/board";
import {BoardsMock} from "../../mocks/boards.mock";
import {TaskService} from "../../services/task.service";
import {LocalStorageService} from "angular-2-local-storage";

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
  orderByPriority: string = 'desc';
  orderByDate: string = 'asc';
  metricsViewType: number = 0;

  constructor(private taskStatusService: TaskStatusService,
              private taskService: TaskService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.taskStatusService
      .getTaskStatusList()
      .subscribe(taskStatusList => this.statusTypes = taskStatusList);

    this.defaultBoard();

    this.getLocalConfig();
  }

  onChangeBoard(board): void {
    this.currentBoard = board;
    this.localStorageService.set('currentBoard', board);
  }

  defaultBoard(): void {
    this.currentBoard = this.localStorageService.get('currentBoard') as Board ||
      this.boards.find(item => item.name === 'board');
  }

  sortByPriority(): void {
    if (this.orderByPriority === 'off') {
      this.orderByPriority = 'asc';
    } else if (this.orderByPriority === 'asc') {
      this.orderByPriority = 'desc';
    } else {
      this.orderByPriority = 'off';
    }

    this.localStorageService.set('orderByPriority', this.orderByPriority);
  }

  sortByDate(): void {
    if (this.orderByDate === 'off') {
      this.orderByDate = 'asc';
    } else if (this.orderByDate === 'asc') {
      this.orderByDate = 'desc';
    } else {
      this.orderByDate = 'off';
    }

    this.localStorageService.set('orderByDate', this.orderByDate);
  }

  changeMetricsView(): void {
    if (this.metricsViewType < 2) {
      this.metricsViewType++;
    } else {
      this.metricsViewType = 0;
    }

    this.localStorageService.set('metricsViewType', this.metricsViewType);

    this.taskService.setTaskMetricsViewType(this.metricsViewType);
  }

  getLocalConfig() {
    this.metricsViewType = this.localStorageService.get('metricsViewType') as number || 0;
    this.taskService.setTaskMetricsViewType(this.metricsViewType);

    this.orderByDate = this.localStorageService.get('orderByDate') as string || 'asc';
    this.orderByPriority = this.localStorageService.get('orderByPriority') as string || 'asc';
  }
}
