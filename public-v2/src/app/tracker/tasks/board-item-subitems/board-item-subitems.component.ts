import {Component, Input} from "@angular/core";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'board-item-subitems',
  templateUrl: 'board-item-subitems.component.html'
})

export class BoardItemSubitemsComponent {
  @Input() boardItem: TaskBoardItem | null;
  @Input() refreshCount;
}
