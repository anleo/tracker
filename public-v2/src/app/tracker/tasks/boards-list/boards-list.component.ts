import {Component, Input} from '@angular/core';

import {TaskBoard} from '../../models/task-board'

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html'
})
export class BoardsListComponent {
  @Input() boards: TaskBoard[];
}
