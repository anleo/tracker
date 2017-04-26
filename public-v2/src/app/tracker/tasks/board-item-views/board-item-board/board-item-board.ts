import {Component, Input} from "@angular/core";
import {TaskBoard} from "../../../models/task-board";
import {TaskBoardItem} from "../../../models/task-board-item";
import {BoardService} from "../../../services/board.service";
import {BoardItemService} from "../../../services/board-item.service";
import * as _ from 'lodash';

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
              private boardItemService: BoardItemService) {
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
      return;
    }

    this.boardItemService.remove(boardItem);
  };
}
