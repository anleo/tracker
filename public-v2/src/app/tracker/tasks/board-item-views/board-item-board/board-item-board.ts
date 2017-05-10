import {Component, Input} from "@angular/core";
import {TaskBoard} from "../../../models/task-board";
import {TaskBoardItem} from "../../../models/task-board-item";
import {BoardService} from "../../../services/board.service";
import {BoardItemService} from "../../../services/board-item.service";
import * as _ from 'lodash';
import {RefreshBoardItemService} from "../../../services/refresh-board-item.service";
import {BoardWithStatus} from "../../../models/board-with-status";

@Component({
  selector: 'board-item-board',
  templateUrl: 'board-item-board.html'
})

export class BoardItemBoardComponent {
  @Input() boardItem: TaskBoardItem | null;
  refreshCount: number = null;
  showSubitems: boolean = false;
  showForm: string = 'task';

  constructor(private boardService: BoardService,
              private boardItemService: BoardItemService,
              private refreshBoardItemService: RefreshBoardItemService) {
    this.refreshBoardItemService.onChangeItem$
      .subscribe((item) => {
        if (item && item.board && this.boardItem && this.boardItem.item && item.board._id === this.boardItem.item._id) {
          if (this.boardItem.board === null) {
            this.refreshBoardItemService.refreshRoot$.next(this.boardItem);
            this.refreshCount++;
            return;
          }

          this.refreshCount++;
          this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
        }
      });

    this.boardService.editBoardUpdated$
      .subscribe((boardWithStatus) => this.actionProvider(boardWithStatus));
  }

  boardSaveHandler(): void {
    this.refreshCount++;
  }

  taskSaveHandler(): void {
    this.refreshCount++;
  }

  toggleSubitems(): void {
    this.showSubitems = !this.showSubitems;
  }

  edit(board: TaskBoard): void {
    this.boardService.editBoardModal$.next(true);
    this.boardService.editBoard$.next(_.cloneDeep(board));
  }

  removeBoardItem(boardItem: TaskBoardItem): void {
    if (!boardItem.board) {
      this.boardService.removeBoard(boardItem.item);
      this.refreshBoardItemService.refreshRoot$.next(this.boardItem);
      return;
    }

    this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    this.boardItemService.remove(boardItem);
  };

  private actionProvider(boardWithStatus): void|boolean {
    if (!boardWithStatus) {
      return false;
    }

    if (!this.boardItem) {
      return false;
    }

    if (boardWithStatus.status === 'update') {
      this.onUpdate(boardWithStatus);
    } else if (boardWithStatus.status === 'move') {
      this.onMove(boardWithStatus);
    } else if (boardWithStatus.status === 'remove') {
      this.onRemove(boardWithStatus);
    } else if (boardWithStatus.status === 'close') {
      this.boardService.editBoardModal$.next(false);
    }
  }

  private amI(boardWithStatus) {
    return this.boardItem && this.boardItem.item._id === boardWithStatus.board._id;
  }

  private onUpdate(boardWithStatus) {
    if (this.amI(boardWithStatus)) {
      this.boardItem.item = boardWithStatus.board;
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.boardSaveHandler();
  }

  private onMove(boardWithStatus) {
    if (this.amI(boardWithStatus)) {
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.boardSaveHandler();
  }

  private onRemove(boardWithStatus) {
    if (this.amI(boardWithStatus)) {
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.boardSaveHandler();
  }
}
