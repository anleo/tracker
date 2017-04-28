import {Component, OnInit, OnDestroy} from "@angular/core";
import {LocalStorageService} from "angular-2-local-storage";

import {BoardService} from "../../services/board.service";
import {Location} from "@angular/common";
import {CurrentTaskService} from "../../services/current-task.service";
import {DnDService} from "../../dnd/dnd.service";
import {Subject} from "rxjs";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Task} from '../../models/task';

import * as _ from 'lodash';
import {BoardWithStatus} from "../../models/board-with-status";
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'task-boards',
  templateUrl: 'task-boards.component.html',
  providers: [DnDService]
})

export class TaskBoardsComponent implements OnInit, OnDestroy {
  board: TaskBoardItem | null;
  boardItems: TaskBoardItem[] | null = [];
  project: Task | null = null;
  boardId: string;

  orderByPriority: string = 'desc';

  componentDestroyed$: Subject<boolean> = new Subject();

  statusTypes = [
    {
      id: 'new',
      name: 'New',
      value: ''
    },
    {
      id: 'in_progress',
      name: 'In progress',
      value: 'in progress'
    },
    {
      id: 'accepted',
      name: 'Accepted',
      value: 'accepted'
    }
  ];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private boardService: BoardService,
              private boardItemService: BoardItemService,
              private currentTaskService: CurrentTaskService,
              private dndService: DnDService,
              private toastService: ToastService,
              private taskService: TaskService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.getLocalConfig();

    this.route.data
      .subscribe((data: {board: TaskBoardItem}) => {
        this.board = data && data.board;
      });

    this.currentTaskService.rootTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => this.project = task || null);

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });

    this.route.params.subscribe((params) => {
      this.boardId = params['boardId'];
      this.getBoards();
      this.boardService.editBoardUpdated$.subscribe((res: BoardWithStatus) => res && this.afterBoardUpdate(res));
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  afterBoardUpdate(res: BoardWithStatus) {
    if (!res) {
      return false;
    }

    if (res.status === 'update') {
      this.getBoards();
    } else if (res.status === 'remove') {
      this.getBoards();
    }
  }

  back(): void {
    this.location.back();
  }

  getBoards(): void {
    if (this.boardId) {
      this.boardItemService.getBoardItemsByBoardId(this.boardId)
        .toPromise()
        .then((boardItems) => this.boardItems = boardItems)
        .catch((err) => console.log(err));
    } else {
      this.boardItemService
        .getRootBoardItemsByProject(this.currentTaskService.rootTask._id)
        .toPromise()
        .then((boardItems) => this.boardItems = boardItems)
        .catch((err) => console.log(err));
    }
  }

  sortByPriority(): void {
    if (this.orderByPriority === 'off') {
      this.orderByPriority = 'asc';
    } else if (this.orderByPriority === 'asc') {
      this.orderByPriority = 'desc';
    } else {
      this.orderByPriority = 'off';
    }

    this.localStorageService.set('boardItems.orderByPriority', this.orderByPriority);
  }

  private onDrop(dropData) {
    let dropZone = dropData.params;
    let newBoardItem = _.pick(dropData.item, ['board', 'item', 'type', '_id']);
    let isBoardDropZone = dropZone.type === 'board';
    let isTaskDropZone = dropZone.type === 'task';
    let isBoard = newBoardItem['type'] === 'board';
    let isTask = newBoardItem['type'] === 'task';

    let ifBoardToBoard = isBoardDropZone && isBoard;
    let ifTaskFromBoardToBoard = isBoardDropZone && isTask && newBoardItem['board'];
    let ifTaskToBoardFromBacklog = isBoardDropZone && isTask && !newBoardItem['board'];
    let ifTaskToTaskFromBacklog = isTaskDropZone && isTask && !newBoardItem['board'];
    let ifTaskToTaskFromBoard = isTaskDropZone && isTask && newBoardItem['board'];

    if (ifTaskFromBoardToBoard || ifTaskToBoardFromBacklog) {
      return this.boardService.checkRelations(dropZone.parent, newBoardItem['item']._id)
        .toPromise()
        .then((hasRelative) => {
          if (hasRelative) {
            this.toastService.info('You have this item in current board')
          }

          newBoardItem['board'] = dropZone.parent;
          this.boardItemService.save(newBoardItem)
            .toPromise()
            .then(() => this.toastService.info('Item was added'))
            .then(() => this.getBoards())
            .catch((err) => this.toastService.error(JSON.parse(err._body).error.toString(), 'Something was wrong'));
        });
    }

    if (ifTaskToTaskFromBoard || ifTaskToTaskFromBacklog) {
      let newBoardItemTask = newBoardItem['item'];
      newBoardItemTask.parentTaskId = dropZone.parent;

      let board = dropZone.board.board && dropZone.board.board._id ? dropZone.board.board._id : dropZone.board.board;
      return this.boardService.checkRelations(board, newBoardItemTask._id)
        .toPromise()
        .then((hasRelative) => {
          if (hasRelative) {
            this.toastService.info('You have this item in current board')
          }

          this.taskService
            .updateTask(newBoardItemTask)
            .toPromise()
            .then(() => this.toastService.info('Item was added'))
            .catch((err) => this.toastService.error(JSON.parse(err._body).error.toString(), 'Something was wrong'));
        });
    }

    if (ifBoardToBoard) {
      newBoardItem['board'] = dropZone.parent;
      return this.boardItemService.save(newBoardItem)
        .toPromise()
        .then(() => this.toastService.info('Item was added'))
        .then(() => this.getBoards())
        .catch((err) => this.toastService.error(JSON.parse(err._body).error.toString(), 'Something was wrong'));
    }
  }

  private getLocalConfig() {
    this.orderByPriority = this.localStorageService.get('boardItems.orderByPriority') as string || 'desc';
  }
}
