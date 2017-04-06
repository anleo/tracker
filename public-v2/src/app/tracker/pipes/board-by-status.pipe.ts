import {Pipe, PipeTransform} from '@angular/core';

import {TaskBoard} from '../models/task-board';

@Pipe({
  name: 'boardsByStatusFilter',
  pure: false
})
export class BoardsByStatusFilter implements PipeTransform {
  transform(boards: TaskBoard[], type: any): TaskBoard[] {
    return boards.filter(board => board.status === type.value);
  }
}
