import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {BoardService} from "../../services/board.service";
import {Location} from "@angular/common";
import {CurrentTaskService} from "../../services/current-task.service";
import {DnDService} from "../../dnd/dnd.service";
import {Subject} from "rxjs";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Task} from '../../models/task';

import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import * as _ from 'lodash';
import {BoardWithStatus} from "../../models/board-with-status";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'task-boards',
  templateUrl: 'task-boards.component.html',
  providers: [DnDService]
})

export class TaskBoardsComponent implements OnInit, OnDestroy {
  boardItem: TaskBoardItem | null;
  boardItems: TaskBoardItem[] | null = [];
  project: Task | null = null;
  boardId: string;

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
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: {board: TaskBoardItem}) => this.boardItem = data && data.board);

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

  private onDrop(dropData) {
    let newBoardItem = _.pick(dropData.item, ['board', 'item', 'type']);
    newBoardItem['board'] = dropData.params.parent;

    this.boardItemService.save(newBoardItem).toPromise()
      .then((boardItem) => this.toastr.info('Item was added'))
      .catch((err) =>
        this.toastr.error(JSON.parse(err._body).error.toString(), 'Something was wrong'));
  }
}
