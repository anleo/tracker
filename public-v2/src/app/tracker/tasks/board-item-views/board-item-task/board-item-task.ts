import {Component, Input} from "@angular/core";
import {TaskBoardItem} from "../../../models/task-board-item";


@Component({
  selector: 'board-item-task',
  templateUrl: 'board-item-task.html'
})

export class BoardItemTaskComponent {
  @Input() boardItem: TaskBoardItem | null;
}
