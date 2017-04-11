import {Component, Input} from "@angular/core";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'board-item-view',
  templateUrl: 'board-item-view.html'
})

export class BoardItemViewComponent {
  @Input() boardItem: TaskBoardItem | null;
}
