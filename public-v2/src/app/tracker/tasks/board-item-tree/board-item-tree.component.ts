import {Component, Input} from "@angular/core";

@Component({
  selector: 'board-item-tree',
  templateUrl: 'board-item-tree.component.html',
})

export class BoardItemTreeComponent {
  @Input() nodes = [];
}
