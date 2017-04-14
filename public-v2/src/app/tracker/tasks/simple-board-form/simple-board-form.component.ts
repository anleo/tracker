import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {BoardService} from "../../services/board.service";
import {TaskBoard} from "../../models/task-board";

@Component({
  selector: 'simple-board-form',
  templateUrl: 'simple-board-form.component.html',
})
export class SimpleBoardFormComponent implements OnInit {
  @Input() parentBoard: TaskBoard|null = null;
  @Output() boardSaved = new EventEmitter();
  board: TaskBoard|null = null;

  constructor(private boardService: BoardService) {
  }

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard() {
    this.board = new TaskBoard();
    this.board.project = this.parentBoard && this.parentBoard.project;
  }

  save(): void {
    this.boardService
      .saveChildBoard(this.board, this.parentBoard._id)
      .toPromise()
      .then((board) => {
        this.boardSaved.emit(board);
        this.initBoard();
      });
  }

  reset(): void {
    setTimeout(() => this.initBoard(), 0);
  }
}
