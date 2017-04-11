import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {BoardService} from "../../services/board.service";
import {TaskBoard} from "../../models/task-board";
import {CurrentTaskService} from "../../services/current-task.service";
import {DnDService} from "../../dnd/dnd.service";
import {Subject} from "rxjs";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Task} from '../../models/task';

import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import * as _ from 'lodash';

@Component({
  selector: 'task-boards',
  templateUrl: 'task-boards.component.html'
})

export class TaskBoardsComponent implements OnInit, OnDestroy {
  boardItems: TaskBoardItem[] | null = [];
  newBoard: TaskBoard | null;
  project: Task | null = null;

  componentDestroyed$: Subject<boolean> = new Subject();

  statusTypess = [{
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
    }];


  constructor(private boardService: BoardService,
              private boardItemService: BoardItemService,
              private currentTaskService: CurrentTaskService,
              private dndService: DnDService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.currentTaskService.task$
      .subscribe((task) => {
        if (!task) {
          return;
        }

        this.project = task || null;

        this.initBoard();
        this.getBoards();
      });

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  getBoards(): void {
    this.boardItemService
      .getRootBoardItemsByProject(this.currentTaskService.task._id)
      .toPromise()
      .then((boardItems) => this.boardItems = boardItems)
      .catch((err) => console.log(err));
  }

  private onDrop(dropData) {
    let newBoardItem = _.pick(dropData.item, ['board', 'item', 'type']);
    newBoardItem['board'] = dropData.params.parent;

    this.boardItemService.save(newBoardItem).toPromise()
      .then((boardItem) => console.log(boardItem))
      .catch((err) => this.toastr.error(JSON.parse(err._body)));
  }

  save(): void {
    this.boardService
      .saveBoard(this.newBoard)
      .toPromise()
      .then(() => {
        this.initBoard();
        this.getBoards();
      });
  }

  initBoard(): void {
    this.newBoard = new TaskBoard();
    this.newBoard.project = this.currentTaskService.task._id;
  }
}
