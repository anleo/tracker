import {Component, Input} from "@angular/core";
import {TaskBoardItem} from "../../../models/task-board-item";


@Component({
  selector: 'board-item-board',
  templateUrl: 'board-item-board.html'
})

export class BoardItemBoardComponent {
  @Input() boardItem: TaskBoardItem | null;
}
