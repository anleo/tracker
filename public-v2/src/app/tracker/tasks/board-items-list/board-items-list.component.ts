import {Component, Input} from '@angular/core';

import {TaskBoardItem} from '../../models/task-board-item'

@Component({
  selector: 'app-board-items-list',
  templateUrl: './board-items-list.component.html'
})
export class BoardItemsListComponent{
  @Input() boardItems: TaskBoardItem[];
}
