import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BoardService} from "../services/board.service";
import {TaskBoard} from "../models/task-board";

@Injectable()
export class TaskBoardResolver implements Resolve<TaskBoard> {
  constructor(private boardService: BoardService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TaskBoard> {
    let boardId = route.params['boardId'] || route.parent.params['boardId'] || null;
    return this.boardService.getBoard(boardId);
  }
}
