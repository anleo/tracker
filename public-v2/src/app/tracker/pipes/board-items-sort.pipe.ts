import {Pipe, PipeTransform} from '@angular/core';
import {SortByFieldsPipe} from "./sort-by-fields.pipe";
import {TaskBoardItem} from "../models/task-board-item";

@Pipe({name: 'boardItemsSort'})

export class BoardItemsSortPipe extends SortByFieldsPipe {
  defaultSortingParams = {
    fields: ['item.priority', 'item.updatedAt'],
    orders: ['desc', 'asc']
  };

  transform(boardItems: TaskBoardItem[], sortParams) {
    return super.transform(boardItems, sortParams);
  }
}
