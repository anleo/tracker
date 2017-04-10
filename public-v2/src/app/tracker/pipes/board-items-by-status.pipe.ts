import {Pipe, PipeTransform} from '@angular/core';

import {TaskBoardItem} from '../models/task-board-item';

@Pipe({
  name: 'boardItemsByStatusFilter',
  pure: false
})
export class BoardItemsByStatusFilter implements PipeTransform {
  transform(boards: TaskBoardItem[], type: any): TaskBoardItem[] {
    return boards.filter(board => board.item.status === type.value);
  }
}
