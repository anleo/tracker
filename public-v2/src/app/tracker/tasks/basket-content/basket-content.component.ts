import {Component, OnInit, Input} from '@angular/core';
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'basket-content',
  templateUrl: './basket-content.component.html'
})
export class BasketContentComponent implements OnInit {
  @Input() basketId: string;
  boardItems: TaskBoardItem[] = [];

  constructor(private boardItemService: BoardItemService) {
  }

  ngOnInit() {
    this.boardItemService.getBoardItemsByBoardId(this.basketId)
      .subscribe((boardItems) => {
        this.boardItems = boardItems;
      })
  }

  showStatus(status){
    return status === ''? 'new': status;
  }

}
