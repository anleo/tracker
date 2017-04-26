import {Component, Input, OnInit} from "@angular/core";
import {TaskBoard} from "../../../models/task-board";
import {TaskBoardItem} from "../../../models/task-board-item";
import {BoardService} from "../../../services/board.service";
import * as _ from 'lodash';
import {BoardItemService} from "../../../services/board-item.service";
import {BoardWithStatus} from "../../../models/board-with-status";

@Component({
  selector: 'board-item-board',
  templateUrl: 'board-item-board.html'
})

export class BoardItemBoardComponent implements OnInit{
  @Input() boardItem: TaskBoardItem | null;
  refreshCount: number = null;
  showSubitems: boolean = false;
  showForm: string = 'task';

  constructor(private boardService: BoardService,
              private boardItemService: BoardItemService) {
  }

  ngOnInit(): void {
    this.boardService.editBoardUpdated$.subscribe((res: BoardWithStatus) => {
      res && this.afterBoardUpdate(res);
    });
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

  getBoards(): void {
    // if (this.boardId) {
    //   this.boardItemService.getBoardItemsByBoardId(this.boardId)
    //     .toPromise()
    //     .then((boardItems) => this.boardItems = boardItems)
    //     .catch((err) => console.log(err));
    // } else {
    //   this.boardItemService
    //     .getRootBoardItemsByProject(this.currentTaskService.rootTask._id)
    //     .toPromise()
    //     .then((boardItems) => this.boardItems = boardItems)
    //     .catch((err) => console.log(err));
    // }
  }

  boardSaveHandler(): void {
    this.refreshCount++;
  }

  taskSaveHandler(): void {
    this.refreshCount++;
  }

  updateHandler(): void {
    this.refreshCount++;

    this.boardItemService
      .getById(this.boardItem._id)
      .toPromise()
      .then((boardItem) => {
        this.boardItem = boardItem;
      })
      .catch((err) => console.log(err));
  }

  toggleSubitems(): void {
    this.showSubitems = !this.showSubitems;
  }

  edit(board: TaskBoard): void {
    this.boardService.editBoardModal$.next(true);
    this.boardService.editBoard$.next(_.cloneDeep(board));
  }
}
