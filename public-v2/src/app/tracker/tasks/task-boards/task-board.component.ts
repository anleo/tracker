import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import * as _ from 'lodash';

import {DnDService} from "../../dnd/dnd.service";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoard} from "../../models/task-board";
import {TaskBoardItem} from "../../models/task-board-item";
import {Task} from '../../models/task';
import {Location} from "@angular/common";
import {CurrentTaskService} from "../../services/current-task.service";

import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {BoardService} from "../../services/board.service";


@Component({
  selector: 'task-board',
  templateUrl: 'task-board.component.html',
  providers: [DnDService]
})

export class TaskBoardComponent implements OnInit, OnDestroy {
  newBoard: TaskBoard | null;
  boardItem: TaskBoardItem | null = [];
  boardItems: TaskBoardItem[] | null = [];
  project: Task | null = null;
  boardId: string | null = null;

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
              private location: Location,
              private route: ActivatedRoute,
              private currentTaskService: CurrentTaskService,
              private boardItemService: BoardItemService,
              private dndService: DnDService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.boardId = params['boardId'];
      this.getBoardItems();
    });

    this.route.data
      .subscribe((data: {board: TaskBoardItem}) => this.boardItem = data && data.board);

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });

    this.currentTaskService.rootTask$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => {
        this.project = task || null;
        this.initBoard();
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  back(): void {
    this.location.back();
  }

  getBoardItems(): void {
    this.boardItemService.getBoardItemsByBoardId(this.route.snapshot.params['boardId']).subscribe((boardItems) => this.boardItems = boardItems);
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
      .then((board) => {
        let newBoardItem = new TaskBoardItem();
        newBoardItem.item = board && board._id;
        newBoardItem.board = this.boardId;
        newBoardItem.type = 'board';

        this.boardItemService
          .save(newBoardItem)
          .toPromise()
          .then(() => {
            this.initBoard();
            this.getBoardItems();
          });
      });
  }

  initBoard() {
    this.newBoard = new TaskBoard();
    this.newBoard.project = this.currentTaskService.rootTask && this.currentTaskService.rootTask._id;
  }
}
