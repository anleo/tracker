import {Component, Input} from "@angular/core";
import {TaskBoard} from "../../../models/task-board";
import {TaskBoardItem} from "../../../models/task-board-item";
import {BoardService} from "../../../services/board.service";
import * as _ from 'lodash';

@Component({
  selector: 'board-item-board',
  templateUrl: 'board-item-board.html'
})

export class BoardItemBoardComponent {
  @Input() boardItem: TaskBoardItem | null;

  constructor(private boardService: BoardService){
  }

  edit(board: TaskBoard): void {
    let boardToEdit = _.clone(board);
    this.boardService.editBoard$.next(boardToEdit);
  }
}
