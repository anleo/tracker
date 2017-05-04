import {Component, OnInit, Input, OnChanges} from "@angular/core";
import {BoardItemService} from "../../../services/board-item.service";
import {TaskBoardItem} from "../../../models/task-board-item";

@Component({
  selector: 'board-item-subitems-board',
  templateUrl: 'board-item-subitems-board.component.html'
})

export class BoardItemSubitemsBoardComponent implements OnInit, OnChanges {
  @Input() parentBoardItem: TaskBoardItem | null;
  @Input() refreshCount;
  @Input() sortOptions;
  oldRefreshCount: number;
  boardItems: TaskBoardItem[] = [];

  constructor(private boardItemService: BoardItemService) {
  }

  ngOnInit(): void {
    this.loadChildren();
  }

  ngOnChanges(): void {
    if (this.oldRefreshCount !== this.refreshCount) {
      this.loadChildren();
      this.oldRefreshCount = this.refreshCount;
    }
  }

  private loadChildren() {
    let boardId = this.parentBoardItem && this.parentBoardItem.item && this.parentBoardItem.item._id ?
      this.parentBoardItem.item._id : this.parentBoardItem.item;
    this.boardItemService
      .getBoardItemsByBoardId(boardId)
      .toPromise()
      .then((boardItems) => this.boardItems = boardItems)
      .catch((err) => console.log(err))
  }
}
